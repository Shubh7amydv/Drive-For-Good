import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../shared/api";

const fallbackCharities = [
  { id: "charity_1", name: "Birdies For Books" },
  { id: "charity_2", name: "Fairway For Families" },
  { id: "charity_3", name: "Green Course Initiative" },
  { id: "charity_4", name: "Veterans Golf Alliance" }
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const [charities, setCharities] = useState([]);
  const [isLoadingCharities, setIsLoadingCharities] = useState(true);
  const [charityWarning, setCharityWarning] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    charityId: "",
    charityPercent: 10
  });

  useEffect(() => {
    async function loadCharities() {
      try {
        const { data } = await api.get("/charities");
        const options = data?.charities?.length ? data.charities : fallbackCharities;

        if (!data?.charities?.length) {
          setCharityWarning("Using default charity options. Please verify backend connectivity.");
        }

        setCharities(options);
        if (options[0]?.id) {
          setForm((prev) => ({ ...prev, charityId: options[0].id }));
        }
      } catch {
        setCharities(fallbackCharities);
        setCharityWarning("Could not load charity options from server. Using default options.");
        setForm((prev) => ({ ...prev, charityId: fallbackCharities[0].id }));
      } finally {
        setIsLoadingCharities(false);
      }
    }

    loadCharities();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/register", {
        ...form,
        charityId: form.charityId || undefined,
        charityPercent: Number(form.charityPercent)
      });
      localStorage.setItem("golf_auth_token", data.token);
      localStorage.setItem("golf_auth_user", JSON.stringify(data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Registration failed. Please confirm the backend is running on port 5000 or 5001."
      );
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h1>Join Drive For Good</h1>
        <p>Create your subscription-ready account in under one minute.</p>
        <form onSubmit={handleSubmit}>
          <input
            placeholder="Full name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <select
            value={form.charityId}
            onChange={(e) => setForm({ ...form, charityId: e.target.value })}
            disabled={isLoadingCharities}
            required
          >
            {!form.charityId ? <option value="">Select a charity</option> : null}
            {charities.map((charity) => (
              <option key={charity.id} value={charity.id}>
                {charity.name}
              </option>
            ))}
          </select>
          <input
            type="number"
            min="10"
            max="100"
            value={form.charityPercent}
            onChange={(e) => setForm({ ...form, charityPercent: e.target.value })}
            required
          />
          <button type="submit">Create Account</button>
        </form>
        {charityWarning ? <small>{charityWarning}</small> : null}
        {error ? <small>{error}</small> : null}
        <div className="auth-links">
          <Link to="/login">Already have an account?</Link>
          <Link to="/">Back to homepage</Link>
        </div>
      </div>
    </section>
  );
}
