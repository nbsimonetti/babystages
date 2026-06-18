import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { api } from '../api';
import { Paywall } from '../components/Paywall';

export function Account() {
  const { user, isPremium, cancelSubscription, deleteAccount } = useAuth();
  const nav = useNavigate();
  const [paywall, setPaywall] = useState(false);
  const [busy, setBusy] = useState<string | null>(null);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleExport() {
    setBusy('export');
    setMsg(null);
    try {
      const data = await api.exportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'babystages-export.json';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      setMsg('Your data was downloaded.');
    } catch (e) {
      setMsg(e instanceof Error ? e.message : 'Export failed.');
    } finally {
      setBusy(null);
    }
  }

  async function handleCancel() {
    if (!window.confirm('Cancel Premium? You will move to the free plan.')) return;
    setBusy('cancel');
    try {
      await cancelSubscription();
      setMsg('Subscription canceled.');
    } finally {
      setBusy(null);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Permanently delete your account and ALL data? This cannot be undone.')) return;
    if (!window.confirm('Are you absolutely sure? Every child and milestone will be erased.')) return;
    setBusy('delete');
    try {
      await deleteAccount();
      nav('/');
    } catch {
      setBusy(null);
    }
  }

  const sub = user?.subscription;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/" className="text-sm font-bold text-brand-600 hover:underline">
        ← Back to app
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-stone-800">Account</h1>
      <p className="mt-1 text-stone-500">{user?.email}</p>

      {msg && (
        <p className="mt-4 rounded-xl bg-sky-50 px-4 py-2 text-sm font-bold text-sky-800">{msg}</p>
      )}

      {/* Plan */}
      <section className="card mt-6 p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-stone-800">Subscription</h2>
            <p className="text-sm text-stone-500">
              {isPremium ? 'Premium' : 'Free plan'}
              {sub?.tier ? ` · ${sub.tier.replace('premium_', '')}` : ''}
              {sub?.currentPeriodEnd
                ? ` · renews ${new Date(sub.currentPeriodEnd).toLocaleDateString()}`
                : ''}
            </p>
          </div>
          <span
            className={`pill ${isPremium ? 'bg-brand-100 text-brand-700' : 'bg-stone-100 text-stone-600'}`}
          >
            {isPremium ? '⭐️ Premium' : 'Free'}
          </span>
        </div>
        <div className="mt-4">
          {isPremium ? (
            <button className="btn-ghost" onClick={handleCancel} disabled={busy === 'cancel'}>
              {busy === 'cancel' ? 'Canceling…' : 'Cancel subscription'}
            </button>
          ) : (
            <button className="btn-primary" onClick={() => setPaywall(true)}>
              Upgrade to Premium
            </button>
          )}
        </div>
      </section>

      {/* Data & privacy */}
      <section className="card mt-5 p-5">
        <h2 className="text-lg font-extrabold text-stone-800">Your data</h2>
        <p className="mt-1 text-sm text-stone-500">
          You own your family’s data. Download a copy anytime.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button className="btn-ghost" onClick={handleExport} disabled={busy === 'export'}>
            {busy === 'export' ? 'Preparing…' : 'Export my data (JSON)'}
          </button>
          <Link to="/legal/privacy" className="btn-ghost">
            Privacy policy
          </Link>
          <Link to="/legal/terms" className="btn-ghost">
            Terms
          </Link>
          <Link to="/about" className="btn-ghost">
            About &amp; sources
          </Link>
        </div>
      </section>

      {/* Danger zone */}
      <section className="card mt-5 border-red-200 p-5">
        <h2 className="text-lg font-extrabold text-red-700">Delete account</h2>
        <p className="mt-1 text-sm text-stone-500">
          Permanently deletes your account and all children &amp; milestones. This cannot be undone.
        </p>
        <button
          className="btn mt-3 bg-red-600 text-white hover:bg-red-700"
          onClick={handleDelete}
          disabled={busy === 'delete'}
        >
          {busy === 'delete' ? 'Deleting…' : 'Delete my account'}
        </button>
      </section>

      {paywall && <Paywall onClose={() => setPaywall(false)} />}
    </div>
  );
}
