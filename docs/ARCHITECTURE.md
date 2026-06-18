# BabyStages — Architecture & Migration Analysis

## Where it started
- **Client:** React + TypeScript + Vite + Tailwind, React Router. All product
  value lives here: the evidence-based dataset, age math, and the 9 feature
  sections.
- **Server:** Express + JWT + bcrypt with a **JSON-file datastore**, plus an
  in-app password-reset code (no email).

## Reuse vs. replace (decision)

| Layer | Decision | Why |
|---|---|---|
| `data/milestones.ts`, `sources.ts`, `products.ts` | **Reuse as-is** | The defensible, cited content is the core asset. Portable across web & native. |
| `lib/age.ts`, `lib/entitlements.ts` | **Reuse as-is** | Pure TypeScript domain logic. |
| React components & screens | **Reuse via Capacitor** | Ship the verified UI to both stores without a rewrite. |
| Auth (JWT + bcrypt) | **Keep + harden** | Add refresh tokens, Sign in with Apple/Google, email-based reset. |
| Datastore (JSON file) | **Replace with Postgres** | Concurrency, durability, backups, scale. |
| Billing | **Add** | RevenueCat + Apple IAP / Google Play Billing. |

## Mobile stack choice: Capacitor (with React Native as the alternative)

**Chosen: Capacitor.** It wraps the already-built, already-verified web app in
native iOS/Android shells, so we reuse ~100% of the code and ship fast. We add
native capability (push notifications, secure storage, splash, status bar, share/
PDF) through Capacitor plugins, which is what differentiates it from a "thin
wrapper" in App Review terms.

**Alternative considered: React Native + Expo.** A more native feel, but a full
UI rewrite. The shared TypeScript domain (`data/*`, `lib/*`) would port directly,
but every screen would be rebuilt. Choose this later if/when native polish or
heavy native interactions justify the cost. Document path is in `MOBILE.md`.

## Target production architecture

```
┌──────────────┐    HTTPS     ┌──────────────────────┐
│  iOS / Android│  ──────────▶ │  API (Express/Node)  │
│  (Capacitor)  │              │  - JWT + refresh     │
│  React web UI │◀──────────── │  - Sign in w/ Apple  │
└──────┬────────┘   entitle    │  - email (Postmark)  │
       │ native plugins        │  - receipt verify    │
       │ push / IAP            └─────────┬────────────┘
       ▼                                 ▼
  RevenueCat ──webhook──▶ API      Managed Postgres (Prisma)
  (App Store / Play Billing)       + automated backups
```

- **Hosting:** API on Fly.io / Render / Railway / AWS; Postgres managed; secrets
  in the platform secret store; Sentry for errors; structured logs.
- **Entitlements** are derived server-side from **verified** store receipts via
  RevenueCat webhooks (`/api/billing/webhook`) — never trusted from the client.

## Postgres migration (from the JSON store)
The data layer is already isolated in `server/db.js` behind small methods
(`findUserByEmail`, `addChild`, `updateUser`, `deleteUser`, …). Swap the
implementation for Prisma without touching routes:

```prisma
model User  { id String @id @default(uuid()) email String @unique passwordHash String
              name String? subscription Json? resetTokenHash String? resetTokenExp BigInt?
              createdAt DateTime @default(now()) children Child[] }
model Child { id String @id @default(uuid()) userId String name String birthday String
              sex String avatar String premature Boolean dueDate String observed String[]
              createdAt DateTime @default(now()) updatedAt DateTime @updatedAt
              user User @relation(fields:[userId], references:[id], onDelete: Cascade) }
```
Keep the method names identical so `routes/*` are unchanged. `onDelete: Cascade`
gives correct account deletion for free.

## What's implemented now (this iteration)
- Entitlement system (`server/entitlements.js`) + subscription field on users.
- Subscription tiers, paywall, gating (2nd child, PDF export), affiliate section.
- Account deletion, data export, `/account/me` entitlement endpoint.
- Email-pluggable password reset (`server/mailer.js`, dev-logs the code).
- Configurable API base (`VITE_API_BASE`) for native builds.
- Capacitor config + scripts + plugin set.

## Still to wire (needs your accounts/machines)
- Postgres + Prisma; hosted API; Sentry.
- Sign in with Apple + Google; refresh tokens; real email provider.
- RevenueCat + App Store Connect / Play Console products; receipt verification.
- `cap add ios/android` + native builds (Xcode / Android Studio), signing.
See `RELEASE_CHECKLIST.md`.
