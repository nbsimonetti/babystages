import { useMemo } from 'react';
import type { Child, Domain } from '../types';
import { ageFrom, effectiveBirthday, parseDate } from '../lib/age';
import { AGE_BANDS, DOMAIN_META, bandIndexForDays } from '../data/milestones';
import { SectionCard, SourceTag } from './ui';
import { MilestoneTracker } from './MilestoneTracker';
import { AffiliatePicks } from './AffiliatePicks';

const DOMAIN_ORDER: Domain[] = ['physical', 'cognitive', 'language', 'social', 'feedingSleep'];

function horizonLabel(totalDays: number): string {
  if (totalDays < 365) return 'in the coming weeks and months';
  if (totalDays < 1095) return 'in the next few months';
  return 'over the next year';
}

export function FocusedView({
  child,
  onToggleMilestone,
  isPremium,
  onUpgrade,
}: {
  child: Child;
  onToggleMilestone: (key: string, observed: boolean) => void;
  isPremium: boolean;
  onUpgrade: (reason: string) => void;
}) {
  function handleExport() {
    if (!isPremium) {
      onUpgrade('Export a printable summary for pediatrician visits');
      return;
    }
    // On web this opens the print/Save-as-PDF dialog. In the mobile app this is
    // wired to a native share/PDF plugin (see docs/MOBILE.md).
    window.print();
  }
  const data = useMemo(() => {
    const effBday = effectiveBirthday(child.birthday, child.premature, child.dueDate);
    const chronoAge = ageFrom(parseDate(child.birthday));
    const age = ageFrom(effBday);
    const idx = bandIndexForDays(age.totalDays);
    const band = AGE_BANDS[idx];
    const upcoming = AGE_BANDS.slice(idx + 1, idx + 3); // next 1–2 bands
    // progress through current band, for a friendly progress bar
    const span = band.maxDays - band.minDays;
    const progressed = Math.min(span, Math.max(0, age.totalDays - band.minDays));
    const progress = Math.round((progressed / span) * 100);
    return { age, chronoAge, band, upcoming, progress, idx };
  }, [child]);

  const { age, chronoAge, band, upcoming, progress, idx } = data;
  const usingCorrected = child.premature && child.dueDate;

  return (
    <div className="space-y-5">
      {/* Hero */}
      <div className="card bg-gradient-to-br from-brand-500 to-brand-600 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-4xl">
            {child.avatar || '👶'}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold">{child.name}</h1>
            <p className="font-bold text-white/90">{age.label}</p>
            {usingCorrected && (
              <p className="text-xs text-white/80">
                Corrected age shown (chronological: {chronoAge.label})
              </p>
            )}
          </div>
        </div>
        <div className="mt-5">
          <div className="mb-1 flex justify-between text-xs font-bold text-white/90">
            <span>Developmental window: {band.label}</span>
            <span>{progress}% through this stage</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {/* Pediatrician-visit export (premium) */}
      <div className="flex justify-end">
        <button onClick={handleExport} className="btn-ghost text-sm">
          📄 Summary for your pediatrician
          {!isPremium && (
            <span className="pill ml-1 bg-brand-100 text-brand-700">Premium</span>
          )}
        </button>
      </div>

      {/* Developmental Window */}
      <SectionCard
        title="Developmental Window"
        icon="🌱"
        subtitle={`What's happening right now — ${band.label}`}
      >
        <p className="mb-4 leading-relaxed text-stone-700">{band.overview}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {DOMAIN_ORDER.map((domain) => {
            const items = band.milestones.filter((m) => m.domain === domain);
            if (!items.length) return null;
            const meta = DOMAIN_META[domain];
            return (
              <div key={domain} className="rounded-xl border border-stone-100 bg-stone-50 p-3">
                <h3 className="mb-2 flex items-center gap-2 text-sm font-extrabold text-stone-700">
                  <span aria-hidden>{meta.icon}</span> {meta.label}
                </h3>
                <ul className="space-y-1.5">
                  {items.map((m, i) => (
                    <li key={i} className="text-sm text-stone-600">
                      • {m.text}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </SectionCard>

      {/* Milestone Tracker */}
      <MilestoneTracker child={child} currentBandIndex={idx} onToggle={onToggleMilestone} />

      {/* Upcoming Milestones */}
      <SectionCard
        title="Upcoming Milestones"
        icon="🔭"
        subtitle={`What you might see ${horizonLabel(age.totalDays)}`}
        accent="sky"
      >
        {upcoming.length === 0 ? (
          <p className="text-stone-600">
            Your child has grown through all the stages we track here. Keep encouraging curiosity,
            reading together, and active play!
          </p>
        ) : (
          <div className="space-y-4">
            {upcoming.map((b) => (
              <div key={b.id}>
                <h3 className="mb-2 text-sm font-extrabold uppercase tracking-wide text-sky-700">
                  Around {b.label}
                </h3>
                <ul className="space-y-2.5">
                  {b.milestones.map((m, i) => (
                    <li key={i} className="rounded-xl border border-stone-100 p-3">
                      <p className="font-bold text-stone-700">
                        <span aria-hidden>{DOMAIN_META[m.domain].icon}</span> {m.text}
                      </p>
                      {m.tip && (
                        <p className="mt-1 text-sm text-stone-600">
                          <span className="font-bold text-sky-700">How to prepare:</span> {m.tip}
                        </p>
                      )}
                      <div className="mt-1">
                        <SourceTag source={m.source} />
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Dos and Don'ts */}
      <SectionCard
        title="Dos &amp; Don’ts"
        icon="✅"
        subtitle="Encouraging healthy development at this age"
        accent="green"
      >
        <div className="space-y-3">
          {band.dosDonts.map((dd, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-2">
              <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
                <span className="mr-1 font-extrabold">Do</span> {dd.do}
              </div>
              <div className="rounded-xl bg-red-50 p-3 text-sm text-red-900">
                <span className="mr-1 font-extrabold">Don’t</span> {dd.dont}
                <div className="mt-1">
                  <SourceTag source={dd.source} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Daily Rhythms + Play side by side on wide screens */}
      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Daily Rhythms" icon="🕒" subtitle="Typical sleep & feeding" accent="violet">
          <dl className="space-y-3">
            <div>
              <dt className="text-sm font-extrabold text-stone-700">Sleep</dt>
              <dd className="text-sm text-stone-600">{band.dailyRhythm.sleep}</dd>
            </div>
            <div>
              <dt className="text-sm font-extrabold text-stone-700">Feeding</dt>
              <dd className="text-sm text-stone-600">{band.dailyRhythm.feeding}</dd>
            </div>
            {band.dailyRhythm.note && (
              <p className="rounded-lg bg-violet-50 px-3 py-2 text-sm text-violet-800">
                💡 {band.dailyRhythm.note}
              </p>
            )}
          </dl>
        </SectionCard>

        <SectionCard title="Play &amp; Activity Ideas" icon="🎨" subtitle="Development through play" accent="amber">
          <ul className="space-y-2">
            {band.play.map((p, i) => (
              <li key={i} className="flex gap-2 text-sm text-stone-700">
                <span aria-hidden>🟡</span> {p}
              </li>
            ))}
          </ul>
        </SectionCard>
      </div>

      {/* Stage-based product ideas (affiliate) */}
      <AffiliatePicks bandId={band.id} />

      {/* Safety */}
      <SectionCard title="Safety Checklist" icon="🛟" subtitle="Age-relevant safety reminders">
        <ul className="grid gap-2 sm:grid-cols-2">
          {band.safety.map((s, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl border border-stone-100 p-3 text-sm text-stone-700">
              <span aria-hidden>🔒</span> {s}
            </li>
          ))}
        </ul>
      </SectionCard>

      {/* When to talk to your doctor */}
      <SectionCard
        title="When to Talk to Your Doctor"
        icon="🩺"
        subtitle="Reasons to check in — not causes for alarm"
        accent="amber"
      >
        <p className="mb-3 text-sm text-stone-600">
          Children develop at different paces. These are signs the CDC suggests discussing with your
          pediatrician. Mentioning them early simply helps you get support if it’s needed — and
          reassurance if it isn’t. Always trust your instincts and ask about anything that worries
          you.
        </p>
        <ul className="space-y-2">
          {band.watchFor.map((w, i) => (
            <li key={i} className="flex items-start gap-2 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
              <span aria-hidden>•</span> {w}
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-stone-500">
          Source: CDC “Learn the Signs. Act Early.” If your child loses skills they once had, contact
          your pediatrician promptly.
        </p>
      </SectionCard>
    </div>
  );
}
