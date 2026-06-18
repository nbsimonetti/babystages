import { Router } from 'express';
import { db } from '../store.js';
import { requireAuth } from '../auth.js';
import { entitlement } from '../entitlements.js';

const router = Router();
router.use(requireAuth);

function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt,
    subscription: u.subscription || { plan: 'free', status: 'none' },
  };
}

// Current user + entitlement — the client calls this on launch to know which
// features to unlock.
router.get('/me', async (req, res) => {
  const user = await db.findUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'Account not found.' });
  res.json({ user: publicUser(user), entitlement: entitlement(user) });
});

// Data export (GDPR/CCPA right to access). Returns everything we hold for the user.
router.get('/export', async (req, res) => {
  const user = await db.findUserById(req.userId);
  if (!user) return res.status(404).json({ error: 'Account not found.' });
  res.setHeader('Content-Disposition', 'attachment; filename="babystages-export.json"');
  res.json({
    exportedAt: new Date().toISOString(),
    user: publicUser(user),
    children: await db.childrenForUser(req.userId),
  });
});

// Permanent account deletion (App Store & Google Play requirement).
router.delete('/', async (req, res) => {
  const ok = await db.deleteUser(req.userId);
  if (!ok) return res.status(404).json({ error: 'Account not found.' });
  res.json({ ok: true });
});

export default router;
