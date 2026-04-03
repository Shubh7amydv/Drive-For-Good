import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../../shared/api";

export default function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      localStorage.setItem("golf_auth_token", data.token);
      localStorage.setItem("golf_auth_user", JSON.stringify(data.user));
      navigate(data.user.role === "admin" ? "/admin" : "/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  }

  return (
    <section className="auth-shell">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p>Sign in to continue your impact-driven golf journey.</p>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Log In</button>
        </form>
        {error ? <small>{error}</small> : null}
        <div className="auth-links">
          <Link to="/register">Create account</Link>
          <Link to="/">Back to homepage</Link>
        </div>
      </div>
    </section>
  );
}
