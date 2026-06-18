import express from 'express';
import cors from 'cors';
import { existsSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import authRoutes from './routes/auth.js';
import childrenRoutes from './routes/children.js';
import accountRoutes from './routes/account.js';
import billingRoutes from './routes/billing.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 4000;

// In the split deploy the static frontend (GitHub Pages) calls this API
// cross-origin, so CORS must allow that exact origin. Set CORS_ORIGINS to a
// comma-separated allowlist, e.g.
//   CORS_ORIGINS=https://<username>.github.io,https://babystages.app
// Unset (local dev) allows all origins for convenience.
const allowed = (process.env.CORS_ORIGINS || '')
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);
app.use(
  cors(
    allowed.length
      ? {
          origin(origin, cb) {
            // Allow non-browser clients (no Origin header) and all-listed origins.
            if (!origin || allowed.includes(origin)) return cb(null, true);
            cb(new Error('Not allowed by CORS'));
          },
        }
      : undefined
  )
);
app.use(express.json({ limit: '256kb' }));

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/auth', authRoutes);
app.use('/api/children', childrenRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/billing', billingRoutes);

// In production, serve the built client (client/dist) so the whole app runs
// from this single process. In dev you use the Vite dev server + proxy instead.
const clientDist = join(__dirname, '..', 'client', 'dist');
if (existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (_req, res) => res.sendFile(join(clientDist, 'index.html')));
}

app.listen(PORT, () => {
  console.log(`BabyStages API listening on http://localhost:${PORT}`);
});
