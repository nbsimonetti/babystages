# BabyStages — Phased Roadmap

## Phase 0 — Done (this repo)
- Verified web app: accounts, multi-child, 9 sections, milestone tracker,
  corrected age, password reset.
- Monetization layer: entitlements, subscription tiers, paywall, gating
  (2nd child, PDF export), affiliate section.
- Account deletion, data export, email-pluggable reset.
- Capacitor config + scripts; configurable API base.
- Full compliance & store doc set.

## Phase 1 — Production backend (1–2 weeks)
- Migrate JSON store → **Postgres + Prisma** (method names unchanged).
- Host API; Sentry; backups; rate limiting; HTTPS.
- **Refresh tokens** + secure native token storage (Keychain/Keystore).
- Real **email provider** for reset/verification.
- Real **account deletion** confirmation + soft-delete grace window (optional).

## Phase 2 — Auth & store identity (in progress)
- ✅ **Refresh tokens** — short-lived access (1h) + rotating 30-day refresh,
  transparent refresh-on-401 + revoke-on-logout. See `docs/AUTH.md`.
- ✅ **Sign in with Apple / Google — backend scaffolded** (real JWKS verification
  in `server/social.js`; set `GOOGLE_CLIENT_ID` / `APPLE_CLIENT_ID`). Remaining:
  wire the client SDK buttons (needs OAuth credentials) + secure native token
  storage (Keychain/Keystore via `@capacitor/preferences`).
- ☐ Email verification on signup.

## Phase 3 — Payments (in progress)
- ✅ **Webhook entitlement granting** — `/api/billing/webhook` verifies the
  RevenueCat Authorization secret and maps events → subscription
  (`server/revenuecat.js`); entitlements are server-verified only. See
  `docs/PAYMENTS.md`.
- ☐ App Store Connect + Play Console subscription products + RevenueCat offering.
- ☐ Native purchase flow (`@revenuecat/purchases-capacitor`): configure with
  `appUserID = user.id`, replace the mock paywall purchase, add Restore Purchases.

## Phase 4 — Native polish & engagement (1–2 weeks)
- **Push notifications** (APNs + FCM) for milestone reminders.
- Native share/PDF export for the pediatrician summary.
- Offline cache/sync hardening; splash/icon/status bar.
- Accessibility pass; i18n scaffolding.

## Phase 5 — Store submission (ongoing)
- Build, sign, screenshots, metadata/ASO, privacy answers.
- TestFlight + Play internal testing → staged rollout.
- See `RELEASE_CHECKLIST.md`.

## Phase 6 — Growth (post-launch)
- Paywall + onboarding A/B testing (RevenueCat experiments).
- Referral/partner sharing; marketing site + content SEO.
- Pediatric professional content review; expand age bands & localizations.
- Optional: web app subscription parity (Stripe) for cross-platform users.
