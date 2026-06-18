// Age math. All calendar-aware (handles month/year lengths) and supports
// "corrected age" for babies born preterm: corrected age = chronological age
// minus the number of weeks born early, which the AAP recommends using to
// interpret development until about age 2.

export interface AgeBreakdown {
  totalDays: number;
  years: number;
  months: number; // remaining months after years
  days: number; // remaining days after months
  totalMonths: number; // whole months
  totalWeeks: number;
  label: string; // human-friendly, e.g. "7 months, 2 weeks"
}

function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function parseDate(iso: string): Date {
  // Treat YYYY-MM-DD as a local date (avoid UTC off-by-one).
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/**
 * Effective birthday for age calculations. For preterm babies with a due date,
 * we use the due date so the corrected age reflects developmental expectations.
 */
export function effectiveBirthday(birthday: string, premature: boolean, dueDate: string): Date {
  if (premature && dueDate) return parseDate(dueDate);
  return parseDate(birthday);
}

export function daysBetween(from: Date, to: Date): number {
  const ms = startOfDay(to).getTime() - startOfDay(from).getTime();
  return Math.floor(ms / 86_400_000);
}

export function ageFrom(from: Date, now: Date = new Date()): AgeBreakdown {
  const a = startOfDay(from);
  const b = startOfDay(now);
  const totalDays = Math.max(0, daysBetween(a, b));

  let years = b.getFullYear() - a.getFullYear();
  let months = b.getMonth() - a.getMonth();
  let days = b.getDate() - a.getDate();
  if (days < 0) {
    months -= 1;
    // days in the previous month relative to "now"
    const prevMonth = new Date(b.getFullYear(), b.getMonth(), 0).getDate();
    days += prevMonth;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  if (years < 0) {
    years = 0;
    months = 0;
    days = 0;
  }

  const totalMonths = years * 12 + months;
  const totalWeeks = Math.floor(totalDays / 7);

  return {
    totalDays,
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    label: humanLabel(years, months, days, totalDays, totalWeeks),
  };
}

function humanLabel(
  years: number,
  months: number,
  days: number,
  totalDays: number,
  totalWeeks: number
): string {
  if (totalDays < 14) return `${totalDays} day${totalDays === 1 ? '' : 's'} old`;
  if (totalDays < 84) {
    // under ~12 weeks: weeks read most naturally
    const w = totalWeeks;
    const remDays = totalDays - w * 7;
    return remDays
      ? `${w} week${w === 1 ? '' : 's'}, ${remDays} day${remDays === 1 ? '' : 's'} old`
      : `${w} week${w === 1 ? '' : 's'} old`;
  }
  if (years < 1) {
    const weeks = Math.floor(days / 7);
    return weeks
      ? `${months} month${months === 1 ? '' : 's'}, ${weeks} week${weeks === 1 ? '' : 's'} old`
      : `${months} month${months === 1 ? '' : 's'} old`;
  }
  if (years < 3) {
    return months
      ? `${years} year${years === 1 ? '' : 's'}, ${months} month${months === 1 ? '' : 's'} old`
      : `${years} year${years === 1 ? '' : 's'} old`;
  }
  return `${years} year${years === 1 ? '' : 's'} old`;
}

export function shortAge(b: AgeBreakdown): string {
  if (b.totalDays < 84) return `${b.totalWeeks}w`;
  if (b.years < 1) return `${b.totalMonths}mo`;
  if (b.years < 3) return `${b.years}y ${b.months}mo`;
  return `${b.years}y`;
}
