# Split deploy — frontend on GitHub Pages, backend hosted (keeps real logins)

This deploys BabyStages as **two pieces** so it works from any device at a public
URL **with real accounts and cross-device sync**:

- **Frontend** → static build on **GitHub Pages** (`https://<user>.github.io/<repo>/`).
- **Backend** → the existing Express + Postgres API hosted on **Render/Fly** (see
  `docs/DEPLOY.md`). The frontend calls it cross-origin via `VITE_API_BASE`.

```
Browser ──▶ GitHub Pages (static React)  ──HTTPS/CORS──▶  Hosted API (Render/Fly)
            https://USER.github.io/REPO/                  https://API-HOST/api  ──▶ Postgres
```

GitHub Pages can only serve static files — it cannot run the API. That's why the
backend is hosted separately; this is the only way to keep logins on a Pages URL.

---

## Part A — Deploy the backend (once)
Follow `docs/DEPLOY.md` (Render blueprint or Fly). You need it reachable at a
public HTTPS URL, e.g. `https://babystages-api.onrender.com`. Set on the API host:

- `USE_PRISMA=1`, `DATABASE_URL=...` (managed Postgres), `JWT_SECRET=...`,
  `NODE_ENV=production`
- **`CORS_ORIGINS=https://<user>.github.io`** ← the Pages origin (scheme + host
  only, no path). Add a custom domain here too if you use one. This is required or
  the browser will block the cross-origin API calls.

Confirm `https://<api-host>/api/health` returns `{"ok":true}`.

## Part B — Create the GitHub repo & push
From `babystages/` (no git repo yet):
```bash
cd babystages
git init -b main
git add .
git commit -m "BabyStages: split Pages + hosted API deploy"

# With the GitHub CLI (creates the repo and pushes):
gh repo create babystages --public --source=. --push
# …or manually: create an empty repo on github.com, then:
#   git remote add origin https://github.com/<user>/babystages.git
#   git push -u origin main
```
> The workflow lives at `babystages/.github/workflows/deploy-pages.yml`. If you
> push `babystages/` as the repo root (as above), it's at `.github/...` ✓. If you
> instead push the whole `Claude/` parent folder, move the workflow to the repo's
> top-level `.github/workflows/` (Actions only runs workflows from the repo root).

## Part C — Configure Pages + variables
1. **Settings → Pages → Build and deployment → Source: GitHub Actions.**
2. **Settings → Secrets and variables → Actions → Variables** (not Secrets — these
   are public-by-nature build values), add:
   - `VITE_API_BASE` = `https://<api-host>/api`  (note the `/api` suffix)
   - `VITE_BASE` = `/babystages/`  (must match the repo name, leading+trailing
     slash). For a user/org site (`<user>.github.io` repo) or a custom domain at
     root, use `/`.
3. Push to `main` (or run the workflow via **Actions → Deploy frontend → Run
   workflow**). When it finishes, the live URL is
   **`https://<user>.github.io/babystages/`**.

## Part D — Verify
- Open the URL in a fresh browser/incognito → sign up → add a child → see the
  Developmental Window + milestones; toggle a milestone.
- Open on a **second device** and log in with the same account → the child syncs
  (proves the hosted backend + accounts work).
- Hard-refresh a deep link like `…/babystages/account` → it loads (SPA fallback via
  `public/404.html` + the restore script in `index.html`).
- DevTools → Network → API calls go to your `VITE_API_BASE` host and succeed (no
  CORS errors). If you see CORS errors, fix `CORS_ORIGINS` on the API.

## How it works (the moving parts)
- **`vite.config.ts`** reads `VITE_BASE` → sets Vite `base` so assets load from the
  subpath. **`main.tsx`** uses `import.meta.env.BASE_URL` as the router `basename`
  so client routes work under `/babystages/`.
- **SPA fallback:** `public/404.html` stores the requested path and bounces to
  `index.html`, whose inline script restores it before React mounts. (Pages has no
  server rewrites, so without this, deep links/refreshes 404.)
- **`server/index.js`** honors `CORS_ORIGINS` to allow the Pages origin.
- **CI:** `.github/workflows/deploy-pages.yml` builds `babystages/client` with
  `VITE_BASE` + `VITE_API_BASE` and publishes `dist` via `actions/deploy-pages`.
  No secrets required.

## Custom domain (optional, later)
Point a domain at Pages (Settings → Pages → Custom domain), set `VITE_BASE=/`,
add the domain to `CORS_ORIGINS`, and add a `client/public/CNAME` file with the
domain. Rebuild.

## Notes / limits
- **Billing:** the mock billing endpoints are disabled when `NODE_ENV=production`,
  and real RevenueCat purchases only work in the native apps — so the **web build
  is effectively the free tier** (premium gating still enforced server-side). The
  paywall's simulated purchase won't grant premium in production; that's expected.
- Password-reset emails need a real `EMAIL_PROVIDER` on the API (see
  `server/.env.example`); otherwise the code is logged server-side only.
- Keep `node_modules/`, `server/data/`, and any `.env` out of git (`.gitignore`).
