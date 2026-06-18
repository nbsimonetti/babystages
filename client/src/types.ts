export interface Subscription {
  plan: 'free' | 'premium';
  tier?: string;
  status: string;
  provider?: string | null;
  currentPeriodEnd?: string | null;
  trialEndsAt?: string | null;
}

export interface Entitlement {
  plan: 'free' | 'premium';
  premium: boolean;
  limits: { maxChildren: number | null; [key: string]: unknown };
  subscription: Subscription;
}

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
  subscription?: Subscription;
}

export interface Child {
  id: string;
  userId: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  sex: 'male' | 'female' | '';
  avatar: string; // emoji or initials
  premature: boolean;
  dueDate: string; // YYYY-MM-DD, only when premature
  observed: string[]; // milestone keys the parent has checked off
  createdAt: string;
  updatedAt: string;
}

export type ChildInput = Pick<
  Child,
  'name' | 'birthday' | 'sex' | 'avatar' | 'premature' | 'dueDate'
>;

export type Domain =
  | 'physical'
  | 'cognitive'
  | 'language'
  | 'social'
  | 'feedingSleep';

export interface Source {
  org: string;
  url: string;
}

export interface Milestone {
  domain: Domain;
  text: string;
  /** How to encourage / prepare for this milestone. */
  tip?: string;
  source: Source;
}

export interface DoDont {
  do: string;
  dont: string;
  source: Source;
}

export interface AgeBand {
  id: string;
  label: string; // e.g. "2–4 months"
  /** Inclusive lower bound in days from birth. */
  minDays: number;
  /** Exclusive upper bound in days from birth. */
  maxDays: number;
  /** One-paragraph overview of what's happening developmentally. */
  overview: string;
  milestones: Milestone[];
  dosDonts: DoDont[];
  dailyRhythm: { sleep: string; feeding: string; note?: string };
  play: string[];
  safety: string[];
  /** CDC-style "act early" concerns, framed supportively. */
  watchFor: string[];
}
