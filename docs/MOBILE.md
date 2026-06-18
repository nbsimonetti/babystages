# Mobile build guide (Capacitor → iOS & Android)

The native apps wrap the built web client (`client/dist`). The React code is
shared verbatim; native capabilities come from Capacitor plugins.

## Prerequisites
- Node 18+ and the project installed (`npm run install:all` at repo root).
- **iOS:** macOS + Xcode + CocoaPods, an Apple Developer account.
- **Android:** Android Studio + JDK 17 + Android SDK, a Google Play Console account.

## One-time setup
```bash
cd babystages/client
npm install                      # installs Capacitor deps added to package.json
# Point the app at your hosted API for device builds:
echo "VITE_API_BASE=https://api.babystages.app/api" > .env.production
npm run build                    # produces dist/
npm run cap:add:ios              # creates ios/ native project (macOS only)
npm run cap:add:android          # creates android/ native project
```

## Iterate
```bash
npm run mobile:build             # vite build + cap sync (copies web → native)
npm run cap:ios                  # opens Xcode → run on simulator/device
npm run cap:android              # opens Android Studio → run on emulator/device
```

## Native capabilities to wire (plugins already in package.json)
- **Push notifications** (`@capacitor/push-notifications`) — register the device
  token on launch, send it to the API, and trigger milestone-window reminders
  from the backend via APNs (iOS) and FCM (Android). This is a premium feature
  and a key retention lever. Requires APNs key (Apple) + FCM project (Google).
- **Preferences** (`@capacitor/preferences`) — store the auth token in the OS
  keychain/keystore instead of localStorage on native.
- **Splash screen / status bar** — branded launch; configured in
  `capacitor.config.ts`.
- **Share / PDF** — replace the web `window.print()` export with a native share
  sheet (add `@capacitor/share` + a PDF generator) for the pediatrician summary.

## In-app purchases
Use **RevenueCat's Capacitor plugin** (`@revenuecat/purchases-capacitor`) for the
native purchase flow. Configure products in App Store Connect & Play Console,
mirror them in RevenueCat, and have RevenueCat call `POST /api/billing/webhook`
to grant entitlements server-side. The web `Paywall.tsx` mock is replaced by
RevenueCat's `getOfferings()` / `purchasePackage()` on native; keep the same
tiers and gating.

## App Review notes
- Provide native value beyond the website (push, offline, share) — Capacitor
  apps that do are routinely approved.
- Include **Sign in with Apple** if you add Google/social login (Apple rule).
- **Account deletion** is reachable in-app (Account screen) — required by both
  stores.
- Digital subscriptions MUST use Apple IAP / Play Billing (no external links to
  pay for digital content). Affiliate links to **physical** goods are allowed.
