import { Link } from 'react-router-dom';
import { SOURCES } from '../data/sources';

export function AboutSources() {
  const sources = Object.values(SOURCES);
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/" className="text-sm font-bold text-brand-600 hover:underline">
        ← Back to app
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-stone-800">About the data &amp; our sources</h1>

      <div className="card mt-5 p-5 leading-relaxed text-stone-700">
        <p>
          BabyStages aggregates child-development milestones and parenting guidance from
          well-established, evidence-based public health authorities. Content is organized into age
          bands aligned with the CDC’s <strong>“Learn the Signs. Act Early.”</strong> milestone
          checkpoints (updated in 2022 in collaboration with the American Academy of Pediatrics),
          with motor-development context from the World Health Organization and broader guidance
          from the AAP’s HealthyChildren.org.
        </p>
        <p className="mt-3">
          Every milestone and Do/Don’t in the app links back to one of the organizations below.
          Milestones are presented as <strong>typical ranges, not deadlines</strong> — healthy
          children reach them at different times.
        </p>
      </div>

      <h2 className="mt-8 text-xl font-extrabold text-stone-800">Sources referenced</h2>
      <ul className="mt-3 space-y-3">
        {sources.map((s) => (
          <li key={s.url} className="card p-4">
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-brand-600 hover:underline"
            >
              {s.org}
            </a>
            <p className="mt-1 break-all text-xs text-stone-400">{s.url}</p>
          </li>
        ))}
      </ul>

      <div className="card mt-8 border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        <h2 className="text-base font-extrabold">Important</h2>
        <p className="mt-2">
          This app is for general information and education only. It is <strong>not medical
          advice</strong> and does not replace evaluation by a qualified health professional. If you
          have any concern about your child’s development, behavior, or health — or if your child
          loses skills they once had — contact your pediatrician.
        </p>
      </div>

      <p className="mt-6 text-xs text-stone-400">
        Content is maintained in a structured data file (<code>src/data/milestones.ts</code>) so it
        can be reviewed and updated as guidelines evolve.
      </p>
    </div>
  );
}
