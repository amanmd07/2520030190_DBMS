// src/components/ProjectCard.tsx
// Reusable project card used on Home, Projects, and Explore pages.

import React from "react";
import { useNavigate } from "react-router-dom";
import type { Project } from "../types";

function statusBadgeClass(status: Project["status"]) {
  switch (status) {
    case "Planning":    return "badge badge-planning";
    case "In Progress": return "badge badge-progress";
    case "Completed":   return "badge badge-completed";
    case "On Hold":     return "badge badge-hold";
  }
}

function categoryColor(cat: Project["category"]) {
  const map: Record<string, string> = {
    "Software":        "#7c3aed",
    "Web Development": "#06b6d4",
    "Mobile App":      "#84cc16",
    "AI / ML":         "#ec4899",
    "Data Science":    "#f97316",
    "Academic":        "#facc15",
    "Other":           "#8585a0",
  };
  return map[cat] ?? "#8585a0";
}

function progressFromStatus(status: Project["status"]): number {
  switch (status) {
    case "Planning":    return 15;
    case "In Progress": return 55;
    case "Completed":   return 100;
    case "On Hold":     return 30;
  }
}

interface Props {
  project: Project;
}

export default function ProjectCard({ project }: Props) {
  const nav = useNavigate();
  const progress = progressFromStatus(project.status);
  const color = categoryColor(project.category);

  return (
    <div
      className="card card-clickable project-card"
      onClick={() => nav(`/projects/${project.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={e => e.key === "Enter" && nav(`/projects/${project.id}`)}
      aria-label={`Open project ${project.name}`}
    >
      <div className="project-card-header">
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Category indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
            <div style={{
              width: 8, height: 8, borderRadius: "50%", background: color, flexShrink: 0,
            }} />
            <span style={{ fontSize: 10, fontWeight: 700, color, letterSpacing: "0.8px", textTransform: "uppercase" }}>
              {project.category}
            </span>
          </div>
          <div className="project-card-title">{project.name}</div>
          {project.description && (
            <div className="project-card-desc">{project.description}</div>
          )}
        </div>
        <span className={statusBadgeClass(project.status)}>{project.status}</span>
      </div>

      {/* Progress bar */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11,
          color: "var(--muted)", marginBottom: 4 }}>
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="project-card-meta">
        <span>
          <span>📋</span>
          {project.taskCount ?? 0} tasks
        </span>
        <span>
          <span>🕐</span>
          {new Date(project.updatedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
        </span>
      </div>
    </div>
  );
}
