// src/pages/ProjectDetailPage.tsx
// Full project details: Overview, Tasks, Dependencies, Schedule, Critical Path tabs.

import React, { useState, useMemo, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  doc, getDoc, updateDoc, deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useProjects } from "../hooks/useProjects";
import { useTasks, type TaskInput }   from "../hooks/useTasks";
import { useDependencies }            from "../hooks/useDependencies";
import { computeSchedule, validateDependency } from "../dsa/scheduler";
import Layout from "../components/Layout";
import { useToast } from "../components/Toast";
import type {
  Project, Task, Dependency,
  ProjectCategory, ProjectStatus,
  TaskStatus, TaskPriority,
} from "../types";

/* ═══════════ Shared helpers ══════════════════════════════════════ */

function statusBadge(s: TaskStatus) {
  const cls = s === "Completed" ? "badge-completed" : s === "In Progress" ? "badge-progress" : "badge-pending";
  return <span className={`badge ${cls}`}>{s}</span>;
}

function priorityBadge(p: TaskPriority) {
  const cls = p === "Critical" ? "badge-critical" : p === "High" ? "badge-pending" : "badge-planning";
  return <span className={`badge ${cls}`}>{p}</span>;
}

const CATEGORIES: ProjectCategory[] = ["Software","Web Development","Mobile App","AI / ML","Data Science","Academic","Other"];
const STATUSES: ProjectStatus[]     = ["Planning","In Progress","Completed","On Hold"];
const TASK_STATUSES: TaskStatus[]   = ["Pending","In Progress","Completed"];
const TASK_PRIORITIES: TaskPriority[] = ["Low","Medium","High","Critical"];

/* ═══════════ Task Modal ══════════════════════════════════════════ */

