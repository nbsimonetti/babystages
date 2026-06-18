# Authentication

## Tokens (implemented)
- **Access token** — JWT, short-lived (`ACCESS_TTL`, default **1h**), sent as
  `Authorization: Bearer <token>`.
- **Refresh token** — opaque, high-entropy, **30-day**, of the form
  `${userId}.${secret}`. Only its SHA-256 hash is stored on the user
  (`refreshTokens: [{ hash, exp }]`, capped per device). **Rotated on every use**
  — refreshing invalidates the old token and issues a new one.

### Flow
1. `signup` / `login` / `reset` / social → `{ token, refreshToken, user }`.
2. Client stores both (`babystages.token`, `babystages.refresh`).
3. On any `401`, the API layer transparently calls `POST /auth/refresh`
   (de-duped), stores the rotated pair, and retries the request once.
4. If refresh fails (expired/revoked), the client clears the session and returns
   to the login screen (`setOnAuthExpired`).
5. `logout` → `POST /auth/logout` revokes that refresh token server-side.

### Endpoints
| Method | Path | Purpose |
|---|---|---|
| POST | `/api/auth/signup` | create account → session |
| POST | `/api/auth/login` | password login → session |
| POST | `/api/auth/refresh` | rotate refresh → new session |
| POST | `/api/auth/logout` | revoke a refresh token |
| POST | `/api/auth/forgot` / `/reset` | password reset (emailed code) |
| POST | `/api/auth/google` / `/apple` | social sign-in (see below) |

## Sign in with Apple / Google (scaffolded)
Backend verification is real (`server/social.js`): it fetches the provider JWKS,
matches the `kid`, verifies the identity token's signature, `audience`
(your client ID), and `issuer`, then finds-or-creates the user by email and
returns a normal session. Required server env:

```
GOOGLE_CLIENT_ID=<your OAuth client ID>
APPLE_CLIENT_ID=<your Services ID / app bundle ID>
```
Without them the endpoints return `501 not_configured`.

### Client wiring (to add when you have credentials)
The client helper already exists: `api.socialLogin('google'|'apple', idToken)`.
Obtain the `idToken` from the platform SDK and pass it in:

- **Web — Google:** load Google Identity Services, then in the callback call
  `api.socialLogin('google', response.credential)`.
- **iOS — Apple:** use Sign in with Apple (required by Apple if any social login
  is offered); on native, RevenueCat/Capacitor or `@capacitor-community/apple-sign-in`
  yields the identity token → `api.socialLogin('apple', identityToken)`.
- **Android/Web — Apple:** Apple JS (Services ID + return URL).

Then call the AuthProvider with the returned session (add a `loginWithSession`
helper mirroring `login`). UI buttons are intentionally not shipped yet because
they are non-functional without real credentials; gate them behind
`VITE_GOOGLE_CLIENT_ID` / an Apple flag so they appear only when configured.

## Notes
- Social-only accounts have no password until the user sets one via the reset
  flow (`passwordHash` is empty and never matches a login attempt).
- Production: lock CORS to your origins, rate-limit `/auth/*`, and keep
  `JWT_SECRET` in the platform secret store.
