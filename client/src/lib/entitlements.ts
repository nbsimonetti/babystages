import type { User } from '../types';

// Mirror of the server's free-tier limits. The server is authoritative (it
// enforces limits and verifies receipts); this lets the UI gate optimistically.
export const FREE_LIMITS = {
  maxChildren: 1,
};

export function isPremium(user: User | null): boolean {
  const s = user?.subscription;
  if (!s || s.plan !== 'premium') return false;
  if (s.currentPeriodEnd && Date.parse(s.currentPeriodEnd) < Date.now()) return false;
  return ['active', 'trialing', 'canceled'].includes(s.status);
}

export function maxChildren(user: User | null): number | null {
  return isPremium(user) ? null : FREE_LIMITS.maxChildren;
}

export function canAddChild(user: User | null, currentCount: number): boolean {
  const max = maxChildren(user);
  return max == null || currentCount < max;
}
