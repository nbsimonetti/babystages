// Single source of truth for what a user is entitled to. Entitlements are
// derived from the user's subscription record, which in production is set only
// from VERIFIED App Store / Google Play receipts (via RevenueCat webhooks).
// Locally, the mock billing routes set it for testing.

export const FREE_LIMITS = {
  maxChildren: 1,
  milestoneHistory: false,
  pdfExport: false,
  pushReminders: false,
  caregiverSharing: false,
};

export const PREMIUM_LIMITS = {
  maxChildren: null, // null = unlimited
  milestoneHistory: true,
  pdfExport: true,
  pushReminders: true,
  caregiverSharing: true,
};

export function isPremium(user) {
  const s = user && user.subscription;
  if (!s || s.plan !== 'premium') return false;
  // A canceled-but-not-yet-expired subscription keeps access until period end.
  if (s.currentPeriodEnd && Date.parse(s.currentPeriodEnd) < Date.now()) return false;
  return ['active', 'trialing', 'canceled'].includes(s.status);
}

export function entitlement(user) {
  const premium = isPremium(user);
  return {
    plan: premium ? 'premium' : 'free',
    premium,
    limits: premium ? PREMIUM_LIMITS : FREE_LIMITS,
    subscription: (user && user.subscription) || { plan: 'free', status: 'none' },
  };
}
