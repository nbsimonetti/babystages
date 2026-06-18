import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

const TIERS = [
  { id: 'premium_annual', name: 'Annual', price: '$39.99', per: '/year', note: '≈ $3.33/mo · best value', highlight: true },
  { id: 'premium_monthly', name: 'Monthly', price: '$4.99', per: '/month', note: 'Cancel anytime' },
  { id: 'premium_lifetime', name: 'Lifetime', price: '$79.99', per: ' once', note: 'Pay once, keep forever' },
];

const FEATURES = [
  'Unlimited children & full family view',
  'Complete milestone tracker with history',
  'Milestone reminders (push notifications)',
  'Partner / caregiver sharing',
  'PDF summary for pediatrician visits',
  'Full offline access · ad-free',
];

export function Paywall({ onClose, reason }: { onClose: () => void; reason?: string }) {
  const { subscribe } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function choose(tier: string) {
    setBusy(tier);
    setError(null);
    try {
      await subscribe(tier);
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not complete purchase.');
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50 p-0 sm:items-center sm:p-4">
      <div className="card max-h-[94vh] w-full max-w-md overflow-y-auto rounded-b-none p-6 sm:rounded-2xl">
        <div className="mb-4 text-center">
          <div className="text-4xl">⭐️</div>
          <h2 className="mt-1 text-2xl font-extrabold text-stone-800">BabyStages Premium</h2>
          {reason && <p className="mt-1 text-sm font-bold text-brand-600">{reason}</p>}
        </div>

        <ul className="mb-5 space-y-2">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm text-stone-700">
              <span className="text-emerald-500" aria-hidden>
                ✓
              </span>
              {f}
            </li>
          ))}
        </ul>

        <div className="space-y-2">
          {TIERS.map((t) => (
            <button
              key={t.id}
              onClick={() => choose(t.id)}
              disabled={!!busy}
              className={`flex w-full items-center justify-between rounded-xl border-2 px-4 py-3 text-left transition disabled:opacity-60 ${
                t.highlight
                  ? 'border-brand-500 bg-brand-50 hover:bg-brand-100'
                  : 'border-stone-200 hover:border-stone-300'
              }`}
            >
              <span>
                <span className="font-extrabold text-stone-800">{t.name}</span>
                <span className="block text-xs text-stone-500">{t.note}</span>
              </span>
              <span className="text-right">
                <span className="text-lg font-extrabold text-stone-800">{t.price}</span>
                <span className="text-xs text-stone-500">{t.per}</span>
              </span>
            </button>
          ))}
        </div>

        {error && (
          <p className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p>
        )}

        <p className="mt-4 text-center text-[11px] leading-relaxed text-stone-400">
          Local build: checkout is simulated. In the published app, purchases are processed securely
          by the App Store / Google Play and managed via your device. Subscriptions auto-renew unless
          canceled. Manage or cancel anytime in your store account.
        </p>

        <div className="mt-3 flex items-center justify-center gap-3 text-xs">
          <Link to="/legal/terms" className="font-bold text-stone-500 hover:underline">
            Terms
          </Link>
          <span className="text-stone-300">·</span>
          <Link to="/legal/privacy" className="font-bold text-stone-500 hover:underline">
            Privacy
          </Link>
          <span className="text-stone-300">·</span>
          <button className="font-bold text-stone-500 hover:underline" onClick={() => alert('Restore purchases is wired to RevenueCat in the published app.')}>
            Restore
          </button>
        </div>

        <button onClick={onClose} className="btn-ghost mt-4 w-full">
          Maybe later
        </button>
      </div>
    </div>
  );
}
