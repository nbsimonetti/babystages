import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './auth/useAuth';
import { AuthPage } from './pages/AuthPage';
import { Dashboard } from './pages/Dashboard';
import { AboutSources } from './pages/AboutSources';
import { Account } from './pages/Account';
import { Legal } from './pages/Legal';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-stone-400">Loading…</div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/about" element={<AboutSources />} />
        <Route path="/legal/:doc" element={<Legal />} />
        <Route path="*" element={<AuthPage />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/account" element={<Account />} />
      <Route path="/about" element={<AboutSources />} />
      <Route path="/legal/:doc" element={<Legal />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
