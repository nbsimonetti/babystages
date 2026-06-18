// Prisma/Postgres implementation of the data store. Same method names as db.js
// (the JSON store), but async. Selected by store.js when USE_PRISMA=1.
// Run `npm run prisma:generate` and `npm run prisma:deploy` first.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// resetTokenExp is BigInt in Postgres but the routes use plain numbers (epoch ms).
function fromUser(u) {
  if (!u) return null;
  return { ...u, resetTokenExp: u.resetTokenExp == null ? null : Number(u.resetTokenExp) };
}
function toUserData(data) {
  const d = { ...data };
  if ('resetTokenExp' in d) d.resetTokenExp = d.resetTokenExp == null ? null : BigInt(d.resetTokenExp);
  return d;
}

export const db = {
  async findUserByEmail(email) {
    return fromUser(
      await prisma.user.findUnique({ where: { email: String(email).trim().toLowerCase() } })
    );
  },
  async findUserById(id) {
    return fromUser(await prisma.user.findUnique({ where: { id } }));
  },
  async addUser(user) {
    return fromUser(await prisma.user.create({ data: toUserData(user) }));
  },
  async updateUser(id, patch) {
    return fromUser(await prisma.user.update({ where: { id }, data: toUserData(patch) }));
  },
  childrenForUser(userId) {
    return prisma.child.findMany({ where: { userId }, orderBy: { birthday: 'asc' } });
  },
  findChild(id, userId) {
    return prisma.child.findFirst({ where: { id, userId } });
  },
  addChild(child) {
    const data = { ...child };
    delete data.updatedAt; // managed by @updatedAt
    return prisma.child.create({ data });
  },
  async updateChild(id, userId, patch) {
    const data = { ...patch };
    delete data.id;
    delete data.userId;
    delete data.updatedAt;
    const r = await prisma.child.updateMany({ where: { id, userId }, data });
    return r.count ? prisma.child.findUnique({ where: { id } }) : null;
  },
  async deleteChild(id, userId) {
    const r = await prisma.child.deleteMany({ where: { id, userId } });
    return r.count > 0;
  },
  async deleteUser(id) {
    // Children cascade via the relation's onDelete: Cascade.
    try {
      await prisma.user.delete({ where: { id } });
      return true;
    } catch {
      return false;
    }
  },
};
