// Pluggable transactional mailer. In development it logs to the console so the
// password-reset flow is testable without an email account. In production, set
// EMAIL_PROVIDER and wire a real provider (Postmark / SendGrid / AWS SES) below.
export async function sendMail({ to, subject, text }) {
  if (process.env.EMAIL_PROVIDER) {
    // TODO(production): integrate the chosen provider's SDK here, e.g.
    //   await postmark.sendEmail({ From, To: to, Subject: subject, TextBody: text })
    // Throw on failure so callers can surface a retry.
    throw new Error('EMAIL_PROVIDER set but no provider is wired up yet.');
  }
  // Dev fallback: log instead of sending.
  console.log(`\n[mailer:dev] To: ${to}\n[mailer:dev] Subject: ${subject}\n${text}\n`);
  return { delivered: false, dev: true };
}
