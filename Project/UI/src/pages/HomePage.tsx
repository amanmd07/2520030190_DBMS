// src/pages/HomePage.tsx
// Dashboard: workspace header, search, featured project, category filter,
// recommended projects — all connected to live Firestore data.

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useProjects } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import Layout from "../components/Layout";
import type { ProjectCategory } from "../types";

const ALL_CATEGORIES: ProjectCategory[] = [
  "Software", "Web Development", "Mobile App", "AI / ML",
  "Data Science", "Academic", "Other",
];

function SkeletonCard() {
  return (
    <div className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="skeleton" style={{ height: 12, width: "60%" }} />
      <div className="skeleton" style={{ height: 18, width: "80%" }} />
      <div className="skeleton" style={{ height: 10, width: "40%" }} />
      <div className="skeleton" style={{ height: 6, borderRadius: 99 }} />
    </div>
  );
}

export default function HomePage() {
  const nav  = useNavigate();
  const { user } = useAuth();
  const { projects, loading } = useProjects();

  const [search,      setSearch]      = useState("");
  const [activeCategory, setActiveCategory] = useState<ProjectCategory | "All">("All");

  const displayName = user?.displayName?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  // Search filter across name, description
  const searchResults = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.toLowerCase();
    return projects.filter(p =>
      p.name.toLowerCase().includes(q) ||
      p.description?.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q),
    );
  }, [projects, search]);

  const showSearch = search.trim().length > 0;

  // Featured = most recently updated project
  const featured = useMemo(() => {
    if (projects.length === 0) return null;
    return [...projects].sort((a, b) => b.updatedAt - a.updatedAt)[0];
  }, [projects]);

  // Recommended = filter by category (or all), up to 6
  const recommended = useMemo(() => {
    const filtered = activeCategory === "All"
      ? projects
      : projects.filter(p => p.category === activeCategory);
    // Exclude featured from recommended list
    return filtered.filter(p => p.id !== featured?.id).slice(0, 6);
  }, [projects, activeCategory, featured]);

  return (
    <Layout>
      <div className="page">
        {/* ── Workspace header ───────────────── */}
        <div className="workspace-header" style={{ marginBottom: 20, padding: 0 }}>
          <div>
            <div className="workspace-label">YOUR WORKSPACE</div>
            <div className="workspace-name">Hi, {displayName} 👋</div>
          </div>
          <div
            className="avatar"
            style={{ cursor: "pointer" }}
            onClick={() => nav("/profile")}
            title="Profile"
          >
            {(user?.displayName?.[0] || user?.email?.[0] || "?").toUpperCase()}
          </div>
        </div>

        {/* ── Search ─────────────────────────── */}
        <div className="search-bar" style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 18, color: "var(--muted)" }}>🔍</span>
          <input
            type="search"
            placeholder="Search projects, tasks or plans…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search projects"
          />
          {search && (
            <button className="btn-ghost btn-sm" onClick={() => setSearch("")}
              style={{ padding: "2px 6px" }}>✕</button>
          )}
        </div>

        {/* ── Search Results ──────────────────── */}
        {showSearch && (
          <div style={{ marginBottom: 24 }}>
            <div className="section-header">
              <h2 className="section-title">Results for "{search}"</h2>
              <span style={{ fontSize: 13, color: "var(--muted)" }}>{searchResults.length} found</span>
            </div>
            {searchResults.length === 0 ? (
              <div className="empty-state" style={{ padding: "32px 16px" }}>
                <div className="empty-icon">🔎</div>
                <h3>No projects found</h3>
                <p>Try a different keyword or create a new project.</p>
              </div>
            ) : (
              <div className="grid-2">
                {searchResults.map(p => <ProjectCard key={p.id} project={p} />)}
              </div>
            )}
          </div>
        )}

        {!showSearch && (
          <>
            {/* ── Featured Project ─────────────── */}
            <div style={{ marginBottom: 28 }}>
              <div className="section-header">
                <h2 className="section-title">Featured Project</h2>
                <button
                  className="btn-ghost"
                  style={{ fontSize: 13, color: "var(--accent-light)" }}
                  onClick={() => nav("/projects")}
                >
                  See all →
                </button>
              </div>

              {loading ? (
                <div className="skeleton" style={{ height: 140, borderRadius: "var(--radius-lg)" }} />
              ) : featured ? (
                <div
                  className="hero-card"
                  onClick={() => nav(`/projects/${featured.id}`)}
                  role="button" tabIndex={0}
                  onKeyDown={e => e.key === "Enter" && nav(`/projects/${featured.id}`)}
                  aria-label={`Open project ${featured.name}`}
                >
                  <div className="hero-badge">✦ {featured.category}</div>
                  <div className="hero-title">{featured.name}</div>
                  <div className="hero-sub">{featured.description || "Click to open project details"}</div>
                  <div className="hero-meta">
                    <span>📋 {featured.taskCount ?? 0} tasks</span>
                    <span>⚡ {featured.status}</span>
                    <span>🕐 Updated {new Date(featured.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</span>
                  </div>
                  <div className="hero-arrow">›</div>
                </div>
              ) : (
                <div className="card" style={{ padding: 28, textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 10 }}>🚀</div>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>No projects yet</div>
                  <div style={{ fontSize: 14, color: "var(--muted)", marginBottom: 16 }}>
                    Create your first project to start planning.
                  </div>
                  <button className="btn btn-primary" onClick={() => nav("/projects")}>
                    + Create Project
                  </button>
                </div>
              )}
            </div>

            {/* ── Browse Categories ─────────────── */}
            <div style={{ marginBottom: 28 }}>
              <div className="section-header">
                <h2 className="section-title">Browse Categories</h2>
              </div>
              <div className="chips">
                <button
                  className={`chip ${activeCategory === "All" ? "active" : ""}`}
                  onClick={() => setActiveCategory("All")}
                >
                  All
                </button>
                {ALL_CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    className={`chip ${activeCategory === cat ? "active" : ""}`}
                    onClick={() => setActiveCategory(cat)}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Recommended Projects ─────────── */}
            <div>
              <div className="section-header">
                <h2 className="section-title">
                  {activeCategory === "All" ? "Recommended Projects" : activeCategory}
                </h2>
                <button
                  className="btn-ghost"
                  style={{ fontSize: 13, color: "var(--accent-light)" }}
                  onClick={() => nav("/projects")}
                >
                  View all →
                </button>
              </div>

              {loading ? (
                <div className="grid-2">
                  {[0, 1, 2].map(i => <SkeletonCard key={i} />)}
                </div>
              ) : recommended.length === 0 ? (
                <div className="empty-state" style={{ padding: "32px 16px" }}>
                  <div className="empty-icon">
                    {activeCategory === "All" ? "📂" : "🔍"}
                  </div>
                  <h3>
                    {activeCategory === "All"
                      ? "No projects yet"
                      : `No ${activeCategory} projects`}
                  </h3>
                  <p>
                    {activeCategory === "All"
                      ? "Create your first project to start planning."
                      : `You have no projects in the "${activeCategory}" category yet.`}
                  </p>
                  <button className="btn btn-primary" style={{ marginTop: 12 }}
                    onClick={() => nav("/projects")}>
                    + Create Project
                  </button>
                </div>
              ) : (
                <div className="grid-2">
                  {recommended.map(p => <ProjectCard key={p.id} project={p} />)}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
