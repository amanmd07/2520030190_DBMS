// src/pages/SchedulePage.tsx
// Global schedule page: pick a project and generate/view its schedule.

import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../hooks/useProjects";
import { useTasks }    from "../hooks/useTasks";
import { useDependencies } from "../hooks/useDependencies";
import { computeSchedule } from "../dsa/scheduler";
import Layout from "../components/Layout";

export default function SchedulePage() {
  const nav = useNavigate();
  const { projects, loading: projLoading } = useProjects();
  const [selectedId, setSelectedId] = useState<string>("");
  const [ran, setRan]               = useState(false);
  const [running, setRunning]       = useState(false);

  const { tasks }        = useTasks(selectedId || undefined);
  const { dependencies } = useDependencies(selectedId || undefined);

  const result = useMemo(() => {
    if (!ran || !selectedId) return null;
    return computeSchedule(tasks, dependencies);
  }, [ran, tasks, dependencies, selectedId]);

  function handleGenerate() {
    if (!selectedId) return;
    setRunning(true);
    setRan(false);
    setTimeout(() => { setRan(true); setRunning(false); }, 700);
  }

  const selectedProject = projects.find(p => p.id === selectedId);

  return (
    <Layout>
      <div className="page">
        <div className="page-header">
          <h1>⧗ Schedule</h1>
        </div>

        {/* Project selector */}
        <div className="card" style={{ padding: 20, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, marginBottom: 12 }}>Select a project to schedule</div>
          {projLoading ? (
            <div className="spinner" />
          ) : projects.length === 0 ? (
            <div>
              <p style={{ color: "var(--muted)", marginBottom: 12 }}>No projects yet.</p>
              <button className="btn btn-primary" onClick={() => nav("/projects")}>Create Project</button>
            </div>
          ) : (
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
              <select className="select" style={{ flex: 1, minWidth: 200 }}
                value={selectedId} onChange={e => { setSelectedId(e.target.value); setRan(false); }}>
                <option value="">Choose a project…</option>
                {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
              <button
                className="btn btn-primary"
                onClick={handleGenerate}
                disabled={!selectedId || running}
              >
                {running ? <><span className="spinner" /> Calculating…</> : "⚡ Generate Schedule"}
              </button>
              {selectedId && (
                <button className="btn btn-secondary btn-sm"
                  onClick={() => nav(`/projects/${selectedId}`)}>
                  Open Project →
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results */}
        {result?.error && (
          <div className="alert alert-error">⚠ {result.error}</div>
        )}

        {result && !result.error && (
          <>
            <div className="stat-row" style={{ marginBottom: 20 }}>
              <div className="stat-chip">
                <div className="stat-val">{result.duration}</div>
                <div className="stat-label">TOTAL DAYS</div>
              </div>
              <div className="stat-chip">
                <div className="stat-val" style={{ color: "var(--red)" }}>
                  {result.criticalPath.length}
                </div>
                <div className="stat-label">CRITICAL</div>
              </div>
              <div className="stat-chip">
                <div className="stat-val">{result.order.length}</div>
                <div className="stat-label">TASKS</div>
              </div>
            </div>

            <div className="section-header">
              <h2 className="section-title">
                Gantt Chart — {selectedProject?.name}
              </h2>
              <span style={{ fontSize: 12, color: "var(--red)", fontWeight: 600 }}>
                🔴 Critical
              </span>
            </div>

            <div className="card" style={{ padding: 20, overflowX: "auto" }}>
              {result.order.map(task => {
                const pct = result.duration > 0 ? (task.duration / result.duration) * 100 : 100;
                const off = result.duration > 0 ? (task.earliestStart! / result.duration) * 100 : 0;
                return (
                  <div key={task.id} className="gantt-row">
                    <div className="gantt-label" title={task.name}>{task.name}</div>
                    <div className="gantt-track">
                      <div
                        className={`gantt-bar ${task.isCritical ? "critical" : "normal"}`}
                        style={{ left: `${off}%`, width: `${Math.max(pct, 4)}%` }}
                      >
                        {task.duration}d
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: "var(--muted)", width: 60, textAlign: "right", flexShrink: 0 }}>
                      {task.isCritical ? "🔴" : ""} Day {task.earliestStart! + 1}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="divider" />
            <div style={{ textAlign: "center" }}>
              <button className="btn btn-secondary"
                onClick={() => nav(`/projects/${selectedId}?tab=critical`)}>
                View Critical Path Details →
              </button>
            </div>
          </>
        )}

        {!result && !running && !projLoading && projects.length > 0 && (
          <div className="empty-state">
            <div className="empty-icon">⧗</div>
            <h3>Ready to schedule</h3>
            <p>Select a project above and click "Generate Schedule" to compute the optimal task order using Critical Path Method.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
