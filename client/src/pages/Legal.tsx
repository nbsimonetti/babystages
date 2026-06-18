import { Link, useParams } from 'react-router-dom';

const EFFECTIVE = '2026-05-28';
const CONTACT = 'privacy@babystages.app';

const PRIVACY: [string, string][] = [
  ['What we collect', 'Your email, password (stored only as a secure bcrypt hash), and the child profiles you create (name, birthday, optional photo/avatar, and milestones you check off). We do not require a real name and never ask for sensitive identifiers.'],
  ['Children’s data', 'BabyStages is intended for parents and caregivers (adults), not for use by children. Information about your child is entered and controlled by you. We treat it as personal data, minimize what we store, and never sell it or use it for advertising profiles.'],
  ['How we use it', 'To provide the service: show age-appropriate guidance, sync your family across devices, manage your subscription, and send account emails (e.g. password reset). We do not sell personal data.'],
  ['Affiliate links', 'Some product suggestions are affiliate links; if you buy through them we may earn a commission at no extra cost to you. Following a link takes you to a third-party retailer governed by its own privacy policy.'],
  ['Payments', 'Subscriptions are processed by the App Store or Google Play. We receive entitlement status (active/expired) but not your card details.'],
  ['Storage & security', 'Data is encrypted in transit (HTTPS) and protected at rest. Passwords are hashed. Access is restricted.'],
  ['Your rights', 'You can export your data and permanently delete your account at any time from the Account screen. For GDPR/CCPA requests, contact us.'],
  ['Retention', 'We keep your data while your account is active. Deleting your account erases your profile and all children/milestones.'],
  ['Contact', `Questions or requests: ${CONTACT}.`],
];

const TERMS: [string, string][] = [
  ['Informational only — not medical advice', 'BabyStages provides general, evidence-based information about typical child development. It is not medical advice and is not a substitute for professional care. Milestones are typical ranges, not deadlines. Always consult your pediatrician with any concern, and seek emergency care when needed.'],
  ['Eligibility', 'You must be 18+ and the parent/guardian or an authorized caregiver to create profiles for a child.'],
  ['Your account', 'Keep your credentials secure; you are responsible for activity under your account.'],
  ['Subscriptions & billing', 'Premium is an auto-renewing subscription billed through the App Store or Google Play. It renews unless canceled at least 24 hours before the period ends; manage or cancel in your store account. Prices may vary by region.'],
  ['Acceptable use', 'Don’t misuse the service, attempt to breach security, or rely on it for emergencies or diagnosis.'],
  ['Content & sources', 'Guidance is aggregated from public health authorities (CDC, AAP, WHO, NIH). We strive for accuracy but make no warranty that content is complete or error-free.'],
  ['Disclaimer & liability', 'The service is provided “as is.” To the maximum extent permitted by law, we are not liable for decisions made based on the app. It does not create a doctor–patient relationship.'],
  ['Changes', 'We may update these terms; continued use means acceptance of the changes.'],
  ['Contact', `Questions: ${CONTACT}.`],
];

export function Legal() {
  const { doc } = useParams();
  const isPrivacy = doc !== 'terms';
  const title = isPrivacy ? 'Privacy Policy' : 'Terms of Service';
  const items = isPrivacy ? PRIVACY : TERMS;

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <Link to="/" className="text-sm font-bold text-brand-600 hover:underline">
        ← Back
      </Link>
      <h1 className="mt-4 text-3xl font-extrabold text-stone-800">{title}</h1>
      <p className="mt-1 text-sm text-stone-400">Effective {EFFECTIVE}</p>

      <div className="mt-6 flex gap-2 text-sm">
        <Link
          to="/legal/privacy"
          className={`pill ${isPrivacy ? 'bg-brand-500 text-white' : 'bg-stone-100 text-stone-600'}`}
        >
          Privacy
        </Link>
        <Link
          to="/legal/terms"
          className={`pill ${!isPrivacy ? 'bg-brand-500 text-white' : 'bg-stone-100 text-stone-600'}`}
        >
          Terms
        </Link>
      </div>

      <dl className="mt-6 space-y-5">
        {items.map(([h, body]) => (
          <div key={h} className="card p-4">
            <dt className="font-extrabold text-stone-800">{h}</dt>
            <dd className="mt-1 text-sm leading-relaxed text-stone-600">{body}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-6 rounded-xl bg-amber-50 p-4 text-xs text-amber-900">
        This in-app summary is provided for convenience. The complete, canonical Privacy Policy and
        Terms are maintained in the project’s <code>docs/</code> folder and should be hosted at public
        URLs for store submission.
      </p>
    </div>
  );
}
