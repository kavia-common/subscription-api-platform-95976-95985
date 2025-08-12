import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * SignupPage allows a user to create an account and pick a starting plan.
 */

export default function SignupPage() {
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [plan, setPlan] = useState("normal");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signUp(email, password, plan);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err?.message || "Signup failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-container">
      <h1 className="title">Create your account</h1>
      <p className="subtitle">Choose a plan and start using the API.</p>

      <form className="form" onSubmit={handleSubmit}>
        <label className="label">
          Email
          <input
            className="input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </label>

        <label className="label">
          Password
          <input
            className="input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </label>

        <label className="label">
          Plan
          <select
            className="input"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
          >
            <option value="normal">Normal</option>
            <option value="premium">Premium</option>
            <option value="ultra">Ultra</option>
          </select>
        </label>

        <button className="btn btn-primary" type="submit" disabled={submitting}>
          {submitting ? "Creating account..." : "Create account"}
        </button>

        {error && <div className="error">{error}</div>}
      </form>

      <div className="auth-footer">
        <span>Already have an account?</span> <Link to="/login">Sign in</Link>
      </div>

      <footer style={{ marginTop: 24, textAlign: "center", opacity: 0.8 }}>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </footer>
    </div>
  );
}
