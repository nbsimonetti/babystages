// Verifies Sign in with Apple / Google identity tokens against the providers'
// public JWKS. Real verification logic; it just needs the client IDs configured:
//   GOOGLE_CLIENT_ID   (OAuth web/client ID)
//   APPLE_CLIENT_ID    (Services ID / app bundle ID, used as the audience)
// Without those, the endpoints respond "not configured" (501).
import jwt from 'jsonwebtoken';
import { createPublicKey } from 'node:crypto';

const JWKS_URL = {
  google: 'https://www.googleapis.com/oauth2/v3/certs',
  apple: 'https://appleid.apple.com/auth/keys',
};
const ISSUERS = {
  google: ['https://accounts.google.com', 'accounts.google.com'],
  apple: ['https://appleid.apple.com'],
};

const keyCache = {}; // provider -> { keys, fetchedAt }
const CACHE_TTL = 1000 * 60 * 60;

async function getKeys(provider) {
  const cached = keyCache[provider];
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL) return cached.keys;
  const res = await fetch(JWKS_URL[provider]);
  if (!res.ok) throw new Error('Could not fetch provider signing keys.');
  const { keys } = await res.json();
  keyCache[provider] = { keys, fetchedAt: Date.now() };
  return keys;
}

function audienceFor(provider) {
  return provider === 'google' ? process.env.GOOGLE_CLIENT_ID : process.env.APPLE_CLIENT_ID;
}

export function isConfigured(provider) {
  return Boolean(audienceFor(provider));
}

export async function verifyIdentityToken(provider, idToken) {
  const audience = audienceFor(provider);
  if (!audience) {
    throw Object.assign(new Error(`${provider} sign-in is not configured on the server.`), {
      code: 'not_configured',
    });
  }
  const decoded = jwt.decode(idToken, { complete: true });
  if (!decoded || !decoded.header) throw new Error('Malformed identity token.');
  const jwk = (await getKeys(provider)).find((k) => k.kid === decoded.header.kid);
  if (!jwk) throw new Error('Token signing key not found.');
  const publicKey = createPublicKey({ key: jwk, format: 'jwk' });
  const payload = jwt.verify(idToken, publicKey, {
    algorithms: ['RS256'],
    audience,
    issuer: ISSUERS[provider],
  });
  if (!payload.email) throw new Error('Identity token did not include an email.');
  return {
    sub: payload.sub,
    email: String(payload.email).toLowerCase(),
    emailVerified: payload.email_verified === true || payload.email_verified === 'true',
    name: payload.name || '',
  };
}
