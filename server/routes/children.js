import { Router } from 'express';
import { randomUUID } from 'node:crypto';
import { db } from '../store.js';
import { requireAuth } from '../auth.js';
import { entitlement } from '../entitlements.js';

const router = Router();
router.use(requireAuth);

function sanitize(body = {}) {
  const out = {};
  if (typeof body.name === 'string') out.name = body.name.trim().slice(0, 60);
  if (typeof body.birthday === 'string') out.birthday = body.birthday.slice(0, 10);
  if (body.sex === 'male' || body.sex === 'female' || body.sex === '') out.sex = body.sex;
  if (typeof body.avatar === 'string') out.avatar = body.avatar.slice(0, 16); // emoji/initials
  out.premature = Boolean(body.premature);
  if (typeof body.dueDate === 'string') out.dueDate = body.dueDate.slice(0, 10);
  return out;
}

function validBirthday(d) {
  if (!d || !/^\d{4}-\d{2}-\d{2}$/.test(d)) return false;
  const t = Date.parse(d);
  if (Number.isNaN(t)) return false;
  return t <= Date.now() + 1000 * 60 * 60 * 24; // allow today; not far future
}

router.get('/', async (req, res) => {
  res.json({ children: await db.childrenForUser(req.userId) });
});

router.post('/', async (req, res) => {
  // Free tier is limited to one child; adding more requires Premium.
  const ent = entitlement(await db.findUserById(req.userId));
  const count = (await db.childrenForUser(req.userId)).length;
  if (ent.limits.maxChildren != null && count >= ent.limits.maxChildren) {
    return res.status(402).json({
      error: 'The free plan supports one child. Upgrade to Premium to add the whole family.',
      code: 'upgrade_required',
    });
  }
  const data = sanitize(req.body);
  if (!data.name) return res.status(400).json({ error: "Please enter the child's name." });
  if (!validBirthday(data.birthday)) {
    return res.status(400).json({ error: 'Please enter a valid birthday (not in the future).' });
  }
  const now = new Date().toISOString();
  const child = {
    id: randomUUID(),
    userId: req.userId,
    name: data.name,
    birthday: data.birthday,
    sex: data.sex || '',
    avatar: data.avatar || '',
    premature: data.premature || false,
    dueDate: data.premature ? data.dueDate || '' : '',
    observed: [],
    createdAt: now,
    updatedAt: now,
  };
  await db.addChild(child);
  res.status(201).json({ child });
});

router.put('/:id', async (req, res) => {
  const data = sanitize(req.body);
  if (data.name === '') return res.status(400).json({ error: "Name can't be empty." });
  if (data.birthday !== undefined && !validBirthday(data.birthday)) {
    return res.status(400).json({ error: 'Please enter a valid birthday (not in the future).' });
  }
  if (!data.premature) data.dueDate = '';
  const updated = await db.updateChild(req.params.id, req.userId, data);
  if (!updated) return res.status(404).json({ error: 'Child not found.' });
  res.json({ child: updated });
});

// Mark a milestone observed (or not) for this child. Keys are opaque strings
// generated client-side from the milestone data, so the server stays agnostic.
router.post('/:id/milestones', async (req, res) => {
  const { key, observed } = req.body || {};
  if (typeof key !== 'string' || !key) {
    return res.status(400).json({ error: 'Missing milestone key.' });
  }
  const child = await db.findChild(req.params.id, req.userId);
  if (!child) return res.status(404).json({ error: 'Child not found.' });
  const set = new Set(Array.isArray(child.observed) ? child.observed : []);
  if (observed) set.add(key);
  else set.delete(key);
  const updated = await db.updateChild(req.params.id, req.userId, { observed: [...set] });
  res.json({ child: updated });
});

router.delete('/:id', async (req, res) => {
  const ok = await db.deleteChild(req.params.id, req.userId);
  if (!ok) return res.status(404).json({ error: 'Child not found.' });
  res.json({ ok: true });
});

export default router;
