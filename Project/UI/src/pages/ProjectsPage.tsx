// src/pages/ProjectsPage.tsx
// Full project list with create modal, filters, and real-time updates.

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects, type ProjectInput } from "../hooks/useProjects";
import ProjectCard from "../components/ProjectCard";
import Layout from "../components/Layout";
import { useToast } from "../components/Toast";
import type { ProjectCategory, ProjectStatus } from "../types";

const CATEGORIES: ProjectCategory[] = [
  "Software", "Web Development", "Mobile App", "AI / ML",
  "Data Science", "Academic", "Other",
];
const STATUSES: ProjectStatus[] = ["Planning", "In Progress", "Completed", "On Hold"];

function CreateProjectModal({ onClose }: { onClose: () => void }) {
  const { createProject } = useProjects();
  const { showToast } = useToast();
  const nav = useNavigate();

  const [form, setForm] = useState<ProjectInput>({
    name: "", description: "", category: "Software", status: "Planning",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectInput, string>>>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!form.name.trim())        e.name = "Project name is required.";
    if (form.name.trim().length > 100) e.name = "Name must be under 100 characters.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const id = await createProject(form);
      showToast("Project created!", "success");
      onClose();
      nav(`/projects/${id}`);
    } catch (err: any) {
      showToast(err.message ?? "Failed to create project", "error");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="modal-title">New Project</h2>
          <button className="btn-ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="proj-name">Project name *</label>
              <input
                id="proj-name" className={`input ${errors.name ? "input-error" : ""}`}
                placeholder="e.g. Mobile Banking App"
                value={form.name}
                onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                autoFocus required
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-desc">Description</label>
              <textarea
                id="proj-desc" className="textarea"
                placeholder="What is this project about?"
                value={form.description}
                onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-cat">Category</label>
              <select
                id="proj-cat" className="select"
                value={form.category}
                onChange={e => setForm(f => ({ ...f, category: e.target.value as ProjectCategory }))}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-status">Initial status</label>
              <select
                id="proj-status" className="select"
                value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}
              >
                {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? <><span className="spinner" /> Creating…</> : "Create Project"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { projects, loading } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
  const [search,     setSearch]     = useState("");
  const [filterStatus, setFilterStatus] = useState<ProjectStatus | "All">("All");
  const [filterCategory, setFilterCategory] = useState<ProjectCategory | "All">("All");
  const [sortBy, setSortBy] = useState<"updated" | "name" | "status">("updated");

  const filtered = useMemo(() => {
    let list = [...projects];

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q),
      );
    }
    if (filterStatus !== "All") list = list.filter(p => p.status === filterStatus);
    if (filterCategory !== "All") list = list.filter(p => p.category === filterCategory);

    list.sort((a, b) => {
      if (sortBy === "name")    return a.name.localeCompare(b.name);
      if (sortBy === "status")  return a.status.localeCompare(b.status);
      return b.updatedAt - a.updatedAt; // "updated"
    });

    return list;
  }, [projects, search, filterStatus, filterCategory, sortBy]);

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>Projects</h1>
          <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
            + New Project
          </button>
        </div>

        {/* Search */}
        <div className="search-bar" style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 18, color: "var(--muted)" }}>🔍</span>
          <input
            type="search"
            placeholder="Search projects…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search projects"
          />
          {search && (
            <button className="btn-ghost btn-sm" onClick={() => setSearch("")}
              style={{ padding: "2px 6px" }}>✕</button>
          )}
        </div>

        {/* Filters row */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 20 }}>
          <select className="select" style={{ width: "auto" }}
            value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}>
            <option value="All">All statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select className="select" style={{ width: "auto" }}
            value={filterCategory} onChange={e => setFilterCategory(e.target.value as any)}>
            <option value="All">All categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className="select" style={{ width: "auto" }}
            value={sortBy} onChange={e => setSortBy(e.target.value as any)}>
            <option value="updated">Recently updated</option>
            <option value="name">Name A–Z</option>
            <option value="status">Status</option>
          </select>
        </div>

        {/* Project grid */}
        {loading ? (
          <div className="grid-2">
            {[0,1,2,3].map(i => (
              <div key={i} className="card" style={{ padding: 18, display: "flex", flexDirection: "column", gap: 12 }}>
                <div className="skeleton" style={{ height: 12, width: "60%" }} />
                <div className="skeleton" style={{ height: 18, width: "80%" }} />
                <div className="skeleton" style={{ height: 6, borderRadius: 99 }} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">{projects.length === 0 ? "🚀" : "🔍"}</div>
            <h3>{projects.length === 0 ? "No projects yet" : "No matching projects"}</h3>
            <p>
              {projects.length === 0
                ? "Create your first project to start planning your tasks and schedule."
                : "Try adjusting your search or filters."}
            </p>
            {projects.length === 0 && (
              <button className="btn btn-primary" style={{ marginTop: 12 }}
                onClick={() => setShowCreate(true)}>
                + Create Project
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ fontSize: 12, color: "var(--muted)", marginBottom: 10 }}>
              {filtered.length} project{filtered.length !== 1 ? "s" : ""}
            </div>
            <div className="grid-2">
              {filtered.map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          </>
        )}

        {showCreate && <CreateProjectModal onClose={() => setShowCreate(false)} />}
      </div>
    </Layout>
  );
}
