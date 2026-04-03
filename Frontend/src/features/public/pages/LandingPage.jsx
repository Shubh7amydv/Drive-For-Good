import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <main className="landing">
      <div className="ambient-gradient" />
      <header>
        <h1>Drive For Good</h1>
        <nav>
          <Link to="/faq">FAQ</Link>
          <Link to="/charities">Charities</Link>
          <Link to="/login">Login</Link>
          <Link to="/register" className="cta">Subscribe</Link>
        </nav>
      </header>

      <section className="hero">
        <p className="eyebrow">Golf performance meets monthly impact</p>
        <h2>Track 5 scores. Enter monthly draws. Fund real charities.</h2>
        <p>
          A subscription platform where every swing fuels charitable action while you compete for
          monthly rewards.
        </p>
        <Link to="/register" className="hero-cta">Start Subscription</Link>
      </section>

      <section className="pillars">
        <article>
          <h3>How You Play</h3>
          <p>Enter your latest 5 Stableford scores (1 to 45). New scores auto-replace the oldest.</p>
        </article>
        <article>
          <h3>How You Win</h3>
          <p>Every month, our draw engine runs 3 tiers: 5-match, 4-match, and 3-match pools.</p>
        </article>
        <article>
          <h3>How You Give</h3>
          <p>Choose your charity and direct at least 10% of your subscription to meaningful causes.</p>
        </article>
      </section>

      <section className="why-drive-for-good">
        <h2>Why Drive For Good?</h2>
        <div className="features">
          <div className="feature">
            <h4>⚡ Lightning Fast</h4>
            <p>Enter scores, check results, manage subscriptions—all in seconds.</p>
          </div>
          <div className="feature">
            <h4>💰 Real Prizes</h4>
            <p>Verified monthly draws with transparent prize pools and instant payouts.</p>
          </div>
          <div className="feature">
            <h4>❤️ Direct Impact</h4>
            <p>Every subscription portion you choose goes directly to charities doing real work.</p>
          </div>
          <div className="feature">
            <h4>🏌️ For All Levels</h4>
            <p>Stableford scoring rewards consistent play, not just low scores. Everyone can win.</p>
          </div>
        </div>
      </section>

      <footer className="landing-footer">
        <nav className="footer-links">
          <Link to="/faq">FAQ</Link>
          <Link to="/charities">Charities</Link>
          <Link to="/legal">Legal</Link>
          <a href="mailto:support@driveforgood.app">Support</a>
        </nav>
        <p>&copy; 2026 Drive For Good. All rights reserved.</p>
      </footer>
    </main>
  );
}
