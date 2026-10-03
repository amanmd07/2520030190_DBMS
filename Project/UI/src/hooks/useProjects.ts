// src/hooks/useProjects.ts
// Real-time Firestore listener for the authenticated user's projects.
// Uses onSnapshot — UI updates automatically when Firestore changes.

import { useEffect, useState } from "react";
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, updateDoc, deleteDoc, doc, serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import type { Project, ProjectCategory, ProjectStatus } from "../types";

export interface ProjectInput {
  name: string;
  description: string;
  category: ProjectCategory;
  status: ProjectStatus;
}

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setProjects([]); setLoading(false); return; }

    setLoading(true);
    const q = query(
      collection(db, "projects"),
      where("ownerId", "==", user.uid),
      orderBy("updatedAt", "desc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Project));
        setProjects(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("useProjects snapshot error:", err);
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, [user]);

  async function createProject(input: ProjectInput): Promise<string> {
    if (!user) throw new Error("Not authenticated");
    const now = Date.now();
    const ref = await addDoc(collection(db, "projects"), {
      ...input,
      ownerId:   user.uid,
      createdAt: now,
      updatedAt: now,
      taskCount: 0,
    });
    return ref.id;
  }

  async function updateProject(id: string, input: Partial<ProjectInput>): Promise<void> {
    if (!user) throw new Error("Not authenticated");
    await updateDoc(doc(db, "projects", id), {
      ...input,
      updatedAt: Date.now(),
    });
  }

  async function deleteProject(id: string): Promise<void> {
    if (!user) throw new Error("Not authenticated");
    await deleteDoc(doc(db, "projects", id));
  }

  return { projects, loading, error, createProject, updateProject, deleteProject };
}
