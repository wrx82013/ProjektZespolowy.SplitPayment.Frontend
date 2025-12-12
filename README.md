# SplitPayment — Product & Implementation (Gemini MD)

**Project**: SplitPayment — web app for splitting bills and collecting payments  
**Authors / Team**: Karol Wojtowicz, Maciej Dorynek, Grzegorz Kaczmarek, Nikodem Biryło.  
**Stack (chosen)**: Next.js (Frontend), TailwindCSS, Backend: .NET C#, CI: GitHub Actions, Hosting: Vercel (FE) + AWS Lightsail (BE).

---

**TL;DR**

SplitPayment lets users create bill-splitting calculations, share via link/QR, optionally attach receipts (OCR), and optionally collect payments (BLIK/apple pay/links). The MVP focuses on calculation UI, history, and shareable immutable links. App must be responsive and PWA-ready.

---

# Goals & MVP

## Core goals

- Fast, responsive UI for mobile & desktop.
- Create advanced splits (equal, % share, exclude items, per-item assignment).
- Persist calculations locally and on backend (history & share links).
- Generate immutable shareable links / QR codes.
- Simple deploy pipeline (Vercel FE, Lightsail BE).

## MVP features

- Create calculation (items, participants, tax/fees, per-item exclusions).
- Save / view history (localStorage + optional BE).
- Share calc via stable link (id — read-only snapshot).
- Responsive layout & basic PWA manifest.
- CI pipeline for FE build & deploy.

## Nice-to-have (post-MVP)

- OCR for receipts (PNG/PDF).
- Event planning with RSVP.
- Payment integrations (BLIK, Apple Pay, Klarna etc).
- Desktop Electron wrapper, browser extension.

---

# UX / Pages (route map)

- `/` — Landing / Create new calculation
- `/calc/new` — Stepper: participants → items → review → share
- `/calc/[id]` — Read-only shared calculation (immutable snapshot)
- `/dashboard` — User calculations (history) — local + synced
- `/calc/[id]/edit` — (optional) editable when owner
- `/settings` — PWA / payment options / profile
- `/ocr` — upload receipt → OCR → draft calculation (optional)
- `/api/*` — BE endpoints

---

# Data model (client-side / simple)

```
Calculation {
  id: string
  title?: string
  createdAt: ISODate
  owner?: { name?, email? }
  participants: [{ id, name, email?, phone? }]
  items: [{ id, name, price: number, assignedTo: [participantId], exclude: [participantId], quantity: number }]
  fees: [{ name, amount, type: 'absolute'|'percent' }]
  currency: 'PLN' | 'EUR' | 'USD'
  snapshotHash?: string
}
```

---

# Frontend architecture

- **Framework**: Next.js + App Router
- **Styling**: TailwindCSS
- **State**: React Context or Zustand
- **Persistence**: localStorage + sync
- **Forms**: React Hook Form
- **Testing**: Vitest, Playwright
- **CI**: GitHub Actions + Vercel

---

# Tailwind & Next config (starter snippets)

`tailwind.config.js`

```js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
```

`next.config.js`

```js
const isProd = process.env.NODE_ENV === "production";
module.exports = {
  reactStrictMode: true,
  images: { domains: ["yourcdn.example.com"] },
};
```

`package.json`

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest"
  }
}
```

---

# CI / Deployment

- FE: Vercel from `main` branch.
- BE: AWS Lightsail.
- Secrets in GH + Vercel.

---

# Testing

- Unit: Vitest + React Testing Library.
- E2E: Playwright.

---

# Delivery plan

1. Scaffolding
2. Calc editor
3. Local persistence
4. Share link
5. CI + deploy
6. OCR + PWA enhancements
