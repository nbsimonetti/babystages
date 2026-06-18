import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';
import { db } from '../store.js';
import { signToken, issueRefreshToken, addRefreshRecord, hashToken } from '../auth.js';
import { sendMail } from '../mailer.js';
import { verifyIdentityToken } from '../social.js';

const FREE_SUBSCRIPTION = {
  plan: 'free',
  status: 'none',
  provider: null,
  currentPeriodEnd: null,
  trialEndsAt: null,
};

const router = Router();
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function publicUser(u) {
  return {
    id: u.id,
    email: u.email,
    name: u.name,
    createdAt: u.createdAt,
    subscription: u.subscription || FREE_SUBSCRIPTION,
  };
}

// Issue an access token + a fresh rotating refresh token, persisting the refresh
// record on the user.
async function issueSession(user) {
  const accessToken = signToken(user);
  const { token: refreshToken, record } = issueRefreshToken(user.id);
  await db.updateUser(user.id, { refreshTokens: addRefreshRecord(user.refreshTokens, record) });
  return { token: accessToken, refreshToken, user: publicUser(user) };
}

router.post('/signup', async (req, res) => {
  const { email, password, name } = req.body || {};
  if (!email || !EMAIL_RE.test(email)) {
    return res.status(400).json({ error: 'A valid email is required.' });
  }
  if (!password || String(password).length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }
  if (await db.findUserByEmail(email)) {
    return res.status(409).json({ error: 'An account with that email already exists.' });
  }
  const user = {
    id: randomUUID(),
    email: String(email).trim().toLowerCase(),
    name: (name && String(name).trim()) || '',
    passwordHash: await bcrypt.hash(String(password), 10),
    subscription: { ...FREE_SUBSCRIPTION },
    createdAt: new Date().toISOString(),
  };
  await db.addUser(user);
  res.status(201).json(await issueSession(user));
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  const user = email ? await db.findUserByEmail(email) : null;
  // Always run a compare to reduce timing differences between known/unknown emails.
  const ok =
    user && user.passwordHash
      ? await bcrypt.compare(String(password || ''), user.passwordHash)
      : await bcrypt.compare('x', '$2a$10$invalidinvalidinvalidinvalidinvalidinvalidinv');
  if (!user || !ok) {
    return res.status(401).json({ error: 'Incorrect email or password.' });
  }
  res.json(await issueSession(user));
});

// Exchange a refresh token for a new access token, rotating the refresh token.
router.post('/refresh', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (!refreshToken || typeof refreshToken !== 'string') {
    return res.status(401).json({ error: 'Missing refresh token.' });
  }
  const userId = refreshToken.split('.')[0];
  const user = userId ? await db.findUserById(userId) : null;
  if (!user) return res.status(401).json({ error: 'Invalid refresh token.' });
  const now = Date.now();
  const list = (user.refreshTokens || []).filter((r) => r.exp > now);
  const hash = hashToken(refreshToken);
  const idx = list.findIndex((r) => r.hash === hash);
  if (idx === -1) {
    return res.status(401).json({ error: 'Invalid or expired refresh token.' });
  }
  list.splice(idx, 1); // rotate: invalidate the used token
  const { token: newRefresh, record } = issueRefreshToken(user.id);
  list.push(record);
  await db.updateUser(user.id, { refreshTokens: list });
  res.json({ token: signToken(user), refreshToken: newRefresh, user: publicUser(user) });
});

// Revoke a single refresh token (logout on this device).
router.post('/logout', async (req, res) => {
  const { refreshToken } = req.body || {};
  if (refreshToken && typeof refreshToken === 'string') {
    const userId = refreshToken.split('.')[0];
    const user = userId ? await db.findUserById(userId) : null;
    if (user) {
      const hash = hashToken(refreshToken);
      const list = (user.refreshTokens || []).filter((r) => r.hash !== hash);
      await db.updateUser(user.id, { refreshTokens: list });
    }
  }
  res.json({ ok: true });
});

const RESET_TTL_MS = 1000 * 60 * 60; // 1 hour

router.post('/forgot', async (req, res) => {
  const { email } = req.body || {};
  const user = email ? await db.findUserByEmail(email) : null;
  if (!user) return res.json({ ok: true });
  const token = randomUUID();
  await db.updateUser(user.id, {
    resetTokenHash: await bcrypt.hash(token, 10),
    resetTokenExp: Date.now() + RESET_TTL_MS,
  });
  await sendMail({
    to: user.email,
    subject: 'Reset your BabyStages password',
    text: `Use this code to reset your password (valid for 1 hour):\n\n${token}\n\nIf you didn't request this, you can ignore this email.`,
  });
  const body = { ok: true };
  if (process.env.NODE_ENV !== 'production') body.devToken = token;
  res.json(body);
});

router.post('/reset', async (req, res) => {
  const { email, token, password } = req.body || {};
  if (!password || String(password).length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters.' });
  }
  const user = email ? await db.findUserByEmail(email) : null;
  const valid =
    user &&
    user.resetTokenHash &&
    user.resetTokenExp &&
    user.resetTokenExp >= Date.now() &&
    (await bcrypt.compare(String(token || ''), user.resetTokenHash));
  if (!valid) {
    return res.status(400).json({ error: 'This reset code is invalid or has expired.' });
  }
  await db.updateUser(user.id, {
    passwordHash: await bcrypt.hash(String(password), 10),
    resetTokenHash: null,
    resetTokenExp: null,
  });
  res.json(await issueSession(user));
});

// --- Social sign-in (Sign in with Apple / Google) -----------------------------
async function findOrCreateSocialUser({ email, name }) {
  let user = await db.findUserByEmail(email);
  if (!user) {
    user = {
      id: randomUUID(),
      email: email.toLowerCase(),
      name: name || '',
      passwordHash: '', // social-only account: no password until they set one
      subscription: { ...FREE_SUBSCRIPTION },
      createdAt: new Date().toISOString(),
    };
    await db.addUser(user);
  }
  return user;
}

async function handleSocial(req, res, provider) {
  const { idToken } = req.body || {};
  if (!idToken) return res.status(400).json({ error: 'Missing idToken.' });
  try {
    const profile = await verifyIdentityToken(provider, idToken);
    const user = await findOrCreateSocialUser(profile);
    res.json(await issueSession(user));
  } catch (e) {
    const status = e.code === 'not_configured' ? 501 : 401;
    res.status(status).json({ error: e.message || 'Sign-in failed.' });
  }
}

router.post('/google', (req, res) => handleSocial(req, res, 'google'));
router.post('/apple', (req, res) => handleSocial(req, res, 'apple'));

export default router;
