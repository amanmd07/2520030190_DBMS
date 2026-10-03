// src/components/Layout.tsx
// App shell: side-nav (desktop) + bottom-nav (mobile) + page wrapper.

import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV = [
  { label: "Home",     path: "/",         icon: "⊞" },
  { label: "Projects", path: "/projects", icon: "◫" },
  { label: "Schedule", path: "/schedule", icon: "⧗" },
  { label: "Profile",  path: "/profile",  icon: "◎" },
];

function NavIcon({ icon, active }: { icon: string; active: boolean }) {
  return (
    <span style={{
      fontSize: 20, lineHeight: 1,
      filter: active ? "none" : "opacity(0.55)",
    }}>{icon}</span>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const nav  = useNavigate();
  const loc  = useLocation();
  const { user } = useAuth();

  const initials = user?.displayName
    ? user.displayName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()
    : user?.email?.[0].toUpperCase() ?? "?";

  function isActive(path: string) {
    if (path === "/") return loc.pathname === "/";
    return loc.pathname.startsWith(path);
  }

  return (
    <div className="app-shell">
      {/* ── Side nav (desktop) ───────────────── */}
      <nav className="side-nav" aria-label="Main navigation">
        <div className="brand">
          <div className="brand-icon">A</div>
          <div className="brand-name">
            AutoSchedule<span>DSA Project Planner</span>
          </div>
        </div>

        {NAV.map(item => (
          <button
            key={item.path}
            className={`nav-item ${isActive(item.path) ? "active" : ""}`}
            onClick={() => nav(item.path)}
            aria-current={isActive(item.path) ? "page" : undefined}
          >
            <NavIcon icon={item.icon} active={isActive(item.path)} />
            {item.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* User area */}
        <div style={{ padding: "12px", borderTop: "1px solid var(--border)" }}>
          <button
            className="nav-item"
            onClick={() => nav("/profile")}
            style={{ width: "100%" }}
          >
            <div className="avatar" style={{ width: 28, height: 28, fontSize: 11 }}>
              {initials}
            </div>
            <div style={{ overflow: "hidden" }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
                overflow: "hidden", textOverflow: "ellipsis" }}>
                {user?.displayName || user?.email?.split("@")[0] || "Profile"}
              </div>
            </div>
          </button>
        </div>
      </nav>

      {/* ── Main content ─────────────────────── */}
      <main className="main-content">
        {children}
      </main>

      {/* ── Bottom nav (mobile) ──────────────── */}
      <nav className="bottom-nav" aria-label="Main navigation">
        {NAV.map(item => (
          <button
            key={item.path}
            className={isActive(item.path) ? "active" : ""}
            onClick={() => nav(item.path)}
            aria-label={item.label}
            aria-current={isActive(item.path) ? "page" : undefined}
          >
            <NavIcon icon={item.icon} active={isActive(item.path)} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
