import { picksForBand, AFFILIATE_DISCLOSURE } from '../data/products';
import { SectionCard } from './ui';

export function AffiliatePicks({ bandId }: { bandId: string }) {
  const picks = picksForBand(bandId);
  return (
    <SectionCard
      title="Helpful for this stage"
      icon="🛍️"
      subtitle="Optional ideas to support play & development"
      accent="amber"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        {picks.map(({ pick, url }) => (
          <a
            key={pick.title}
            href={url}
            target="_blank"
            rel="sponsored nofollow noopener noreferrer"
            className="flex flex-col rounded-xl border border-stone-100 p-3 transition hover:border-amber-300 hover:bg-amber-50"
          >
            <span className="font-bold text-stone-800">{pick.title}</span>
            <span className="mt-0.5 text-sm text-stone-600">{pick.why}</span>
            <span className="mt-2 text-xs font-bold text-amber-700">View options →</span>
          </a>
        ))}
      </div>
      <p className="mt-3 text-[11px] leading-relaxed text-stone-400">{AFFILIATE_DISCLOSURE}</p>
    </SectionCard>
  );
}
