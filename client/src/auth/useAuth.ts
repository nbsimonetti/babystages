import { createContext, useContext } from 'react';
import type { User } from '../types';

// Context + hook live in their own (non-component) module so that AuthContext.tsx
// can export ONLY the AuthProvider component — that keeps React Fast Refresh happy
// (a file exporting a component plus a hook breaks HMR).
export interface AuthState {
  user: User | null;
  loading: boolean;
  isPremium: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  resetPassword: (email: string, token: string, password: string) => Promise<void>;
  refreshMe: () => Promise<void>;
  subscribe: (tier: string) => Promise<void>;
  cancelSubscription: () => Promise<void>;
  deleteAccount: () => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthState | null>(null);

export function useAuth(): AuthState {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
