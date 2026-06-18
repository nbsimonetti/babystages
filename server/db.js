// Tiny pure-JS JSON file store. No native deps, so it builds & runs anywhere
// (including Windows) without compilation. For a single-instance local app this
// is plenty; swap for SQLite/Postgres if you ever need concurrency at scale.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, 'data');
const DATA_FILE = join(DATA_DIR, 'db.json');

const empty = { users: [], children: [] };

function load() {
  if (!existsSync(DATA_FILE)) return structuredClone(empty);
  try {
    return JSON.parse(readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return structuredClone(empty);
  }
}

let cache = load();

function persist() {
  if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
  writeFileSync(DATA_FILE, JSON.stringify(cache, null, 2), 'utf8');
}

export const db = {
  get users() {
    return cache.users;
  },
  get children() {
    return cache.children;
  },
  findUserByEmail(email) {
    const e = String(email).trim().toLowerCase();
    return cache.users.find((u) => u.email === e) || null;
  },
  findUserById(id) {
    return cache.users.find((u) => u.id === id) || null;
  },
  addUser(user) {
    cache.users.push(user);
    persist();
    return user;
  },
  updateUser(id, patch) {
    const user = this.findUserById(id);
    if (!user) return null;
    Object.assign(user, patch);
    persist();
    return user;
  },
  childrenForUser(userId) {
    return cache.children.filter((c) => c.userId === userId);
  },
  findChild(id, userId) {
    return cache.children.find((c) => c.id === id && c.userId === userId) || null;
  },
  addChild(child) {
    cache.children.push(child);
    persist();
    return child;
  },
  updateChild(id, userId, patch) {
    const child = this.findChild(id, userId);
    if (!child) return null;
    Object.assign(child, patch, { id, userId, updatedAt: new Date().toISOString() });
    persist();
    return child;
  },
  deleteChild(id, userId) {
    const before = cache.children.length;
    cache.children = cache.children.filter((c) => !(c.id === id && c.userId === userId));
    const removed = cache.children.length < before;
    if (removed) persist();
    return removed;
  },
  // Full account deletion: removes the user and all of their children. Required
  // by both the App Store and Google Play.
  deleteUser(id) {
    const before = cache.users.length;
    cache.users = cache.users.filter((u) => u.id !== id);
    cache.children = cache.children.filter((c) => c.userId !== id);
    const removed = cache.users.length < before;
    if (removed) persist();
    return removed;
  },
};
