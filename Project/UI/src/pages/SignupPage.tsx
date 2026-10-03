// src/pages/SignupPage.tsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebase";
import { useToast } from "../components/Toast";

export default function SignupPage() {
  const nav = useNavigate();
  const { showToast } = useToast();

  const [name,     setName]     = useState("");
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("");
  const [confirm,  setConfirm]  = useState("");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) { setError("Please enter your name."); return; }
    if (!email)        { setError("Please enter your email."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }

    setLoading(true);
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name.trim() });
      showToast("Account created! Welcome 🎉", "success");
      nav("/", { replace: true });
    } catch (err: any) {
      const msg = err.code === "auth/email-already-in-use"
        ? "An account with this email already exists."
        : err.code === "auth/weak-password"
        ? "Password is too weak. Use at least 6 characters."
        : "Signup failed. Please try again.";
      setError(msg);
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

        <h1 className="auth-title">Create your account</h1>
        <p className="auth-sub">Start planning smarter projects today.</p>

        {error && <div className="alert alert-error">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <label className="form-label" htmlFor="name">Full name</label>
            <input
              id="name" type="text" className="input"
              placeholder="Arjun Mehta"
              value={name} onChange={e => setName(e.target.value)}
              autoComplete="name" required
            />
          </div>
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
              placeholder="At least 6 characters"
              value={password} onChange={e => setPassword(e.target.value)}
              autoComplete="new-password" required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="confirm">Confirm password</label>
            <input
              id="confirm" type="password" className="input"
              placeholder="Repeat password"
              value={confirm} onChange={e => setConfirm(e.target.value)}
              autoComplete="new-password" required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}
            style={{ marginTop: 4 }}>
            {loading ? <><span className="spinner" /> Creating account…</> : "Create account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
