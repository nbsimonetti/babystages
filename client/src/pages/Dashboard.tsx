import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import { useChildren } from '../lib/useChildren';
import { ChildForm } from '../components/ChildForm';
import { FamilyView } from '../components/FamilyView';
import { FocusedView } from '../components/FocusedView';
import { Disclaimer } from '../components/Disclaimer';
import { Paywall } from '../components/Paywall';
import type { Child } from '../types';

export function Dashboard() {
  const { user, logout, isPremium } = useAuth();
  const { children, selected, selectedId, loading, error, select, add, update, remove, toggleObserved } =
    useChildren();
  const [modal, setModal] = useState<null | { mode: 'add' } | { mode: 'edit'; child: Child }>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [paywall, setPaywall] = useState<null | { reason?: string }>(null);

  // Free tier allows one child; adding more opens the paywall.
  function openAdd() {
    if (!isPremium && children.length >= 1) {
      setPaywall({ reason: 'Add your whole family with Premium' });
    } else {
      setModal({ mode: 'add' });
    }
  }

  async function handleDelete(child: Child) {
    if (window.confirm(`Remove ${child.name}? This permanently deletes their profile.`)) {
      await remove(child.id);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <button
            onClick={() => select(null)}
            className="flex items-center gap-2 text-lg font-extrabold text-stone-800"
          >
            <span className="text-2xl">🍼</span> BabyStages
          </button>

          <div className="relative">
            <button
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center gap-2 rounded-xl bg-stone-100 px-3 py-2 text-sm font-bold text-stone-700 hover:bg-stone-200"
            >
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-500 text-xs text-white">
                {(user?.name || user?.email || '?').slice(0, 1).toUpperCase()}
              </span>
              <span className="hidden max-w-[10rem] truncate sm:inline">
                {user?.name || user?.email}
              </span>
            </button>
            {menuOpen && (
              <div
                className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-stone-200 bg-white shadow-lg"
                onMouseLeave={() => setMenuOpen(false)}
              >
                <Link
                  to="/account"
                  className="block px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-50"
                >
                  Account &amp; subscription
                </Link>
                <Link
                  to="/about"
                  className="block px-4 py-2.5 text-sm font-bold text-stone-700 hover:bg-stone-50"
                >
                  About &amp; sources
                </Link>
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2.5 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  Log out
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Child switcher */}
        {children.length > 0 && (
          <div className="mx-auto max-w-5xl px-4 pb-3">
            <div className="flex gap-2 overflow-x-auto pb-1">
              <button
                onClick={() => select(null)}
                className={`pill shrink-0 px-3 py-1.5 ${
                  selectedId === null
                    ? 'bg-brand-500 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                👨‍👩‍👧 Family view
              </button>
              {children.map((c) => (
                <button
                  key={c.id}
                  onClick={() => select(c.id)}
                  className={`pill shrink-0 gap-1.5 px-3 py-1.5 ${
                    selectedId === c.id
                      ? 'bg-brand-500 text-white'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <span aria-hidden>{c.avatar || '👶'}</span> {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Body */}
      <main className="mx-auto w-full max-w-5xl flex-1 px-4 py-6">
        {loading ? (
          <p className="py-20 text-center text-stone-400">Loading…</p>
        ) : error ? (
          <p className="rounded-xl bg-red-50 p-4 text-center font-bold text-red-700">{error}</p>
        ) : children.length === 0 ? (
          <EmptyState onAdd={openAdd} />
        ) : selected ? (
          <div>
            <div className="mb-4 flex items-center justify-between">
              <button
                onClick={() => select(null)}
                className="text-sm font-bold text-stone-500 hover:text-brand-600"
              >
                ← Family overview
              </button>
              <div className="flex gap-2">
                <button
                  className="btn-ghost text-sm"
                  onClick={() => setModal({ mode: 'edit', child: selected })}
                >
                  Edit
                </button>
                <button
                  className="btn-ghost text-sm text-red-600"
                  onClick={() => handleDelete(selected)}
                >
                  Remove
                </button>
              </div>
            </div>
            <FocusedView
              child={selected}
              onToggleMilestone={(key, observed) => toggleObserved(selected.id, key, observed)}
              isPremium={isPremium}
              onUpgrade={(reason) => setPaywall({ reason })}
            />
          </div>
        ) : (
          <FamilyView children={children} onSelect={select} onAdd={openAdd} />
        )}
      </main>

      <Disclaimer />

      {paywall && <Paywall reason={paywall.reason} onClose={() => setPaywall(null)} />}

      {/* Modal */}
      {modal && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
          <div className="card max-h-[92vh] w-full max-w-md overflow-y-auto rounded-b-none p-6 sm:rounded-2xl">
            <h2 className="mb-4 text-xl font-extrabold text-stone-800">
              {modal.mode === 'add' ? 'Add a child' : `Edit ${modal.child.name}`}
            </h2>
            <ChildForm
              initial={modal.mode === 'edit' ? modal.child : undefined}
              onCancel={() => setModal(null)}
              onSubmit={async (input) => {
                if (modal.mode === 'add') {
                  const child = await add(input);
                  select(child.id);
                } else {
                  await update(modal.child.id, input);
                }
                setModal(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="card mx-auto mt-8 max-w-md p-8 text-center">
      <div className="text-5xl">👶</div>
      <h2 className="mt-3 text-xl font-extrabold text-stone-800">Add your first child</h2>
      <p className="mt-2 text-stone-500">
        Enter your child’s birthday and we’ll show you what to expect right now, what’s coming next,
        and how to support their development.
      </p>
      <button className="btn-primary mt-5" onClick={onAdd}>
        + Add child
      </button>
    </div>
  );
}
