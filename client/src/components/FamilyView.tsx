import type { Child } from '../types';
import { ageFrom, effectiveBirthday, parseDate, shortAge } from '../lib/age';
import { AGE_BANDS, bandIndexForDays } from '../data/milestones';

interface Props {
  children: Child[];
  onSelect: (id: string) => void;
  onAdd: () => void;
}

export function FamilyView({ children, onSelect, onAdd }: Props) {
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-stone-800">Family Overview</h1>
          <p className="text-stone-500">A high-level snapshot of each child.</p>
        </div>
        <button className="btn-primary" onClick={onAdd}>
          + Add child
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {children.map((child) => {
          const age = ageFrom(effectiveBirthday(child.birthday, child.premature, child.dueDate));
          const chrono = ageFrom(parseDate(child.birthday));
          const idx = bandIndexForDays(age.totalDays);
          const band = AGE_BANDS[idx];
          const next = AGE_BANDS[idx + 1];
          const nextMilestone = next?.milestones[0];

          return (
            <button
              key={child.id}
              onClick={() => onSelect(child.id)}
              className="card group p-5 text-left transition hover:-translate-y-0.5 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-400"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-2xl">
                  {child.avatar || '👶'}
                </div>
                <div className="min-w-0">
                  <h2 className="truncate text-lg font-extrabold text-stone-800">{child.name}</h2>
                  <p className="text-sm font-bold text-brand-600">{shortAge(age)} old</p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <p className="text-stone-600">
                  <span className="font-bold text-stone-700">Stage:</span> {band.label}
                </p>
                <p className="line-clamp-2 text-stone-500">{band.overview}</p>
                {nextMilestone && (
                  <p className="rounded-lg bg-sky-50 px-3 py-2 text-sky-800">
                    <span className="font-bold">Next up:</span> {nextMilestone.text}
                  </p>
                )}
                {child.premature && child.dueDate && (
                  <p className="text-xs text-stone-400">
                    Corrected age (chronological: {shortAge(chrono)})
                  </p>
                )}
              </div>

              <p className="mt-4 text-sm font-bold text-brand-600 group-hover:underline">
                View {child.name}’s details →
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
