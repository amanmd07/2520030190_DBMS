// src/types.ts — Shared TypeScript types for AutoScheduleDSA

export type ProjectCategory =
  | "Software"
  | "Web Development"
  | "Mobile App"
  | "AI / ML"
  | "Data Science"
  | "Academic"
  | "Other";

export type ProjectStatus = "Planning" | "In Progress" | "Completed" | "On Hold";

export type TaskStatus = "Pending" | "In Progress" | "Completed";

export type TaskPriority = "Low" | "Medium" | "High" | "Critical";

export interface Project {
  id: string;
  ownerId: string;
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
  createdAt: number;   // Unix ms
  updatedAt: number;
  taskCount?: number;  // denormalised for home screen
}

export interface Task {
  id: string;
  projectId: string;
  ownerId: string;
  name: string;
  description: string;
  duration: number;    // days
  priority: TaskPriority;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
  // Computed by scheduler (not stored):
  earliestStart?: number;
  earliestFinish?: number;
  latestStart?: number;
  latestFinish?: number;
  slack?: number;
  isCritical?: boolean;
}

export interface Dependency {
  id: string;
  projectId: string;
  ownerId: string;
  fromTaskId: string;   // predecessor
  toTaskId: string;     // successor
  createdAt: number;
}

export interface ScheduleResult {
  order: Task[];
  criticalPath: string[];
  duration: number;   // total project days
  error?: string;     // "Cycle detected" etc.
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}
