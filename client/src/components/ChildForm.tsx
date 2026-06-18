import { useState, type FormEvent } from 'react';
import type { Child, ChildInput } from '../types';

const AVATARS = ['👶', '🐣', '🧸', '🌟', '🐥', '🦋', '🐻', '🌸', '🚀', '🦁'];

interface Props {
  initial?: Child;
  onSubmit: (input: ChildInput) => Promise<void>;
  onCancel: () => void;
}

export function ChildForm({ initial, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initial?.name ?? '');
  const [birthday, setBirthday] = useState(initial?.birthday ?? '');
  const [sex, setSex] = useState<Child['sex']>(initial?.sex ?? '');
  const [avatar, setAvatar] = useState(initial?.avatar || AVATARS[0]);
  const [premature, setPremature] = useState(initial?.premature ?? false);
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const today = new Date().toISOString().slice(0, 10);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!name.trim()) return setError('Please enter a name.');
    if (!birthday) return setError('Please enter a birthday.');
    if (premature && !dueDate) return setError('Please enter the original due date.');
    setSaving(true);
    try {
      await onSubmit({ name: name.trim(), birthday, sex, avatar, premature, dueDate });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="label" htmlFor="cf-name">
          Child’s name
        </label>
        <input
          id="cf-name"
          className="input"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Maya"
          autoFocus
          maxLength={60}
        />
      </div>

      <div>
        <label className="label" htmlFor="cf-bday">
          Birthday
        </label>
        <input
          id="cf-bday"
          type="date"
          className="input"
          value={birthday}
          max={today}
          onChange={(e) => setBirthday(e.target.value)}
        />
      </div>

      <div>
        <span className="label">Pick an avatar</span>
        <div className="flex flex-wrap gap-2">
          {AVATARS.map((a) => (
            <button
              type="button"
              key={a}
              onClick={() => setAvatar(a)}
              className={`flex h-10 w-10 items-center justify-center rounded-xl text-xl transition ${
                avatar === a ? 'bg-brand-100 ring-2 ring-brand-400' : 'bg-stone-100 hover:bg-stone-200'
              }`}
              aria-label={`Avatar ${a}`}
              aria-pressed={avatar === a}
            >
              {a}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="cf-sex">
          Sex <span className="font-normal text-stone-400">(optional)</span>
        </label>
        <select
          id="cf-sex"
          className="input"
          value={sex}
          onChange={(e) => setSex(e.target.value as Child['sex'])}
        >
          <option value="">Prefer not to say</option>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>
      </div>

      <div className="rounded-xl bg-stone-50 p-3">
        <label className="flex items-center gap-2 text-sm font-bold text-stone-700">
          <input
            type="checkbox"
            checked={premature}
            onChange={(e) => setPremature(e.target.checked)}
            className="h-4 w-4 rounded border-stone-300 text-brand-500 focus:ring-brand-400"
          />
          Born prematurely (use corrected age)
        </label>
        {premature && (
          <div className="mt-3">
            <label className="label" htmlFor="cf-due">
              Original due date
            </label>
            <input
              id="cf-due"
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            <p className="mt-1 text-xs text-stone-500">
              The AAP recommends interpreting development by corrected age until about 2 years.
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm font-bold text-red-700">{error}</p>
      )}

      <div className="flex gap-2">
        <button type="submit" className="btn-primary flex-1" disabled={saving}>
          {saving ? 'Saving…' : initial ? 'Save changes' : 'Add child'}
        </button>
        <button type="button" className="btn-ghost" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
}
