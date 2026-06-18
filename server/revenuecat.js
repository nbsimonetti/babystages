// Maps a RevenueCat webhook event to our internal subscription record.
// RevenueCat posts { api_version, event }. We set RevenueCat's app_user_id to our
// user.id at login (see docs/PAYMENTS.md), so event.app_user_id IS our user id.
//
// Entitlements are derived from VERIFIED webhook events only — never trusted from
// the client. isPremium() (entitlements.js) then gates features off the resulting
// subscription (active/trialing/canceled-until-period-end = premium).

function tierFromProduct(productId = '') {
  const p = String(productId).toLowerCase();
  if (p.includes('annual') || p.includes('year')) return 'premium_annual';
  if (p.includes('life')) return 'premium_lifetime';
  if (p.includes('month')) return 'premium_monthly';
  return 'premium';
}

// Events that mean the user currently has (or regains) access.
const ACTIVE_TYPES = new Set([
  'INITIAL_PURCHASE',
  'RENEWAL',
  'PRODUCT_CHANGE',
  'UNCANCELLATION',
  'NON_RENEWING_PURCHASE',
  'SUBSCRIPTION_EXTENDED',
]);

export function userIdFromEvent(event) {
  return event && (event.app_user_id || event.original_app_user_id);
}

export function subscriptionFromEvent(event) {
  if (!event || !event.type) return null;
  const type = event.type;
  const tier = tierFromProduct(event.product_id);
  const periodEnd = event.expiration_at_ms
    ? new Date(Number(event.expiration_at_ms)).toISOString()
    : null;
  const trialing = event.period_type === 'TRIAL';
  const base = {
    tier,
    provider: 'revenuecat',
    currentPeriodEnd: periodEnd,
    trialEndsAt: trialing ? periodEnd : null,
    updatedAt: new Date().toISOString(),
  };

  if (type === 'EXPIRATION') return { ...base, plan: 'free', status: 'expired' };
  // Auto-renew off, but still entitled until period end (isPremium honors this).
  if (type === 'CANCELLATION') return { ...base, plan: 'premium', status: 'canceled' };
  // Grace period: keep premium; the period-end date governs actual access.
  if (type === 'BILLING_ISSUE') return { ...base, plan: 'premium', status: 'active' };
  if (ACTIVE_TYPES.has(type)) {
    return { ...base, plan: 'premium', status: trialing ? 'trialing' : 'active' };
  }
  // TEST / TRANSFER / SUBSCRIBER_ALIAS / etc. — no state change here.
  return null;
}
