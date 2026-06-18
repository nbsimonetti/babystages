# 🍼 BabyStages

A child-development & parenting companion web app. Enter a child's birthday and
instantly see **what to expect right now**, **what's coming next**, and **how to
support healthy development** — with every claim sourced from trusted,
evidence-based authorities (CDC, AAP/HealthyChildren, WHO, NIH).

Supports **user accounts**, **multiple children per family**, a **focused
single-child view**, and a **family overview**.

## Sections (per child, age-aware)

- **Developmental Window** — what's happening developmentally right now, by domain
  (physical/motor, cognitive, language, social/emotional, feeding & sleep).
- **Upcoming Milestones** — a preview of the next stage(s) with concrete,
  source-backed tips on how to prepare for and encourage each one. The lookahead
  horizon scales with the child's age (weeks → months → a year).
- **Dos & Don'ts** — what to do and avoid to encourage development.
- **Daily Rhythms** — typical sleep totals and feeding patterns.
- **Play & Activity Ideas** — development-promoting activities.
- **Safety Checklist** — age-relevant safety reminders.
- **When to Talk to Your Doctor** — CDC "act early" signs, framed supportively.
- **Milestone Tracker** — check off milestones as you observe them, with a live
  progress indicator spanning the current stage and (collapsible) earlier stages.
  Framed as a celebration of progress, never a checklist a child "must" complete.

Family Overview shows a card per child (age, current stage, the nearest upcoming
milestone). A child switcher lets you jump between focused views.

Premature babies are supported via **corrected age** (per AAP guidance).

## Accounts

Email + password accounts (JWT sessions, bcrypt-hashed passwords) keep each
family's data private and synced to the server. A **password reset** flow is
included (`POST /api/auth/forgot` + `/api/auth/reset`, with a hashed, 1-hour
token). There's no email service wired up locally, so the reset code is surfaced
in-app — in production you'd deliver it by email instead.

## Tech

- **Client:** React + TypeScript + Vite + Tailwind CSS, React Router.
- **Server:** Node + Express, JWT auth, bcrypt-hashed passwords. Data persists to
  a JSON file (`server/data/db.json`) — pure-JS, no native build steps. Swap for
  SQLite/Postgres for production scale.

## Run it

```bash
cd babystages
npm install                # installs concurrently (root)
npm run install:all        # installs server + client deps
npm run dev                # starts API (:4000) and client (:5188)
```

Then open http://localhost:5188 and create an account.

> The client dev server uses a fixed port **5188** (`strictPort`) so it won't
> collide with other Vite projects that default to 5173. Change it in
> `client/vite.config.ts` if needed.

### Production-style build

```bash
npm run build              # builds the client into client/dist
npm start                  # Express serves the API + built client on :4000
```

Set a real secret in production: `JWT_SECRET=<random-long-string>`.

## Data & sourcing

All milestone/guidance content lives in `client/src/data/milestones.ts`, with
sources in `client/src/data/sources.ts`. Content is organized into age bands
aligned to the CDC's "Learn the Signs. Act Early." checkpoints (2022 update with
the AAP), WHO motor-development standards, and AAP HealthyChildren guidance.

**Milestones are typical ranges, not deadlines.** This app is informational only
and is **not medical advice** — always consult a pediatrician with concerns.

## Going to production (mobile + monetization)

Groundwork to ship to the **App Store & Google Play** with a freemium model:

- **Subscriptions & gating:** entitlements (`server/entitlements.js`), tiers +
  paywall (`client/src/components/Paywall.tsx`); free tier = one child, Premium
  unlocks unlimited children, full tracker, reminders, sharing, and PDF export.
  Mock billing endpoints for local testing; **RevenueCat** + Apple IAP / Play
  Billing in production.
- **Affiliate:** stage-based product ideas with FTC disclosure
  (`client/src/data/products.ts`, `AffiliatePicks.tsx`).
- **Account:** in-app **account deletion** + **data export** (`/account`),
  email-pluggable password reset (`server/mailer.js`).
- **Mobile:** Capacitor config + scripts (`client/capacitor.config.ts`); set
  `VITE_API_BASE` for native builds (see `client/.env.example`).

Full plan in [`docs/`](docs/): **ARCHITECTURE, MOBILE, BUSINESS_MODEL, ROADMAP,
COMPLIANCE, PRIVACY_POLICY, TERMS_OF_SERVICE, STORE_LISTING, RELEASE_CHECKLIST**.

**Local premium testing:** open the paywall (try adding a 2nd child) or call
`POST /api/billing/mock/subscribe`; revert with `/mock/cancel`. Mock billing is
disabled when `NODE_ENV=production`.
