// Runs after `npm install` (including Render's build step).
// - Always generates the Prisma client (needs no DB; harmless for the JSON store).
// - Pushes the schema to Postgres ONLY when USE_PRISMA=1 and DATABASE_URL are set,
//   so local/JSON-store installs never try to reach a database.
// `db push` (vs migrate) is used because we ship a schema, not migration files; it
// creates the target schema (e.g. ?schema=babystages) and its tables idempotently.
import { execSync } from 'node:child_process';

function run(cmd) {
  execSync(cmd, { stdio: 'inherit' });
}

try {
  run('prisma generate');
} catch (e) {
  // Don't fail the install just because client generation hiccuped.
  console.warn('[postinstall] prisma generate skipped:', e.message);
}

if (process.env.USE_PRISMA === '1' && process.env.DATABASE_URL) {
  console.log('[postinstall] USE_PRISMA=1 — pushing schema to Postgres…');
  run('prisma db push --skip-generate --accept-data-loss');
} else {
  console.log('[postinstall] USE_PRISMA not set — skipping DB push (JSON store).');
}
