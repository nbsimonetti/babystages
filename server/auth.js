import jwt from 'jsonwebtoken';
import { randomBytes, createHash } from 'node:crypto';

// In production set JWT_SECRET via environment. The fallback keeps local dev
// frictionless but is NOT safe for a public deployment.
const JWT_SECRET = process.env.JWT_SECRET || 'babystages-dev-secret-change-me';

// Short-lived access token; long-lived rotating refresh token (below).
const ACCESS_TTL = process.env.ACCESS_TTL || '1h';
const REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days
const MAX_REFRESH_TOKENS = 10; // ~per-device cap

export function signToken(user) {
  return jwt.sign({ sub: user.id, email: user.email }, JWT_SECRET, {
    expiresIn: ACCESS_TTL,
  });
}

// Refresh tokens are opaque, high-entropy strings of the form `${userId}.${secret}`.
// We store only their SHA-256 hash (the userId prefix lets us look up the user
// without scanning every account). Rotated on every use.
export function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function issueRefreshToken(userId) {
  const secret = randomBytes(32).toString('hex');
  const token = `${userId}.${secret}`;
  return { token, record: { hash: hashToken(token), exp: Date.now() + REFRESH_TTL_MS } };
}

// Drop expired records, cap the list, and append a new one.
export function addRefreshRecord(existing, record) {
  const now = Date.now();
  const kept = (existing || []).filter((r) => r.exp > now).slice(-(MAX_REFRESH_TOKENS - 1));
  kept.push(record);
  return kept;
}

export function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Authentication required.' });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session.', code: 'token_expired' });
  }
}
