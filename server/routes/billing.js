import { Router } from 'express';
import { db } from '../store.js';
import { requireAuth } from '../auth.js';
import { entitlement } from '../entitlements.js';
import { subscriptionFromEvent, userIdFromEvent } from '../revenuecat.js';

const router = Router();

// --- RevenueCat webhook (public) ----------------------------------------------
// Configure RevenueCat to POST here with an Authorization header equal to
// REVENUECAT_WEBHOOK_SECRET. We verify it, map the event to a subscription, and
// persist it on the user. Entitlements ONLY come from these verified events.
router.post('/webhook', async (req, res) => {
  const secret = process.env.REVENUECAT_WEBHOOK_SECRET;
  if (secret && req.headers.authorization !== secret) {
    return res.status(401).json({ error: 'Invalid webhook signature.' });
  }
  const event = req.body && req.body.event;
  if (!event) return res.status(400).json({ error: 'Missing event.' });

  const userId = userIdFromEvent(event);
  const subscription = subscriptionFromEvent(event);
  if (userId && subscription) {
    const user = await db.findUserById(userId);
    if (user) await db.updateUser(userId, { subscription });
  }
  // Always 200 so RevenueCat doesn't retry (unknown users/event types are no-ops).
  res.json({ received: true });
});

router.use(requireAuth);

router.get('/status', async (req, res) => {
  res.json({ entitlement: entitlement(await db.findUserById(req.userId)) });
});

// --- MOCK purchase (development only) -----------------------------------------
// Lets you exercise premium gating locally. Disabled in production, where
// entitlements come exclusively from verified store receipts.
const TIERS = {
  premium_monthly: 30,
  premium_annual: 365,
  premium_lifetime: null, // null period = never expires
};

router.post('/mock/subscribe', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Mock billing is disabled in production.' });
  }
  const tier = (req.body && req.body.tier) || 'premium_annual';
  if (!(tier in TIERS)) return res.status(400).json({ error: 'Unknown tier.' });
  const days = TIERS[tier];
  const subscription = {
    plan: 'premium',
    tier,
    status: 'active',
    provider: 'mock',
    currentPeriodEnd: days == null ? null : new Date(Date.now() + days * 86400000).toISOString(),
    trialEndsAt: null,
    updatedAt: new Date().toISOString(),
  };
  const user = await db.updateUser(req.userId, { subscription });
  res.json({ entitlement: entitlement(user) });
});

router.post('/mock/cancel', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ error: 'Mock billing is disabled in production.' });
  }
  const user = await db.findUserById(req.userId);
  const subscription = {
    ...(user.subscription || {}),
    plan: 'free',
    status: 'canceled',
    currentPeriodEnd: null,
    updatedAt: new Date().toISOString(),
  };
  res.json({ entitlement: entitlement(await db.updateUser(req.userId, { subscription })) });
});

export default router;
