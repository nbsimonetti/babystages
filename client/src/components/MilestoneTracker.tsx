import { useState } from 'react';
import type { AgeBand, Child } from '../types';
import { AGE_BANDS, DOMAIN_META, milestoneKey } from '../data/milestones';
import { SectionCard } from './ui';

interface Props {
  child: Child;
  currentBandIndex: number;
  onToggle: (key: string, observed: boolean) => void;
}

export function MilestoneTracker({ child, currentBandIndex, onToggle }: Props) {
  const [showEarlier, setShowEarlier] = useState(false);
  const observed = new Set(child.observed || []);
  const reached = AGE_BANDS.slice(0, currentBandIndex + 1);
  const current = reached[reached.length - 1];
  const earlier = reached.slice(0, -1);

  const allKeys = reached.flatMap((b) => b.milestones.map((_, i) => milestoneKey(b.id, i)));
  const total = allKeys.length;
  const done = allKeys.filter((k) => observed.has(k)).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  function Row({ band, index }: { band: AgeBand; index: number }) {
    const m = band.milestones[index];
    const key = milestoneKey(band.id, index);
    const checked = observed.has(key);
    return (
      <label
        className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
          checked ? 'border-emerald-200 bg-emerald-50' : 'border-stone-100 hover:bg-stone-50'
        }`}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onToggle(key, e.target.checked)}
          className="mt-0.5 h-5 w-5 shrink-0 rounded border-stone-300 text-emerald-500 focus:ring-emerald-400"
        />
        <span className={`text-sm ${checked ? 'text-emerald-900' : 'text-stone-700'}`}>
          <span aria-hidden className="mr-1">
            {DOMAIN_META[m.domain].icon}
          </span>
          {m.text}
        </span>
      </label>
    );
  }

  return (
    <SectionCard
      title="Milestone Tracker"
      icon="📋"
      subtitle="Check off milestones as you notice them"
      accent="violet"
    >
      <div className="mb-4">
        <div className="mb-1 flex items-center justify-between text-sm font-bold text-stone-600">
          <span>
            {done} of {total} observed
          </span>
          <span>{pct}%</span>
        </div>
        <div className="h-2.5 overflow-hidden rounded-full bg-stone-100">
          <div
            className="h-full rounded-full bg-emerald-400 transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-stone-500">
          Every child develops at their own pace — there’s no need to rush, and these aren’t a
          checklist your child “must” complete. Tracking simply helps you celebrate progress and
          share notes with your pediatrician.
        </p>
      </div>

      <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-violet-700">
        {current.label} · now
      </h3>
      <div className="space-y-2">
        {current.milestones.map((_, i) => (
          <Row key={i} band={current} index={i} />
        ))}
      </div>

      {earlier.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowEarlier((s) => !s)}
            className="text-sm font-bold text-violet-700 hover:underline"
            aria-expanded={showEarlier}
          >
            {showEarlier ? 'Hide earlier stages' : `Show earlier stages (${earlier.length})`}
          </button>
          {showEarlier && (
            <div className="mt-3 space-y-5">
              {[...earlier].reverse().map((band) => (
                <div key={band.id}>
                  <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-stone-400">
                    {band.label}
                  </h3>
                  <div className="space-y-2">
                    {band.milestones.map((_, i) => (
                      <Row key={i} band={band} index={i} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </SectionCard>
  );
}