function TaskModal({
  task,
  projectId,
  onClose,
  onCreate,
  onUpdate,
}: {
  task?: Task;
  projectId: string;
  onClose: () => void;
  onCreate: (input: TaskInput) => Promise<string>;
  onUpdate: (id: string, input: Partial<TaskInput>) => Promise<void>;
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState<TaskInput>({
    name:        task?.name        ?? "",
    description: task?.description ?? "",
    duration:    task?.duration    ?? 1,
    priority:    task?.priority    ?? "Medium",
    status:      task?.status      ?? "Pending",
  });
  const [errors, setErrors] = useState<Partial<Record<keyof TaskInput, string>>>({});
  const [saving, setSaving] = useState(false);

  function validate() {
    const e: typeof errors = {};
    if (!form.name.trim())    e.name     = "Task name is required.";
    if (form.duration < 1)    e.duration = "Duration must be at least 1 day.";
    if (form.duration > 3650) e.duration = "Duration cannot exceed 10 years.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      if (task) {
        await onUpdate(task.id, form);
        showToast("Task updated!", "success");
      } else {
        await onCreate(form);
        showToast("Task created!", "success");
      }
      onClose();
    } catch (err: any) {
      showToast(err.message ?? "Failed to save task", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal aria-labelledby="task-modal-title">
        <div className="modal-header">
          <h2 className="modal-title" id="task-modal-title">{task ? "Edit Task" : "New Task"}</h2>
          <button className="btn-ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="t-name">Task name *</label>
              <input id="t-name" className={`input ${errors.name ? "input-error" : ""}`}
                placeholder="e.g. Design database schema"
                value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                autoFocus required />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="t-desc">Description</label>
              <textarea id="t-desc" className="textarea" placeholder="Optional details…"
                value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label" htmlFor="t-dur">Duration (days) *</label>
                <input id="t-dur" type="number" min={1} max={3650} className={`input ${errors.duration ? "input-error" : ""}`}
                  value={form.duration} onChange={e => setForm(f => ({ ...f, duration: +e.target.value }))} />
                {errors.duration && <div className="form-error">{errors.duration}</div>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="t-prio">Priority</label>
                <select id="t-prio" className="select" value={form.priority}
                  onChange={e => setForm(f => ({ ...f, priority: e.target.value as TaskPriority }))}>
                  {TASK_PRIORITIES.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="t-status">Status</label>
              <select id="t-status" className="select" value={form.status}
                onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}>
                {TASK_STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><span className="spinner" /> Saving…</> : task ? "Update Task" : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ Edit Project Modal ══════════════════════════════════ */

function EditProjectModal({ project, onClose, onUpdate }: {
  project: Project;
  onClose: () => void;
  onUpdate: (id: string, data: any) => Promise<void>;
}) {
  const { showToast } = useToast();
  const [form, setForm] = useState({
    name: project.name, description: project.description,
    category: project.category, status: project.status,
  });
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name.trim()) return;
    setSaving(true);
    try {
      await onUpdate(project.id, form);
      showToast("Project updated!", "success");
      onClose();
    } catch (err: any) {
      showToast(err.message ?? "Failed to update", "error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Edit Project</h2>
          <button className="btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Name *</label>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="textarea" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div className="form-group">
                <label className="form-label">Category</label>
                <select className="select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value as ProjectCategory }))}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select className="select" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as ProjectStatus }))}>
                  {STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><span className="spinner" /> Saving…</> : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ═══════════ Tab: Overview ═══════════════════════════════════════ */

function OverviewTab({ project, tasks }: { project: Project; tasks: Task[] }) {
  const completed = tasks.filter(t => t.status === "Completed").length;
  const progress  = tasks.length ? Math.round((completed / tasks.length) * 100) : 0;

  return (
    <div>
      <div className="stat-row" style={{ marginBottom: 20 }}>
        <div className="stat-chip">
          <div className="stat-val">{tasks.length}</div>
          <div className="stat-label">TOTAL TASKS</div>
        </div>
        <div className="stat-chip">
          <div className="stat-val">{completed}</div>
          <div className="stat-label">COMPLETED</div>
        </div>
        <div className="stat-chip">
          <div className="stat-val">{tasks.length - completed}</div>
          <div className="stat-label">REMAINING</div>
        </div>
        <div className="stat-chip">
          <div className="stat-val">{progress}%</div>
          <div className="stat-label">PROGRESS</div>
        </div>
      </div>

      {tasks.length > 0 && (
        <div style={{ marginBottom: 20 }}>
          <div className="progress-bar-track" style={{ height: 8 }}>
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div className="card" style={{ padding: 16 }}>
        <div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Description</div>
        <div style={{ fontSize: 15 }}>{project.description || "No description added."}</div>
      </div>
    </div>
  );
}

/* ═══════════ Tab: Tasks ══════════════════════════════════════════ */

function TasksTab({ tasks, loading, onAdd, onEdit, onDelete, onStatusChange }: {
  tasks: Task[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
  onStatusChange: (task: Task, status: TaskStatus) => void;
}) {
  const { showToast } = useToast();

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete task "${name}"?`)) return;
    try {
      await onDelete(id);
      showToast("Task deleted", "success");
    } catch {
      showToast("Failed to delete task", "error");
    }
  }

  if (loading) return <div style={{ padding: 20 }}><div className="spinner" /></div>;

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
        <button className="btn btn-primary btn-sm" onClick={onAdd}>+ Add Task</button>
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state" style={{ padding: "32px 0" }}>
          <div className="empty-icon">📋</div>
          <h3>No tasks yet</h3>
          <p>Add tasks to start building your project schedule.</p>
          <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={onAdd}>+ Add Task</button>
        </div>
      ) : (
        <div className="card">
          {tasks.map(task => (
            <div key={task.id} className="task-row">
              <div className="task-row-info">
                <div className="task-row-title">{task.name}</div>
                <div className="task-row-sub">
                  {task.duration} day{task.duration !== 1 ? "s" : ""} · {task.description || "No description"}
                </div>
                <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                  {statusBadge(task.status)}
                  {priorityBadge(task.priority)}
                </div>
              </div>
              <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
                <select
                  className="select"
                  style={{ width: "auto", padding: "4px 8px", fontSize: 12 }}
                  value={task.status}
                  onChange={e => onStatusChange(task, e.target.value as TaskStatus)}
                  aria-label={`Change status of ${task.name}`}
                >
                  {TASK_STATUSES.map(s => <option key={s}>{s}</option>)}
                </select>
                <button className="btn btn-secondary btn-sm" onClick={() => onEdit(task)} aria-label={`Edit ${task.name}`}>✎</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(task.id, task.name)} aria-label={`Delete ${task.name}`}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════ Tab: Dependencies ═══════════════════════════════════ */

function DepsTab({ tasks, dependencies, loading, onCreate, onDelete }: {
  tasks: Task[];
  dependencies: Dependency[];
  loading: boolean;
  onCreate: (from: string, to: string) => Promise<string>;
  onDelete: (id: string) => Promise<void>;
}) {
  const { showToast } = useToast();
  const [fromId, setFromId] = useState("");
  const [toId,   setToId]   = useState("");
  const [adding, setAdding] = useState(false);

  const taskMap = useMemo(() => new Map(tasks.map(t => [t.id, t.name])), [tasks]);

  async function handleAdd() {
    if (!fromId || !toId) { showToast("Select both tasks", "error"); return; }
    const err = validateDependency(fromId, toId, dependencies);
    if (err) { showToast(err, "error"); return; }
    setAdding(true);
    try {
      await onCreate(fromId, toId);
      showToast("Dependency added", "success");
      setFromId(""); setToId("");
    } catch (e: any) {
      showToast(e.message ?? "Failed", "error");
    } finally {
      setAdding(false);
    }
  }

  async function handleDelete(dep: Dependency) {
    const from = taskMap.get(dep.fromTaskId) ?? dep.fromTaskId;
    const to   = taskMap.get(dep.toTaskId)   ?? dep.toTaskId;
    if (!confirm(`Remove dependency: ${from} → ${to}?`)) return;
    try {
      await onDelete(dep.id);
      showToast("Dependency removed", "success");
    } catch {
      showToast("Failed to remove", "error");
    }
  }

  if (loading) return <div style={{ padding: 20 }}><div className="spinner" /></div>;

  return (
    <div>
      {tasks.length < 2 ? (
        <div className="alert alert-info">Add at least 2 tasks before defining dependencies.</div>
      ) : (
        <div className="card" style={{ padding: 16, marginBottom: 16 }}>
          <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>Add Dependency</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            <select className="select" style={{ width: "auto" }} value={fromId}
              onChange={e => setFromId(e.target.value)}>
              <option value="">Predecessor task…</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <span style={{ color: "var(--muted)", fontWeight: 700 }}>→</span>
            <select className="select" style={{ width: "auto" }} value={toId}
              onChange={e => setToId(e.target.value)}>
              <option value="">Successor task…</option>
              {tasks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </select>
            <button className="btn btn-primary btn-sm" onClick={handleAdd} disabled={adding}>
              {adding ? <span className="spinner" /> : "Add"}
            </button>
          </div>
          <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>
            Circular dependencies and self-dependencies are automatically blocked.
          </div>
        </div>
      )}

      {dependencies.length === 0 ? (
        <div className="empty-state" style={{ padding: "32px 0" }}>
          <div className="empty-icon">🔗</div>
          <h3>No dependencies yet</h3>
          <p>Define task ordering so the scheduler knows which tasks must complete before others start.</p>
        </div>
      ) : (
        <div className="card">
          {dependencies.map(dep => (
            <div key={dep.id} className="task-row">
              <div className="task-row-info">
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{taskMap.get(dep.fromTaskId) ?? "?"}</span>
                  <span style={{ color: "var(--accent-light)", fontWeight: 700 }}>→</span>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{taskMap.get(dep.toTaskId) ?? "?"}</span>
                </div>
              </div>
              <button className="btn btn-danger btn-sm" onClick={() => handleDelete(dep)}
                aria-label="Remove dependency">✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ═══════════ Tab: Schedule (Gantt) ═══════════════════════════════ */

function ScheduleTab({ tasks, dependencies }: { tasks: Task[]; dependencies: Dependency[] }) {
  const [result, setResult] = useState<ReturnType<typeof computeSchedule> | null>(null);
  const [running, setRunning] = useState(false);

  function handleGenerate() {
    setRunning(true);
    setTimeout(() => {
      setResult(computeSchedule(tasks, dependencies));
      setRunning(false);
    }, 600); // Brief delay for UX feedback
  }

  if (tasks.length === 0) {
    return (
      <div className="alert alert-info">Add tasks first, then generate the schedule.</div>
    );
  }

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <div>
          <div style={{ fontWeight: 700 }}>Smart Schedule Generator</div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Uses Topological Sort + Critical Path Method (CPM)
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleGenerate} disabled={running}>
          {running ? <><span className="spinner" /> Calculating…</> : "⚡ Generate Schedule"}
        </button>
      </div>

      {result?.error && <div className="alert alert-error">⚠ {result.error}</div>}

      {result && !result.error && (
        <>
          <div className="stat-row" style={{ marginBottom: 20 }}>
            <div className="stat-chip">
              <div className="stat-val">{result.duration}</div>
              <div className="stat-label">TOTAL DAYS</div>
            </div>
            <div className="stat-chip">
              <div className="stat-val">{result.criticalPath.length}</div>
              <div className="stat-label">CRITICAL</div>
            </div>
            <div className="stat-chip">
              <div className="stat-val">{result.order.length}</div>
              <div className="stat-label">TASKS</div>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            {result.order.map(task => {
              const pct = result.duration > 0 ? (task.duration / result.duration) * 100 : 100;
              const off = result.duration > 0 ? (task.earliestStart! / result.duration) * 100 : 0;
              return (
                <div key={task.id} className="gantt-row">
                  <div className="gantt-label" title={task.name}>{task.name}</div>
                  <div className="gantt-track">
                    <div
                      className={`gantt-bar ${task.isCritical ? "critical" : "normal"}`}
                      style={{ left: `${off}%`, width: `${pct}%` }}
                    >
                      {task.duration}d
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: "var(--muted)", width: 56, textAlign: "right", flexShrink: 0 }}>
                    Day {task.earliestStart! + 1}–{task.earliestFinish!}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

/* ═══════════ Tab: Critical Path ══════════════════════════════════ */

function CriticalPathTab({ tasks, dependencies }: { tasks: Task[]; dependencies: Dependency[] }) {
  const result = useMemo(
    () => tasks.length > 0 ? computeSchedule(tasks, dependencies) : null,
    [tasks, dependencies],
  );

  if (tasks.length === 0) {
    return <div className="alert alert-info">Add tasks to see the critical path.</div>;
  }

  if (result?.error) {
    return <div className="alert alert-error">⚠ {result.error}</div>;
  }

  const criticalTasks = result?.order.filter(t => t.isCritical) ?? [];
  const normalTasks   = result?.order.filter(t => !t.isCritical) ?? [];

  return (
    <div>
      <div className="stat-row" style={{ marginBottom: 24 }}>
        <div className="stat-chip">
          <div className="stat-val" style={{ color: "var(--red)" }}>{result?.duration}</div>
          <div className="stat-label">PROJECT DAYS</div>
        </div>
        <div className="stat-chip">
          <div className="stat-val" style={{ color: "var(--red)" }}>{criticalTasks.length}</div>
          <div className="stat-label">CRITICAL TASKS</div>
        </div>
        <div className="stat-chip">
          <div className="stat-val">{normalTasks.length}</div>
          <div className="stat-label">WITH SLACK</div>
        </div>
      </div>

      {criticalTasks.length > 0 && (
        <>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "var(--red)" }}>
            🔴 Critical Path — any delay extends the project
          </div>
          <div className="cp-chain">
            {criticalTasks.map((task, i) => (
              <React.Fragment key={task.id}>
                <div className="cp-node">
                  <div className="cp-dot" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{task.name}</div>
                    <div style={{ fontSize: 12, color: "var(--muted)" }}>
                      {task.duration} day{task.duration !== 1 ? "s" : ""} · Day {task.earliestStart! + 1}–{task.earliestFinish!} · Slack: 0
                    </div>
                  </div>
                </div>
                {i < criticalTasks.length - 1 && <div className="cp-connector" />}
              </React.Fragment>
            ))}
          </div>
        </>
      )}

      {normalTasks.length > 0 && (
        <>
          <div className="divider" />
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: "var(--muted)" }}>
            ◎ Tasks with Slack (flexible timing)
          </div>
          {normalTasks.map(task => (
            <div key={task.id} className="cp-node">
              <div className="cp-dot normal" />
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{task.name}</div>
                <div style={{ fontSize: 12, color: "var(--muted)" }}>
                  {task.duration}d · Day {task.earliestStart! + 1}–{task.earliestFinish!} · Slack: {task.slack} day{task.slack !== 1 ? "s" : ""}
                </div>
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
}

/* ═══════════ Main Page ═══════════════════════════════════════════ */

type TabKey = "overview" | "tasks" | "dependencies" | "schedule" | "critical";

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const nav = useNavigate();
  const { showToast } = useToast();
  const { projects, updateProject, deleteProject } = useProjects();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask } = useTasks(projectId);
  const { dependencies, loading: depsLoading, createDependency, deleteDependency } = useDependencies(projectId);

  const project = useMemo(
    () => projects.find(p => p.id === projectId) ?? null,
    [projects, projectId],
  );

  const [tab, setTab]           = useState<TabKey>("overview");
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [editingTask,   setEditingTask]   = useState<Task | undefined>();
  const [showEditProject, setShowEditProject] = useState(false);
  const [deleting,  setDeleting]  = useState(false);

  const handleStatusChange = useCallback(async (task: Task, status: TaskStatus) => {
    try {
      await updateTask(task.id, { status });
    } catch {
      showToast("Failed to update status", "error");
    }
  }, [updateTask, showToast]);

  const handleDeleteTask = useCallback(async (id: string) => {
    await deleteTask(id);
    // Also remove associated dependencies
    const toRemove = dependencies.filter(d => d.fromTaskId === id || d.toTaskId === id);
    await Promise.all(toRemove.map(d => deleteDependency(d.id)));
  }, [deleteTask, dependencies, deleteDependency]);

  async function handleDeleteProject() {
    if (!project) return;
    if (!confirm(`Delete project "${project.name}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteProject(project.id);
      showToast("Project deleted", "success");
      nav("/projects");
    } catch (err: any) {
      showToast(err.message ?? "Failed to delete", "error");
      setDeleting(false);
    }
  }

  // Loading while projects list hasn't arrived yet
  if (projects.length === 0 && !project) {
    return (
      <Layout>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "50vh" }}>
          <div className="spinner spinner-lg" />
        </div>
      </Layout>
    );
  }

  if (!project) {
    return (
      <Layout>
        <div className="page">
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <h3>Project not found</h3>
            <p>This project may have been deleted or you don't have access.</p>
            <button className="btn btn-primary" style={{ marginTop: 12 }} onClick={() => nav("/projects")}>
              Back to Projects
            </button>
          </div>
        </div>
      </Layout>
    );
  }

  const TABS: { key: TabKey; label: string }[] = [
    { key: "overview",      label: "Overview" },
    { key: "tasks",         label: `Tasks (${tasks.length})` },
    { key: "dependencies",  label: "Dependencies" },
    { key: "schedule",      label: "Schedule" },
    { key: "critical",      label: "Critical Path" },
  ];

  return (
    <Layout>
      <div className="page">
        {/* Back button */}
        <button className="btn btn-ghost" style={{ marginBottom: 12, padding: "6px 0" }}
          onClick={() => nav("/projects")}>
          ← Back to Projects
        </button>

        {/* Header */}
        <div className="page-header">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--accent-light)",
                letterSpacing: "0.8px", textTransform: "uppercase" }}>
                {project.category}
              </span>
              <span className={`badge ${
                project.status === "Completed" ? "badge-completed"
                : project.status === "In Progress" ? "badge-progress"
                : project.status === "On Hold" ? "badge-hold"
                : "badge-planning"
              }`}>{project.status}</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>{project.name}</h1>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowEditProject(true)}>
              ✎ Edit
            </button>
            <button className="btn btn-danger btn-sm" onClick={handleDeleteProject} disabled={deleting}>
              {deleting ? <span className="spinner" /> : "✕ Delete"}
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="tabs">
          {TABS.map(t => (
            <button key={t.key} className={`tab-btn ${tab === t.key ? "active" : ""}`}
              onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Tab content */}
        {tab === "overview"     && <OverviewTab project={project} tasks={tasks} />}
        {tab === "tasks"        && (
          <TasksTab
            tasks={tasks} loading={tasksLoading}
            onAdd={() => { setEditingTask(undefined); setShowTaskModal(true); }}
            onEdit={task => { setEditingTask(task); setShowTaskModal(true); }}
            onDelete={handleDeleteTask}
            onStatusChange={handleStatusChange}
          />
        )}
        {tab === "dependencies" && (
          <DepsTab
            tasks={tasks} dependencies={dependencies}
            loading={depsLoading || tasksLoading}
            onCreate={createDependency} onDelete={deleteDependency}
          />
        )}
        {tab === "schedule"     && <ScheduleTab tasks={tasks} dependencies={dependencies} />}
        {tab === "critical"     && <CriticalPathTab tasks={tasks} dependencies={dependencies} />}
      </div>

      {/* Modals */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          projectId={projectId!}
          onClose={() => setShowTaskModal(false)}
          onCreate={createTask}
          onUpdate={updateTask}
        />
      )}
      {showEditProject && (
        <EditProjectModal
          project={project}
          onClose={() => setShowEditProject(false)}
          onUpdate={updateProject}
        />
      )}
    </Layout>
  );
}
