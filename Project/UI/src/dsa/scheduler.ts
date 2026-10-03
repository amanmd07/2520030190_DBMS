// src/dsa/scheduler.ts
// Core DSA algorithms: Topological Sort, Critical Path Method (CPM),
// Cycle Detection using Kahn's Algorithm (BFS).

import type { Task, Dependency, ScheduleResult } from "../types";

/**
 * Detect if the dependency graph has a cycle.
 * Uses DFS with colouring (WHITE/GRAY/BLACK).
 */
function hasCycle(
  taskIds: string[],
  adj: Map<string, string[]>
): boolean {
  const colour = new Map<string, "W" | "G" | "B">();
  taskIds.forEach(id => colour.set(id, "W"));

  function dfs(u: string): boolean {
    colour.set(u, "G");
    for (const v of adj.get(u) ?? []) {
      if (colour.get(v) === "G") return true;
      if (colour.get(v) === "W" && dfs(v)) return true;
    }
    colour.set(u, "B");
    return false;
  }

  for (const id of taskIds) {
    if (colour.get(id) === "W" && dfs(id)) return true;
  }
  return false;
}

/**
 * Full Critical Path Method scheduler.
 *
 * 1. Kahn's BFS topological sort (detects cycles).
 * 2. Forward pass  → Earliest Start / Finish.
 * 3. Backward pass → Latest Start / Finish / Slack.
 * 4. Critical path  = tasks with Slack == 0.
 *
 * @returns ScheduleResult with ordered tasks and critical path task IDs.
 */
export function computeSchedule(
  tasks: Task[],
  dependencies: Dependency[]
): ScheduleResult {
  if (tasks.length === 0) {
    return { order: [], criticalPath: [], duration: 0 };
  }

  const taskMap = new Map<string, Task>(tasks.map(t => [t.id, t]));

  // Build adjacency list: predecessor → successors
  const adj   = new Map<string, string[]>(); // id → [successorIds]
  const inDeg = new Map<string, number>();   // id → in-degree
  tasks.forEach(t => { adj.set(t.id, []); inDeg.set(t.id, 0); });

  for (const dep of dependencies) {
    if (!taskMap.has(dep.fromTaskId) || !taskMap.has(dep.toTaskId)) continue;
    adj.get(dep.fromTaskId)!.push(dep.toTaskId);
    inDeg.set(dep.toTaskId, (inDeg.get(dep.toTaskId) ?? 0) + 1);
  }

  // Cycle detection (quick pre-check)
  if (hasCycle(tasks.map(t => t.id), adj)) {
    return {
      order: [],
      criticalPath: [],
      duration: 0,
      error: "Cycle detected — please remove circular dependencies before scheduling.",
    };
  }

  // Kahn's BFS topological sort
  const queue: string[] = [];
  inDeg.forEach((deg, id) => { if (deg === 0) queue.push(id); });

  const topoOrder: string[] = [];
  const es  = new Map<string, number>(); // Earliest Start
  const ef  = new Map<string, number>(); // Earliest Finish

  tasks.forEach(t => { es.set(t.id, 0); ef.set(t.id, t.duration); });

  while (queue.length) {
    const u = queue.shift()!;
    topoOrder.push(u);

    for (const v of adj.get(u) ?? []) {
      // Forward pass: ES(v) = max(ES(v), EF(u))
      const newEs = ef.get(u)!;
      if (newEs > (es.get(v) ?? 0)) {
        es.set(v, newEs);
        ef.set(v, newEs + taskMap.get(v)!.duration);
      }
      const newDeg = (inDeg.get(v) ?? 1) - 1;
      inDeg.set(v, newDeg);
      if (newDeg === 0) queue.push(v);
    }
  }

  if (topoOrder.length !== tasks.length) {
    return {
      order: [],
      criticalPath: [],
      duration: 0,
      error: "Cycle detected — please remove circular dependencies before scheduling.",
    };
  }

  // Project duration = max EF across all tasks
  let projectDuration = 0;
  ef.forEach(v => { if (v > projectDuration) projectDuration = v; });

  // Backward pass
  const ls = new Map<string, number>(); // Latest Start
  const lf = new Map<string, number>(); // Latest Finish

  topoOrder.forEach(id => {
    ls.set(id, projectDuration);
    lf.set(id, projectDuration);
  });

  // Build reverse adjacency for backward pass
  const radj = new Map<string, string[]>();
  tasks.forEach(t => radj.set(t.id, []));
  for (const dep of dependencies) {
    if (!taskMap.has(dep.fromTaskId) || !taskMap.has(dep.toTaskId)) continue;
    radj.get(dep.toTaskId)!.push(dep.fromTaskId);
  }

  // Process in reverse topological order
  for (let i = topoOrder.length - 1; i >= 0; i--) {
    const u = topoOrder[i];
    const task = taskMap.get(u)!;

    // LF(u) = min of LS(v) for all successors v
    for (const v of adj.get(u) ?? []) {
      const successorLS = ls.get(v)!;
      if (successorLS < lf.get(u)!) {
        lf.set(u, successorLS);
      }
    }
    ls.set(u, lf.get(u)! - task.duration);
  }

  // Build result with slack + critical flag
  const criticalPath: string[] = [];
  const orderedTasks: Task[] = topoOrder.map(id => {
    const task = { ...taskMap.get(id)! };
    task.earliestStart  = es.get(id)!;
    task.earliestFinish = ef.get(id)!;
    task.latestStart    = ls.get(id)!;
    task.latestFinish   = lf.get(id)!;
    task.slack          = ls.get(id)! - es.get(id)!;
    task.isCritical     = task.slack === 0;
    if (task.isCritical) criticalPath.push(id);
    return task;
  });

  return { order: orderedTasks, criticalPath, duration: projectDuration };
}

/**
 * Validates a new dependency before it is saved.
 * Returns an error string or null if valid.
 */
export function validateDependency(
  fromTaskId: string,
  toTaskId: string,
  existingDeps: Dependency[]
): string | null {
  if (fromTaskId === toTaskId) return "A task cannot depend on itself.";

  const duplicate = existingDeps.some(
    d => d.fromTaskId === fromTaskId && d.toTaskId === toTaskId
  );
  if (duplicate) return "This dependency already exists.";

  // Simulate adding the edge and check for cycles
  const taskIds = new Set<string>();
  const adj = new Map<string, string[]>();
  existingDeps.forEach(d => {
    taskIds.add(d.fromTaskId);
    taskIds.add(d.toTaskId);
    if (!adj.has(d.fromTaskId)) adj.set(d.fromTaskId, []);
    adj.get(d.fromTaskId)!.push(d.toTaskId);
  });
  taskIds.add(fromTaskId);
  taskIds.add(toTaskId);
  if (!adj.has(fromTaskId)) adj.set(fromTaskId, []);
  adj.get(fromTaskId)!.push(toTaskId);

  if (hasCycle([...taskIds], adj)) return "Adding this dependency would create a cycle.";

  return null;
}
