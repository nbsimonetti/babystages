import type { ReactNode } from 'react';
import type { Source } from '../types';

export function SectionCard({
  title,
  icon,
  subtitle,
  children,
  accent = 'brand',
}: {
  title: string;
  icon: string;
  subtitle?: string;
  children: ReactNode;
  accent?: 'brand' | 'green' | 'sky' | 'amber' | 'violet';
}) {
  const accents: Record<string, string> = {
    brand: 'bg-brand-50 text-brand-700',
    green: 'bg-emerald-50 text-emerald-700',
    sky: 'bg-sky-50 text-sky-700',
    amber: 'bg-amber-50 text-amber-700',
    violet: 'bg-violet-50 text-violet-700',
  };
  return (
    <section className="card overflow-hidden">
      <header className={`flex items-center gap-3 px-5 py-4 ${accents[accent]}`}>
        <span className="text-2xl" aria-hidden>
          {icon}
        </span>
        <div>
          <h2 className="text-lg font-extrabold leading-tight">{title}</h2>
          {subtitle && <p className="text-sm opacity-80">{subtitle}</p>}
        </div>
      </header>
      <div className="px-5 py-4">{children}</div>
    </section>
  );
}

export function SourceTag({ source }: { source: Source }) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-block text-[11px] font-bold text-stone-400 underline-offset-2 hover:text-brand-600 hover:underline"
      title={`Source: ${source.org}`}
    >
      {source.org}
    </a>
  );
}
