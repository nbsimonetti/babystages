# Deploy guide — production backend (Postgres + Prisma)

The API runs on a JSON file store by default and swaps to **Postgres via Prisma**
with a single env var. The routes already `await` every data call, so no code
changes are needed to switch — only configuration.

## Data layer
- `server/db.js` — JSON file store (default; local/dev).
- `server/db.prisma.js` — Prisma/Postgres implementation (same method names).
- `server/store.js` — selects one based on `USE_PRISMA`.
- `server/prisma/schema.prisma` — the Postgres schema (User, Child, cascade delete).

## 1. Local Postgres (optional, to test the Prisma path)
```bash
cd babystages/server
cp .env.example .env          # set DATABASE_URL + USE_PRISMA=1
npm install                   # installs @prisma/client + prisma
npm run prisma:generate       # generate the client
npm run prisma:migrate        # create tables (dev migration)
USE_PRISMA=1 npm start        # run the API on Postgres
```
Leave `USE_PRISMA` unset to keep using the JSON store.

## 2. Deploy to Fly.io
```bash
cd babystages/server
fly launch --no-deploy                 # or use the included fly.toml
fly postgres create                    # provision Postgres
fly postgres attach <db-name>          # sets DATABASE_URL secret
fly secrets set USE_PRISMA=1 JWT_SECRET=$(openssl rand -hex 32) \
  EMAIL_PROVIDER=postmark REVENUECAT_WEBHOOK_SECRET=...
fly deploy
fly ssh console -C "npm run prisma:deploy"   # run migrations once
```

## 3. Deploy to Render.com (alternative)
Use the included `render.yaml` (New ▸ Blueprint). It provisions Postgres, wires
`DATABASE_URL`, generates `JWT_SECRET`, sets `USE_PRISMA=1`, and runs
`prisma migrate deploy` on each deploy via `preDeployCommand`. Set
`EMAIL_PROVIDER` and `REVENUECAT_WEBHOOK_SECRET` in the dashboard.

## 4. Point the apps at the hosted API
- **Web/native client:** set `VITE_API_BASE=https://<your-api-host>/api` (see
  `client/.env.example`) and rebuild.
- **CORS:** lock `cors()` in `server/index.js` to your web origin(s) for production.

## 5. Production checklist (excerpt — see RELEASE_CHECKLIST.md)
- [ ] `NODE_ENV=production` (disables mock billing endpoints).
- [ ] Strong `JWT_SECRET`; secrets in the platform secret store (never committed).
- [ ] `USE_PRISMA=1` + managed Postgres with automated backups.
- [ ] Real email provider wired in `server/mailer.js`.
- [ ] RevenueCat webhook secret set; `/api/billing/webhook` verifies + grants
      entitlements server-side.
- [ ] Error monitoring (Sentry) + structured logs + rate limiting on auth routes.

## Notes / next hardening
- The JSON store writes to `server/data/db.json` (ephemeral on most hosts) — use
  Prisma/Postgres in production, or attach a persistent volume if you stay on JSON.
- Add refresh tokens + Sign in with Apple/Google (Phase 2) — see ROADMAP.md.
- `resetTokenExp` is stored as `BigInt` in Postgres; the Prisma adapter converts
  to/from a plain number so the route logic is identical across stores.
