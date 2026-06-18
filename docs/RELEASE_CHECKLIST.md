# Release Checklist — App Store & Google Play

## 0. Pre-flight (both)
- [ ] Backend on production host with **Postgres**, HTTPS, backups, Sentry.
- [ ] `JWT_SECRET` + all secrets set; `NODE_ENV=production` (disables mock billing).
- [ ] Real **email provider** wired in `server/mailer.js`.
- [ ] Sign in with Apple + Google implemented; refresh tokens; secure token storage.
- [ ] Privacy Policy + Terms hosted at public URLs.
- [ ] Pediatric content review done; dataset versioned; disclaimers visible.
- [ ] `VITE_API_BASE` points to the hosted API in `.env.production`.

## 1. Payments (RevenueCat)
- [ ] Create subscription products (`premium_monthly/annual/lifetime`) in App Store
      Connect **and** Play Console; add free trial.
- [ ] Mirror products + entitlement ("premium") in RevenueCat.
- [ ] Native purchase flow via `@revenuecat/purchases-capacitor`; "Restore".
- [ ] RevenueCat webhook → `POST /api/billing/webhook` grants entitlement
      server-side (verify secret); receipts validated. Test sandbox purchases.

## 2. Apple App Store
- [ ] Apple Developer Program ($99/yr); App ID `app.babystages`; capabilities
      (Push, Sign in with Apple).
- [ ] `npm run cap:add:ios` → set version/build, icons, splash, launch screen.
- [ ] **App Privacy** answers per `COMPLIANCE.md` (no tracking → no ATT).
- [ ] In-app **account deletion** present (built) ✔.
- [ ] APNs key for push; test notifications.
- [ ] Screenshots (6.7"/6.5"), description, keywords, support/marketing URLs.
- [ ] Archive in Xcode → upload → **TestFlight** → external test → submit for review.
- [ ] Reviewer notes: parent-facing health-info app, not directed to children;
      explain medical disclaimer + sources; demo account credentials.

## 3. Google Play
- [ ] Play Console ($25 one-time); app created; `app.babystages`.
- [ ] `npm run cap:add:android` → set versionCode/name, icons, splash, adaptive icon.
- [ ] **Data safety** form per `COMPLIANCE.md`; **account-deletion URL** provided.
- [ ] Content rating questionnaire; target audience = adults (not Designed for
      Families); health-app + subscriptions declarations.
- [ ] FCM for push; test notifications.
- [ ] Feature graphic + phone/tablet screenshots; descriptions.
- [ ] Signed **AAB** (Play App Signing) → **internal testing** → closed → production
      (staged rollout, e.g. 10% → 100%).

## 4. Post-launch
- [ ] Monitor Sentry, crash-free rate, store reviews.
- [ ] Paywall/onboarding A/B tests (RevenueCat experiments).
- [ ] Track funnel: install → trial → paid → retention/renewal.
- [ ] Iterate content; expand localizations; respond to review feedback.

## Store-rule reminders
- Digital subscriptions **must** use Apple IAP / Play Billing — no external pay
  links for digital content.
- Affiliate links are for **physical** goods only; keep FTC disclosure.
- Account deletion must be reachable in-app on **both** stores.
- Don't make diagnostic/medical claims; keep "not medical advice" prominent.
