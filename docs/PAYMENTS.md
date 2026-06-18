# Payments — RevenueCat + App Store / Google Play

Subscriptions use **RevenueCat** to manage Apple In-App Purchase and Google Play
Billing behind one API. Entitlements are granted **server-side from verified
webhook events** — the client never asserts premium itself.

## How it fits together
```
App (native)                 RevenueCat                 Our API
  Purchases.configure(            │                         │
    appUserID = our user.id)      │                         │
  purchasePackage() ───buy───▶  Apple/Google                │
                                  │ verifies receipt        │
                                  ├── webhook event ───────▶ POST /api/billing/webhook
                                  │   (Authorization: secret) │  verify + map → subscription
  refreshMe()/getMe() ◀───────── entitlement (premium) ◀────┘
```

## Server (implemented)
- `POST /api/billing/webhook` verifies the `Authorization` header against
  `REVENUECAT_WEBHOOK_SECRET`, maps the event (`server/revenuecat.js`), and saves
  the user's `subscription`. Always returns 200 for unknown users/event types.
- Event mapping: INITIAL_PURCHASE/RENEWAL/PRODUCT_CHANGE/UNCANCELLATION →
  active (or trialing); CANCELLATION → canceled (still entitled until
  `currentPeriodEnd`); BILLING_ISSUE → active (grace); EXPIRATION → free.
- `isPremium()` treats active/trialing/canceled-before-period-end as premium.

### Configure in RevenueCat
1. Create products in **App Store Connect** + **Play Console**:
   `premium_monthly`, `premium_annual`, `premium_lifetime` (+ 7-day trial).
2. In RevenueCat: add the apps + products, create an **entitlement** `premium`,
   and an **offering** containing the three packages.
3. **Integrations ▸ Webhooks**: URL = `https://<api-host>/api/billing/webhook`,
   Authorization header = your `REVENUECAT_WEBHOOK_SECRET` (set the same value as
   a server env var).

## Client (to wire — needs SDK + keys)
Install the SDK in the mobile build and set the keys (`client/.env`):
```
VITE_REVENUECAT_IOS_KEY=appl_xxx
VITE_REVENUECAT_ANDROID_KEY=goog_xxx
```
```bash
npm i @revenuecat/purchases-capacitor
```
On login, identify the user so the webhook's `app_user_id` matches:
```ts
import { Purchases } from '@revenuecat/purchases-capacitor';
await Purchases.configure({ apiKey: iosOrAndroidKey });
await Purchases.logIn({ appUserID: user.id });   // CRITICAL: our user.id
```
Replace the paywall's mock purchase with real offerings:
```ts
const { current } = (await Purchases.getOfferings()).all ? await Purchases.getOfferings() : {};
const pkg = current?.availablePackages.find(p => p.identifier === tier);
await Purchases.purchasePackage({ aPackage: pkg });
await refreshMe();          // entitlement arrives via the webhook
```
Add **Restore Purchases** → `Purchases.restorePurchases()` then `refreshMe()`.
On logout: `Purchases.logOut()`.

> Until the SDK + keys are added, the app uses the mock billing endpoints
> (`/api/billing/mock/*`, disabled in production) so premium gating is testable
> locally. Swap the single purchase call in `Paywall.tsx` / `AuthContext.subscribe`
> for the RevenueCat calls above.

## Testing
- **Sandbox:** use Apple sandbox testers / Play license testers; RevenueCat shows
  events in its dashboard and fires the webhook.
- **Server webhook (no devices):** POST a sample event with the Authorization
  header to `/api/billing/webhook` and confirm `/account/me` flips to premium
  (this is exactly what the automated smoke test does).

## Store rules
- Digital subscriptions MUST go through Apple IAP / Play Billing (RevenueCat does
  this) — never an external payment link for digital content.
- Offer **Restore Purchases**; surface auto-renew + management in-app/store.
- Affiliate links remain physical-goods only (separate revenue, no IAP).
