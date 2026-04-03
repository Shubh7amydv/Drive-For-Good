import { useState } from "react";

const faqData = [
  {
    question: "How does Drive For Good work?",
    answer: "Enter your latest 5 Stableford golf scores. Each month, we run a draw with prize pools split across 5-match, 4-match, and 3-match tiers. Winners are verified and paid out. A portion of every subscription supports your chosen charity."
  },
  {
    question: "What is Stableford scoring?",
    answer: "Stableford is a golf scoring format where you earn points based on your score relative to par: 8+ points (eagle or better), 5 points (birdie), 2 points (par), 0 points (bogey), -1 point (double bogey or worse). Valid range: 1–45 points per round."
  },
  {
    question: "How often are draws run?",
    answer: "Draws run monthly on the 1st of each month at 2:00 PM UTC. Only users with active subscriptions during the month are eligible."
  },
  {
    question: "What happens if there's no 5-match winner?",
    answer: "The 5-match prize pool (40%) rolls over to the next month's jackpot. This means jackpots can grow significantly if no one matches all 5 numbers."
  },
  {
    question: "How much of my subscription goes to charity?",
    answer: "You choose a minimum of 10% up to 100% of your subscription to go to your selected charity. You can also make independent donations beyond your subscription."
  },
  {
    question: "Can I change my charity after subscribing?",
    answer: "Yes, you can update your charity selection and contribution percentage anytime from your dashboard. Changes take effect on your next billing cycle."
  },
  {
    question: "How do I claim a prize?",
    answer: "If you win, you'll receive a notification. Upload proof of your scores from the platform. Our team reviews and approves it within 48 hours. Approved winnings are paid to your bank account within 5 business days."
  },
  {
    question: "What if I end my subscription?",
    answer: "You can cancel anytime. Your existing scores remain for historical reference, but you won't be eligible for future draws. Any pending winnings will still be processed."
  }
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>Frequently Asked Questions</h1>
      </header>

      <section className="faq-section">
        <div className="faq-list">
          {faqData.map((item, idx) => (
            <article
              key={idx}
              className={`faq-item ${openIndex === idx ? "open" : ""}`}
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
            >
              <h3 className="faq-question">{item.question}</h3>
              {openIndex === idx && <p className="faq-answer">{item.answer}</p>}
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
