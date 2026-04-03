import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api, withAuthHeaders } from "../../shared/api";

export default function AdminPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem("golf_auth_token");
  const user = useMemo(() => JSON.parse(localStorage.getItem("golf_auth_user") || "{}"), []);

  const [analytics, setAnalytics] = useState(null);
  const [simulation, setSimulation] = useState(null);
  const [mode, setMode] = useState("random");
  const [message, setMessage] = useState("");

  async function load() {
    const { data } = await api.get("/admin/analytics", withAuthHeaders(token));
    setAnalytics(data);
  }

  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/dashboard");
      return;
    }
    load();
  }, []);

  async function runSimulation() {
    const { data } = await api.get(`/draw/simulate?mode=${mode}`, withAuthHeaders(token));
    setSimulation(data);
    setMessage("Simulation complete");
  }

  async function publishDraw() {
    await api.post("/draw/publish", { mode }, withAuthHeaders(token));
    setMessage("Draw published");
    load();
  }

  if (!analytics) {
    return <div className="page-shell">Loading admin panel...</div>;
  }

  return (
    <main className="page-shell">
      <header className="page-header">
        <h1>Admin Dashboard</h1>
        <div>
          <button onClick={() => navigate("/dashboard")}>User Panel</button>
          <button onClick={() => navigate("/")}>Home</button>
        </div>
      </header>

      <section className="grid three-up">
        <article className="panel">
          <h2>Total Users</h2>
          <p>{analytics.totalUsers}</p>
        </article>
        <article className="panel">
          <h2>Total Prize Pool</h2>
          <p>${analytics.totalPrizePool}</p>
        </article>
        <article className="panel">
          <h2>Total Charity Contribution</h2>
          <p>${analytics.totalCharityContribution}</p>
        </article>
      </section>

      <section className="panel">
        <h2>Draw Management</h2>
        <div className="inline-form">
          <select value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="random">Random</option>
            <option value="algorithm">Algorithmic (weighted)</option>
          </select>
          <button onClick={runSimulation}>Run Simulation</button>
          <button onClick={publishDraw}>Publish Draw</button>
        </div>
        {simulation ? (
          <div className="simulation-box">
            <p>Draw Set: {simulation.drawSet.join(", ")}</p>
            <p>Mode: {simulation.mode}</p>
          </div>
        ) : null}
      </section>

      <section className="panel">
        <h2>Recent Draw Stats</h2>
        <ul className="plain-list">
          {analytics.drawStats.map((draw) => (
            <li key={draw.id}>
              <strong>{draw.month}</strong>
              <span>5-Match Winners: {draw.winners.five}</span>
            </li>
          ))}
        </ul>
      </section>

      {message ? <p className="flash">{message}</p> : null}
    </main>
  );
}
