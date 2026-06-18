# BabyStages — Shopping List to Ship

Everything below requires **your** accounts/credentials/decisions — the code is
built and verified. Items are tagged **[Launch]** (needed to publish) or
**[Recommended]** / **[Optional]**. Costs are approximate and can change.

---

## 1. Developer accounts (stores)
| Item | Cost | For | Feeds |
|---|---|---|---|
| **Apple Developer Program** [Launch, iOS] | **$99 / year** | App Store publishing, Sign in with Apple, APNs push | `APPLE_CLIENT_ID`, APNs key |
| **Google Play Developer** [Launch, Android] | **$25 one-time** | Play Store publishing, FCM push | Play products, FCM |

## 2. Build tooling / hardware
| Item | Cost | Notes |
|---|---|---|
| **Mac + Xcode** [Launch, iOS] | Mac required | Needed to build/sign/submit iOS (`npm run cap:add:ios`, archive). No Mac → use a Mac cloud/CI (e.g. Codemagic/EAS) |
| **Android Studio + JDK 17** [Launch, Android] | Free | Build/sign the Android AAB |

## 3. Cloud infrastructure
| Item | Cost | For | Feeds |
|---|---|---|---|
| **API hosting** (Fly.io or Render) [Launch] | Free tier → ~$5–7/mo | Run the Express API (configs ready: `fly.toml`, `render.yaml`, `Dockerfile`) | — |
| **Managed Postgres** (Render / Neon / Supabase / Fly) [Launch] | Free tier → ~$5–20/mo | Production DB | `DATABASE_URL`, `USE_PRISMA=1` |
| **Domain name** (e.g. babystages.app) [Launch] | ~$12–15/yr | API host, privacy/terms URLs, deep links (`.app` forces HTTPS) | `VITE_API_BASE`, policy URLs |
| **Transactional email** (Postmark / SendGrid / AWS SES) [Launch] | Free dev tier → ~$15/mo | Password-reset + verification emails (wire in `server/mailer.js`) | `EMAIL_PROVIDER` |
| **Error monitoring** (Sentry) [Recommended] | Free tier | Crash/error tracking | SDK key |

## 4. Authentication credentials
| Item | Cost | For | Feeds |
|---|---|---|---|
| **Google OAuth Client ID** (Google Cloud Console) [Recommended] | Free | "Sign in with Google" | `GOOGLE_CLIENT_ID`, `VITE_GOOGLE_CLIENT_ID` |
| **Apple Sign in / Services ID** (in Apple Developer) [Launch if any social login] | Included w/ Apple | "Sign in with Apple" (required by Apple if Google login is offered) | `APPLE_CLIENT_ID` |
| **Strong `JWT_SECRET`** [Launch] | Free | Sign access tokens (`openssl rand -hex 32`) | `JWT_SECRET` |

## 5. Monetization
| Item | Cost | For | Feeds |
|---|---|---|---|
| **RevenueCat account** [Launch for subscriptions] | Free under a monthly-tracked-revenue threshold, then ~1% | Cross-platform IAP/Play Billing + entitlements; webhook already built | `REVENUECAT_WEBHOOK_SECRET`, `VITE_REVENUECAT_IOS_KEY`, `VITE_REVENUECAT_ANDROID_KEY` |
| **Subscription products** in App Store Connect + Play Console [Launch] | — (rev-share: ~30% yr 1 → 15%) | `premium_monthly` / `premium_annual` / `premium_lifetime` + 7-day trial | RevenueCat offering |
| **Amazon Associates** (or other affiliate) [Optional] | Free (approval needed) | Affiliate product links | `AFFILIATE_TAG` in `client/src/data/products.ts` |
| **Banking/tax** for store payouts [Launch for revenue] | — | Apple/Google require bank + tax info to receive money | — |

## 6. Content, legal & design
| Item | Cost | For |
|---|---|---|
| **Pediatric professional content review** [Recommended] | Varies | Trust + smoother store review of a health app; sign off `milestones.ts` |
| **Legal review** of Privacy Policy / Terms [Recommended] | Varies | Tailor the `docs/` templates to your entity/jurisdiction |
| **App icon + screenshots + feature graphic** [Launch] | DIY or designer | Store listings (plan in `STORE_LISTING.md`) |
| **Support email + URL** [Launch] | Domain-covered | Required store metadata |

---

## Cost snapshot
- **One-time:** Google Play $25; design assets (DIY = $0).
- **Annual:** Apple $99; domain ~$12–15.
- **Monthly (start small, free tiers cover MVP):** hosting + Postgres + email
  ≈ **$0–30/mo**; RevenueCat + store fees are a % of revenue (nothing until you earn).
- **Realistic minimum to publish both stores:** **~$125 first year** (Apple $99 +
  Google $25 + ~$0 infra on free tiers) + a domain.

## Minimum path to launch (smallest viable set)
1. Apple Developer ($99) + Google Play ($25) + a Mac (or Mac-cloud CI).
2. Domain + API host + Postgres (free tiers) → set `USE_PRISMA=1`, `DATABASE_URL`,
   `JWT_SECRET`; deploy (`docs/DEPLOY.md`).
3. Email provider → wire `server/mailer.js`.
4. RevenueCat + store subscription products → set secrets/keys; finish the native
   purchase call (`docs/PAYMENTS.md`).
5. (If offering Google login) add Google OAuth **and** Sign in with Apple.
6. Icon + screenshots + hosted Privacy/Terms URLs.
7. Build, sign, submit per `docs/RELEASE_CHECKLIST.md`.

## Engineering still to do (small, unlock-dependent — I can do these once you have the above)
- Wire the native **RevenueCat purchase** call + Restore (replaces the mock) — needs RC keys.
- Add **social sign-in UI buttons** + SDK — needs Google/Apple credentials.
- Secure **native token storage** (`@capacitor/preferences` Keychain/Keystore).
- Lock **CORS** to your web origin; add **rate limiting** on `/auth/*`.
- (Optional) **email verification** on signup — buildable now without any account.

> Already done & verified in this repo: full app + UI, JSON↔Postgres data layer,
> Prisma schema, deploy configs, refresh tokens, Apple/Google verification backend,
> RevenueCat webhook, account deletion/export, compliance + store docs.
