// src/pages/LoginPage.tsx
import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  signInWithEmailAndPassword, sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase";
import { useToast } from "../components/Toast";

export default function LoginPage() {
  const nav  = useNavigate();
  const loc  = useLocation();
  const { showToast } = useToast();
  const from = (loc.state as any)?.from?.pathname ?? "/";

  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [resetSent, setResetSent] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password) { setError("Please fill in all fields."); return; }
    setLoading(true); setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      nav(from, { replace: true });
    } catch (err: any) {
      const msg = err.code === "auth/invalid-credential" || err.code === "auth/wrong-password"
        ? "Invalid email or password."
        : err.code === "auth/user-not-found"
        ? "No account found with this email."
        : err.code === "auth/too-many-requests"
        ? "Too many attempts. Please try again later."
        : "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) { setError("Enter your email above to reset your password."); return; }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
      showToast("Password reset email sent!", "success");
    } catch {
      setError("Could not send reset email. Check the address.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-icon">A</div>
          <span className="auth-logo-text">AutoSchedule<span style={{ color: "var(--accent-light)" }}>DSA</span></span>
        </div>

        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-sub">Sign in to your project workspace.</p>

        {error && <div className="alert alert-error">{error}</div>}
        {resetSent && <div className="alert alert-success">Check your inbox for a reset link.</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email" type="email" className="input"
              placeholder="you@example.com"
              value={email} onChange={e => setEmail(e.target.value)}
              autoComplete="email" required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password" type="password" className="input"
              placeholder="••••••••"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="current-password" required
            />
          </div>

          <div style={{ textAlign: "right", marginBottom: 20, marginTop: -8 }}>
            <button
              type="button" className="btn-ghost" onClick={handleForgotPassword}
              disabled={loading}
              style={{ fontSize: 13, color: "var(--accent-light)", padding: "4px 0" }}
            >
              Forgot password?
            </button>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? <><span className="spinner" /> Signing in…</> : "Sign in"}
          </button>
        </form>

        <p className="auth-footer">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>
      </div>
    </div>
  );
}
