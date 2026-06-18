// Data-store selector. The JSON file store (db.js) is the default and needs no
// external services — perfect for local dev. Set USE_PRISMA=1 (+ DATABASE_URL) to
// use Postgres via Prisma (db.prisma.js) in production. Both expose the same
// method names, and the routes `await` every call, so either works unchanged.
const usePrisma = process.env.USE_PRISMA === '1';
const mod = usePrisma ? await import('./db.prisma.js') : await import('./db.js');

export const db = mod.db;
