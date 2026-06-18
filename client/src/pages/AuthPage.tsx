import { useState, type FormEvent } from 'react';
import { useAuth } from '../auth/useAuth';
import { api } from '../api';

type Mode = 'login' | 'signup' | 'forgot' | 'reset';

export function AuthPage() {
  const { login, signup, resetPassword } = useAuth();
  const [mode, setMode] = useState<Mode>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetCode, setResetCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function go(next: Mode) {
    setMode(next);
    setError(null);
    setInfo(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'signup') {
        await signup(email, password, name);
      } else if (mode === 'login') {
        await login(email, password);
      } else if (mode === 'forgot') {
        const res = await api.forgotPassword(email);
        if (res.devToken) {
          // Local mode: no email service, so we surface the code and pre-fill it.
          setResetCode(res.devToken);
          go('reset');
          setInfo(
            'A reset code was generated and pre-filled below (in production it would be emailed). Choose a new password to continue.'
          );
        } else {
          setInfo('If an account exists for that email, a reset code has been created.');
        }
      } else if (mode === 'reset') {
        await resetPassword(email, resetCode, password);
        // On success the AuthProvider logs us in and this screen unmounts.
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setBusy(false);
    }
  }

  const titles: Record<Mode, string> = {
    login: 'Log in',
    signup: 'Create account',
    forgot: 'Reset your password',
    reset: 'Choose a new password',
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-brand-50 to-stone-50 px-4 py-10">
      <div className="mb-6 text-center">
        <div className="text-5xl">🍼</div>
        <h1 className="mt-2 text-3xl font-extrabold text-stone-800">BabyStages</h1>
        <p className="mt-1 max-w-sm text-stone-500">
          See what to expect from your baby at every age — milestones and guidance from trusted,
          evidence-based sources.
        </p>
      </div>

      <div className="card w-full max-w-sm p-6">
        {(mode === 'login' || mode === 'signup') && (
          <div className="mb-5 grid grid-cols-2 gap-1 rounded-xl bg-stone-100 p-1">
            {(['login', 'signup'] as const).map((m) => (
              <button
                key={m}
                onClick={() => go(m)}
                className={`rounded-lg py-2 text-sm font-bold transition ${
                  mode === m ? 'bg-white text-brand-600 shadow-sm' : 'text-stone-500'
                }`}
              >
                {m === 'login' ? 'Log in' : 'Sign up'}
              </button>
            ))}
          </div>
        )}

        {(mode === 'forgot' || mode === 'reset') && (
          <h2 className="mb-4 text-lg font-extrabold text-stone-800">{titles[mode]}</h2>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="label" htmlFor="name">
                Your name <span className="font-normal text-stone-400">(optional)</span>
              </label>
              <input
                id="name"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Parent / caregiver name"
              />
            </div>
          )}

          {mode !== 'reset' ? (
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
          ) : (
            <>
              <div>
                <label className="label" htmlFor="email-ro">
                  Email
                </label>
                <input id="email-ro" className="input bg-stone-50" value={email} readOnly />
              </div>
              <div>
                <label className="label" htmlFor="code">
                  Reset code
                </label>
                <input
                  id="code"
                  className="input font-mono text-xs"
                  value={resetCode}
                  onChange={(e) => setResetCode(e.target.value)}
                  required
                />
              </div>
            </>
          )}

          {mode !== 'forgot' && (
            <div>
              <label className="label" htmlFor="password">
                {mode === 'reset' ? 'New password' : 'Password'}
              </label>
              <input
                id="password"
                type="password"
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? 'Your password' : 'At least 8 characters'}
                required
              />
            </div>
          )}

          {info && (
            <p className="rounded-lg bg-sky-50 px-3 py-2 text-sm font-bold text-sky-800">{info}</p>
          )}
          {error && (
            <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p>
          )}

          <button type="submit" className="btn-primary w-full" disabled={busy}>
            {busy
              ? 'Please wait…'
              : mode === 'signup'
                ? 'Create account'
                : mode === 'login'
                  ? 'Log in'
                  : mode === 'forgot'
                    ? 'Send reset code'
                    : 'Set new password & log in'}
          </button>
        </form>

        <div className="mt-4 text-center text-sm">
          {mode === 'login' && (
            <button onClick={() => go('forgot')} className="font-bold text-brand-600 hover:underline">
              Forgot password?
            </button>
          )}
          {(mode === 'forgot' || mode === 'reset') && (
            <button onClick={() => go('login')} className="font-bold text-stone-500 hover:underline">
              ← Back to log in
            </button>
          )}
        </div>
      </div>

      <p className="mt-6 max-w-sm text-center text-xs text-stone-400">
        Informational only and not a substitute for professional medical advice. Always consult your
        pediatrician with concerns.
      </p>
    </div>
  );
}
