# ============ 1) Dependencies =============
FROM node:20-bookworm-slim AS deps
WORKDIR /app

# Minimalne pakiety systemowe (szybsze npm ci)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ca-certificates git openssh-client \
 && rm -rf /var/lib/apt/lists/*

# Pliki lock dla powtarzalnych instalacji
COPY package.json package-lock.json* ./
RUN npm ci --include=dev

# ============ 2) Builder =============
FROM node:20-bookworm-slim AS builder
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Pozwala kontrolować tryb buildu bez dotykania next.config.js
# (w Twoim next.config.js masz warunek na NEXT_STATIC_EXPORT)
ARG NEXT_STATIC_EXPORT=false
ENV NEXT_STATIC_EXPORT=${NEXT_STATIC_EXPORT}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build – wygeneruje .next/standalone (standalone) lub /out (export)
RUN npm run build

# ============ 3) Runner =============
FROM node:20-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Użytkownik nierooto­wy
RUN groupadd -g 1001 nodejs \
 && useradd -r -u 1001 -g nodejs nextjs

# Narzędzie do serwowania statyki gdy build był "export"
RUN npm i -g serve

# Kopiowanie artefaktów buildu:
# - jeśli był 'standalone', to mamy .next/standalone + .next/static + public
# - jeśli był 'export', to mamy /out
# "|| true" zapewnia, że warunkowe kopie nie wywalą buildu
COPY --from=builder /app/.next/standalone ./ || true
COPY --from=builder /app/.next/static ./.next/static || true
COPY --from=builder /app/public ./public || true
COPY --from=builder /app/out ./out || true

# W trybie standalone pakiety runtime są już w .next/standalone/node_modules,
# ale package.json bywa czytany przez server.js – po skopiowaniu standalone
# on już jest w root, więc nic więcej nie trzeba.

RUN chown -R nextjs:nodejs /app
USER nextjs

EXPOSE 3000

# Start:
# - jeżeli po COPY istnieje server.js (standalone) => odpal Node
# - w przeciwnym razie, jeśli jest katalog /out (export) => serwuj statykę
CMD [ "sh", "-c", "if [ -f server.js ]; then node server.js; elif [ -d out ]; then serve -s out -l $PORT; else echo 'Brak .next/standalone i brak /out. Upewnij się, że build wygenerował artefakty.' && exit 1; fi" ]
