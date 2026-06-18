import { useEffect, useState, type ReactNode } from 'react';
import { api, getToken, getRefresh, setToken, setRefresh, setOnAuthExpired } from '../api';
import type { User } from '../types';
import { isPremium as computePremium } from '../lib/entitlements';
import { AuthContext } from './useAuth';

const USER_KEY = 'babystages.user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  function updateUser(u: User) {
    localStorage.setItem(USER_KEY, JSON.stringify(u));
    setUser(u);
  }
  function persist(token: string, refreshToken: string, u: User) {
    setToken(token);
    setRefresh(refreshToken);
    updateUser(u);
  }
  function clearSession() {
    setToken(null);
    setRefresh(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }

  useEffect(() => {
    // If the access token expires and the refresh token is also gone/invalid,
    // the API layer calls this to drop us back to the login screen.
    setOnAuthExpired(() => clearSession());

    const token = getToken();
    const cached = localStorage.getItem(USER_KEY);
    if (token && cached) {
      try {
        setUser(JSON.parse(cached));
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
    // Best-effort refresh of subscription/entitlement (auto-refreshes the access
    // token via the API layer if it has expired).
    if (token || getRefresh()) {
      api.getMe().then(({ user: u }) => updateUser(u)).catch(() => {});
    }
  }, []);

  async function login(email: string, password: string) {
    const { token, refreshToken, user: u } = await api.login(email, password);
    persist(token, refreshToken, u);
  }
  async function signup(email: string, password: string, name: string) {
    const { token, refreshToken, user: u } = await api.signup(email, password, name);
    persist(token, refreshToken, u);
  }
  async function resetPassword(email: string, token: string, password: string) {
    const { token: jwt, refreshToken, user: u } = await api.resetPassword(email, token, password);
    persist(jwt, refreshToken, u);
  }
  async function refreshMe() {
    const { user: u } = await api.getMe();
    updateUser(u);
  }
  async function subscribe(tier: string) {
    await api.mockSubscribe(tier);
    await refreshMe();
  }
  async function cancelSubscription() {
    await api.mockCancel();
    await refreshMe();
  }
  async function deleteAccount() {
    await api.deleteAccount();
    clearSession();
  }
  function logout() {
    const rt = getRefresh();
    if (rt) api.logout(rt).catch(() => {}); // revoke server-side, best-effort
    clearSession();
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isPremium: computePremium(user),
        login,
        signup,
        resetPassword,
        refreshMe,
        subscribe,
        cancelSubscription,
        deleteAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
