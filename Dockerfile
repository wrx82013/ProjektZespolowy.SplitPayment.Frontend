# ============ 1) Dependencies =============
FROM node:20-bookworm-slim AS deps
WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client \
 && rm -rf /var/lib/apt/lists/*

# Lockfiles -> powtarzalne instalacje
COPY package.json package-lock.json* ./
# Dev deps są potrzebne do builda Next
RUN npm ci --include=dev

# ============ 2) Builder =============
FROM node:20-bookworm-slim AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Pozwala przełączać tryb bez dotykania next.config.js
# (jeśli masz warunek w next.config.js na NEXT_STATIC_EXPORT)
ARG NEXT_STATIC_EXPORT=false
ENV NEXT_STATIC_EXPORT=${NEXT_STATIC_EXPORT}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build Next.js (wygeneruje .next/standalone albo /out)
RUN npm run build

# Uporządkuj artefakty do jednego, zawsze istniejącego katalogu
# - standalone -> /app/_deploy/server.js + /.next/static + /public
# - export     -> /app/_deploy/out
RUN set -eux; \
    mkdir -p /app/_deploy; \
    if [ -f "/app/.next/standalone/server.js" ]; then \
        echo "Detected standalone build"; \
        cp -R /app/.next/standalone/* /app/_deploy/; \
        mkdir -p /app/_deploy/.next; \
        if [ -d "/app/.next/static" ]; then cp -R /app/.next/static /app/_deploy/.next/static; fi; \
        if [ -d "/app/public" ]; then cp -R /app/public /app/_deploy/public; fi; \
        touch /app/_deploy/.mode_standalone; \
    elif [ -d "/app/out" ]; then \
        echo "Detected static export"; \
        cp -R /app/out /app/_deploy/out; \
        touch /app/_deploy/.mode_export; \
    else \
        echo "ERROR: No .next/standalone or /out produced by build" >&2; \
        exit 2; \
    fi

# ============ 3) Runner =============
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Użytkownik bez uprawnień roota
RUN groupadd -g 1001 nodejs \
 && useradd -r -u 1001 -g nodejs nextjs

# Serwer do statycznego exportu
RUN npm i -g serve

# Jeden COPY – zawsze istniejący payload z buildera
COPY --from=builder /app/_deploy /app/

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Warunkowy start na podstawie przygotowanych artefaktów
CMD [ "sh", "-c", "if [ -f .mode_standalone ]; then node server.js; elif [ -f .mode_export ]; then serve -s out -l $PORT; else echo 'No known build mode detected' && exit 1; fi" ]
