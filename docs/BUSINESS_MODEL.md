# BabyStages — Business Model

> All figures below are **planning assumptions**, not guarantees. Validate with
> real funnel data after launch.

## Strategy: freemium subscription + affiliate

A genuinely useful free tier drives installs and trust (critical for a health
product), premium converts engaged parents, and tasteful affiliate links monetize
free users without compromising the medical content.

### Tiers

| | Free | Premium |
|---|---|---|
| Children | 1 | Unlimited + family view |
| Developmental Window, Dos/Don'ts, Safety, "When to call doctor" | ✅ (never paywalled) | ✅ |
| Milestone tracker | Current stage | Full history + all stages |
| Milestone push reminders | — | ✅ |
| Partner / caregiver sharing | — | ✅ |
| PDF summary for pediatrician | — | ✅ |
| Offline access · ad-free | limited | ✅ |

**Pricing (USD, localize per market):**
- Monthly **$4.99**
- Annual **$39.99** (~$3.33/mo — the hero offer)
- Lifetime **$79.99** (one-time; cash-flow + commitment-averse users)
- **7-day free trial** on subscriptions.

**Ethical guardrail:** safety-critical guidance (safe sleep, choking, "when to
talk to your doctor") is **never** behind the paywall.

### Affiliate (secondary)
- Stage-based product ideas (books, developmental toys, safety gear) via Amazon
  Associates and similar, implemented in `data/products.ts` + `AffiliatePicks`.
- FTC-compliant disclosure on every placement; `rel="sponsored nofollow"`.
- Physical goods only → no Apple/Google IAP requirement, no rev-share to stores.
- Estimate: a few percent of free users click; small per-order commission. Treat
  as margin, not the core.

## Unit economics (illustrative assumptions)
- Store fee: 30% yr 1 → **15%** after 12 months (Apple/Google small-business &
  retained-subscriber rates) — RevenueCat handles the accounting.
- Assume free→trial **8–12%**, trial→paid **30–40%**, annual churn **~40%**.
- Net annual revenue per paying user ≈ $39.99 × ~0.85 (after blended fees) ≈ **$34**.
- Example: 50k installs → ~5k trials → ~1.8k payers → ≈ **$60k/yr** subscription
  net + affiliate upside. Sensitivity entirely on conversion + retention — fund
  paywall A/B testing and onboarding.

## Growth levers
- **Onboarding paywall** after first "wow" (seeing the child's current stage).
- **Push reminders** for upcoming milestones → retention → renewal.
- **Referral / partner sharing** (the second caregiver becomes an install).
- **ASO** (see `STORE_LISTING.md`) + content/SEO (the milestone data is great
  organic-search bait via a marketing site).
- Seasonal annual-plan promos.

## Costs
- Hosting + managed Postgres (low at start), email provider, RevenueCat (free
  under a revenue threshold, then a small %), Apple ($99/yr) + Google ($25 once)
  developer accounts, Sentry, optional pediatric content review (recommended).

## Risk & compliance notes
- Health + children's data → privacy is a feature; never sell data, no child
  ad-profiling. See `COMPLIANCE.md`.
- Don't overstate medical authority; "informational, not medical advice" stays
  prominent. A one-time pediatric professional content review de-risks both
  trust and store approval.
