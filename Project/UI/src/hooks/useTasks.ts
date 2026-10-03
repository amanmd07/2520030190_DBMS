// src/hooks/useTasks.ts
// Real-time Firestore listener for tasks belonging to a single project.

import { useEffect, useState } from "react";
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import type { Task, TaskStatus, TaskPriority } from "../types";

export interface TaskInput {
  name: string;
  description: string;
  duration: number;
  priority: TaskPriority;
  status: TaskStatus;
}

export function useTasks(projectId: string | undefined) {
  const { user } = useAuth();
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!user || !projectId) { setTasks([]); setLoading(false); return; }

    setLoading(true);
    const q = query(
      collection(db, "tasks"),
      where("projectId", "==", projectId),
      where("ownerId",   "==", user.uid),
      orderBy("createdAt", "asc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Task));
        setTasks(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("useTasks snapshot error:", err);
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, [user, projectId]);

  async function createTask(input: TaskInput): Promise<string> {
    if (!user || !projectId) throw new Error("Missing user or project");
    const now = Date.now();
    const ref = await addDoc(collection(db, "tasks"), {
      ...input,
      projectId,
      ownerId:   user.uid,
      createdAt: now,
      updatedAt: now,
    });
    return ref.id;
  }

  async function updateTask(id: string, input: Partial<TaskInput>): Promise<void> {
    if (!user) throw new Error("Not authenticated");
    await updateDoc(doc(db, "tasks", id), { ...input, updatedAt: Date.now() });
  }

  async function deleteTask(id: string): Promise<void> {
    if (!user) throw new Error("Not authenticated");
    await deleteDoc(doc(db, "tasks", id));
  }

  return { tasks, loading, error, createTask, updateTask, deleteTask };
}
