import { Link } from "react-router-dom";

export default function LegalPage() {
  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>Legal & Compliance</h1>
      </header>

      <section className="legal-grid">
        <article className="legal-card">
          <h2>Privacy Policy</h2>
          <p>Learn how we collect, use, and protect your personal data.</p>
          <a href="/PRIVACY_POLICY.md" target="_blank" rel="noopener noreferrer">
            Read Full Policy
          </a>
        </article>

        <article className="legal-card">
          <h2>Terms & Conditions</h2>
          <p>
            Understand the rules, rights, and responsibilities related to subscription, draws,
            and prize claims.
          </p>
          <a href="/TERMS_CONDITIONS.md" target="_blank" rel="noopener noreferrer">
            Read Full Terms
          </a>
        </article>

        <article className="legal-card">
          <h2>Responsible Gaming</h2>
          <p>Important disclaimers and resources for healthy, responsible use of the platform.</p>
          <a href="/RESPONSIBLE_GAMING.md" target="_blank" rel="noopener noreferrer">
            Read Disclaimer
          </a>
        </article>
      </section>

      <section className="legal-summary">
        <h2>Quick Summary</h2>
        <ul>
          <li>You must be 18+ to participate</li>
          <li>Subscriptions are recurring and can be cancelled anytime</li>
          <li>A minimum 10% of your subscription supports your chosen charity</li>
          <li>Prizes require proof of scores and admin verification</li>
          <li>Only users with active subscriptions during the month are draw-eligible</li>
          <li>Play responsibly. Do not submit false or fraudulent scores</li>
        </ul>
      </section>
    </main>
  );
}
