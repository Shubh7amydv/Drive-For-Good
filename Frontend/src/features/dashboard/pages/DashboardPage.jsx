import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, withAuthHeaders } from "../../shared/api";

const initialScore = { value: "", date: "" };

export default function DashboardPage() {
  const navigate = useNavigate();
  const user = useMemo(() => JSON.parse(localStorage.getItem("golf_auth_user") || "{}"), []);
  const token = localStorage.getItem("golf_auth_token");

  const [dashboard, setDashboard] = useState(null);
  const [score, setScore] = useState(initialScore);
  const [subscriptionPlan, setSubscriptionPlan] = useState("monthly");
  const [message, setMessage] = useState("");

  async function loadDashboard() {
    const { data } = await api.get("/user/dashboard", withAuthHeaders(token));
    setDashboard(data);
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  async function activateSubscription() {
    const { data } = await api.post(
      "/user/subscription",
      { plan: subscriptionPlan },
      withAuthHeaders(token)
    );

    if (!data.requiresPayment) {
      setMessage("Subscription activated");
      loadDashboard();
      return;
    }

    if (!window.Razorpay) {
      setMessage("Razorpay SDK failed to load. Refresh and try again.");
      return;
    }

    const paymentOptions = {
      key: data.keyId,
      amount: data.order.amount,
      currency: data.order.currency,
      name: "Drive For Good",
      description: `${subscriptionPlan} subscription`,
      order_id: data.order.id,
      prefill: {
        name: user.name || "",
        email: user.email || ""
      },
      theme: {
        color: "#ff6b35"
      },
      handler: async function (response) {
        await api.post(
          "/user/subscription/verify",
          {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          },
          withAuthHeaders(token)
        );
        setMessage("Payment successful. Subscription activated.");
        loadDashboard();
      }
    };

    const rzp = new window.Razorpay(paymentOptions);
    rzp.on("payment.failed", function () {
      setMessage("Payment failed. Please try again.");
    });
    rzp.open();
  }

  async function addScore() {
    await api.post(
      "/user/scores",
      { value: Number(score.value), date: score.date },
      withAuthHeaders(token)
    );
    setScore(initialScore);
    setMessage("Score added");
    loadDashboard();
  }

  function logout() {
    localStorage.removeItem("golf_auth_user");
    localStorage.removeItem("golf_auth_token");
    navigate("/");
  }

  if (!dashboard) {
    return <div className="page-shell">Loading dashboard...</div>;
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>Subscriber Dashboard</h1>
        <div>
          <button onClick={() => navigate("/admin")}>Admin</button>
          <button onClick={logout}>Logout</button>
        </div>
      </header>

      <section className="grid two-up">
        <article className="panel">
          <h2>Subscription</h2>
          <p>Status: {dashboard.subscription.status}</p>
          <p>Renewal: {dashboard.subscription.renewalDate || "-"}</p>
          <div className="inline-form">
            <select value={subscriptionPlan} onChange={(e) => setSubscriptionPlan(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <button onClick={activateSubscription}>Activate</button>
          </div>
        </article>

        <article className="panel">
          <h2>Charity</h2>
          <p>Selected: {dashboard.charity?.name || "Not selected"}</p>
          <p>Contribution: {dashboard.charity?.percent || user.charityPercent || 10}%</p>
        </article>
      </section>

      <section className="grid two-up">
        <article className="panel">
          <h2>Add Stableford Score</h2>
          <div className="inline-form">
            <input
              type="number"
              min="1"
              max="45"
              placeholder="Score"
              value={score.value}
              onChange={(e) => setScore({ ...score, value: e.target.value })}
            />
            <input
              type="date"
              value={score.date}
              onChange={(e) => setScore({ ...score, date: e.target.value })}
            />
            <button onClick={addScore}>Save</button>
          </div>
          <small>Only latest 5 scores are retained automatically.</small>
        </article>

        <article className="panel">
          <h2>Latest Scores</h2>
          <ul className="plain-list">
            {dashboard.scores.map((s) => (
              <li key={s.id}>
                <strong>{s.value}</strong>
                <span>{s.date}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="panel">
        <h2>Participation and Winnings</h2>
        <p>Draws Entered: {dashboard.participation.drawsEntered}</p>
        <p>Upcoming Draws: {dashboard.participation.upcomingDraws}</p>
        <p>Total Won: ${dashboard.winnings.totalWon}</p>
      </section>

      {message ? <p className="flash">{message}</p> : null}
    </main>
  );
}
