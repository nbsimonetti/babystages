import type { Child, ChildInput, Entitlement, User } from './types';

// In web dev, requests go to /api (Vite proxies to the backend). In the packaged
// mobile app there is no proxy, so point VITE_API_BASE at the hosted API, e.g.
// VITE_API_BASE=https://api.babystages.app/api
const API_BASE = (import.meta.env.VITE_API_BASE as string | undefined) || '/api';

const TOKEN_KEY = 'babystages.token';
const REFRESH_KEY = 'babystages.refresh';
const USER_KEY = 'babystages.user';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(token: string | null) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}
export function getRefresh(): string | null {
  return localStorage.getItem(REFRESH_KEY);
}
export function setRefresh(token: string | null) {
  if (token) localStorage.setItem(REFRESH_KEY, token);
  else localStorage.removeItem(REFRESH_KEY);
}

// The AuthProvider registers a callback so we can drop it to the login screen
// when both the access AND refresh tokens are gone.
let onAuthExpired: () => void = () => {};
export function setOnAuthExpired(cb: () => void) {
  onAuthExpired = cb;
}

interface Session {
  token: string;
  refreshToken: string;
  user: User;
}

// De-duplicate concurrent refreshes so a burst of 401s triggers exactly one.
let refreshing: Promise<boolean> | null = null;
function tryRefresh(): Promise<boolean> {
  if (!refreshing) {
    refreshing = doRefresh().finally(() => {
      refreshing = null;
    });
  }
  return refreshing;
}
async function doRefresh(): Promise<boolean> {
  const rt = getRefresh();
  if (!rt) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken: rt }),
    });
    if (!res.ok) {
      setToken(null);
      setRefresh(null);
      return false;
    }
    const data = (await res.json()) as Session;
    setToken(data.token);
    setRefresh(data.refreshToken);
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(data.user));
    } catch {
      /* ignore */
    }
    return true;
  } catch {
    return false;
  }
}

async function request<T>(path: string, options: RequestInit = {}, retried = false): Promise<T> {
  const token = getToken();
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  // Access token likely expired — try a one-time transparent refresh + retry.
  if (res.status === 401 && !retried && !path.startsWith('/auth/') && getRefresh()) {
    if (await tryRefresh()) return request<T>(path, options, true);
    onAuthExpired();
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const body = isJson ? await res.json() : null;
  if (!res.ok) {
    throw new Error(body?.error || `Request failed (${res.status})`);
  }
  return body as T;
}

export const api = {
  signup(email: string, password: string, name: string) {
    return request<Session>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });
  },
  login(email: string, password: string) {
    return request<Session>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  forgotPassword(email: string) {
    return request<{ ok: true; devToken?: string; note?: string }>('/auth/forgot', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  resetPassword(email: string, token: string, password: string) {
    return request<Session>('/auth/reset', {
      method: 'POST',
      body: JSON.stringify({ email, token, password }),
    });
  },
  logout(refreshToken: string) {
    return request<{ ok: true }>('/auth/logout', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
  },
  socialLogin(provider: 'google' | 'apple', idToken: string) {
    return request<Session>(`/auth/${provider}`, {
      method: 'POST',
      body: JSON.stringify({ idToken }),
    });
  },
  listChildren() {
    return request<{ children: Child[] }>('/children');
  },
  createChild(input: ChildInput) {
    return request<{ child: Child }>('/children', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateChild(id: string, input: Partial<ChildInput>) {
    return request<{ child: Child }>(`/children/${id}`, {
      method: 'PUT',
      body: JSON.stringify(input),
    });
  },
  deleteChild(id: string) {
    return request<{ ok: true }>(`/children/${id}`, { method: 'DELETE' });
  },
  toggleMilestone(childId: string, key: string, observed: boolean) {
    return request<{ child: Child }>(`/children/${childId}/milestones`, {
      method: 'POST',
      body: JSON.stringify({ key, observed }),
    });
  },

  // Account & entitlement
  getMe() {
    return request<{ user: User; entitlement: Entitlement }>('/account/me');
  },
  exportData() {
    return request<Record<string, unknown>>('/account/export');
  },
  deleteAccount() {
    return request<{ ok: true }>('/account', { method: 'DELETE' });
  },

  // Billing. In production these are replaced by RevenueCat / native purchases;
  // the mock endpoints exist for local testing of premium gating.
  billingStatus() {
    return request<{ entitlement: Entitlement }>('/billing/status');
  },
  mockSubscribe(tier: string) {
    return request<{ entitlement: Entitlement }>('/billing/mock/subscribe', {
      method: 'POST',
      body: JSON.stringify({ tier }),
    });
  },
  mockCancel() {
    return request<{ entitlement: Entitlement }>('/billing/mock/cancel', { method: 'POST' });
  },
};
