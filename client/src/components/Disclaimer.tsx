import { Link } from 'react-router-dom';

export function Disclaimer() {
  return (
    <div className="border-t border-amber-200 bg-amber-50 px-4 py-3 text-center text-xs text-amber-900">
      <span className="font-bold">Informational only — not medical advice.</span>{' '}
      Every child develops at their own pace; milestones are typical ranges, not deadlines. For any
      concern about your child’s development or health, talk with your pediatrician.{' '}
      <Link to="/about" className="font-bold underline">
        See our sources
      </Link>
      .
    </div>
  );
}
