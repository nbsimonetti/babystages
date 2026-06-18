# BabyStages — Compliance & Privacy Posture

> Operational guidance, not legal advice. Have counsel review before launch,
> especially given health + children's-information context.

## Classification: parent-facing, not a "kids app"
BabyStages is designed for **parents/caregivers (adults 18+)**. It is **not**
"directed to children" and should **not** be listed in kids/Designed-for-Families
categories. It does, however, store information *about* children (entered and
controlled by the parent), so we apply heightened care regardless.

- **Age gate / eligibility:** Terms require users to be 18+ and the guardian or
  authorized caregiver.
- **No behavioral ads, ever.** No third-party ad SDKs, no profiling of children.
- **Data minimization:** only what the features need (email, hashed password,
  child name/birthday/avatar/observed milestones).

## COPPA (US)
Because the app targets parents (not children) and runs no child-directed ads,
COPPA's child-operator obligations are largely avoided. Still: minimize data,
let the parent delete everything, and never monetize children's data. If a kids
edition is ever built, full COPPA verifiable-parental-consent applies.

## GDPR / GDPR-K (EU/UK)
- **Lawful basis:** contract (providing the service) + consent where applicable.
- **Rights:** access/export (Account → Export), erasure (Account → Delete),
  rectification (edit child), portability (JSON export).
- **Data processors:** hosting, Postgres, email provider, RevenueCat, error
  monitoring — list in the privacy policy; sign DPAs.
- **Transfers:** use providers with EU regions or SCCs.

## CCPA/CPRA (California)
- We **do not sell or share** personal information. Provide access + deletion
  (already built). Add a "Do Not Sell/Share" statement (N/A since we don't).

## Apple — App Store
- **App Privacy "nutrition label"** (declare honestly):
  - *Data linked to you:* email (account), user content (child profiles &
    milestones), purchases (subscription status).
  - *Used for:* App Functionality only. **Not** for tracking or ads.
  - *Tracking:* None → no ATT prompt needed.
- **Sign in with Apple** required if any third-party login is offered.
- **Account deletion** in-app (built).
- **Health disclaimer** prominent; avoid diagnostic claims.
- **IAP** for all digital subscriptions (Guideline 3.1.1).

## Google Play — Data Safety form
- **Data collected:** email, app activity (milestones), purchase history.
- **Shared:** none for ads. **Encrypted in transit:** yes. **Deletion:** yes,
  in-app + provide a web deletion URL.
- Comply with **Subscriptions**, **Health apps**, and **Families** policy
  declarations (declare it is not designed for children).

## Security baseline
- Passwords hashed (bcrypt). HTTPS everywhere. Secrets in platform secret store.
- JWT access tokens short-lived + refresh tokens (Phase 1). Native tokens in
  keychain/keystore. Rate limit auth endpoints. Audit logging for deletions.

## Content integrity
- Sourced from CDC, AAP, WHO, NIH; citations shown in-app (`About & sources`).
- "Typical ranges, not deadlines" framing throughout; persistent "not medical
  advice" disclaimer. Recommend a one-time pediatric professional review and
  versioning the dataset (`milestones.ts`).
