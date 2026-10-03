// src/hooks/useDependencies.ts
// Real-time Firestore listener for task dependencies in a project.

import { useEffect, useState } from "react";
import {
  collection, query, where, orderBy, onSnapshot,
  addDoc, deleteDoc, doc,
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import type { Dependency } from "../types";

export function useDependencies(projectId: string | undefined) {
  const { user } = useAuth();
  const [dependencies, setDependencies] = useState<Dependency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  useEffect(() => {
    if (!user || !projectId) { setDependencies([]); setLoading(false); return; }

    setLoading(true);
    const q = query(
      collection(db, "dependencies"),
      where("projectId", "==", projectId),
      where("ownerId",   "==", user.uid),
      orderBy("createdAt", "asc"),
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() } as Dependency));
        setDependencies(data);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error("useDependencies snapshot error:", err);
        setError(err.message);
        setLoading(false);
      },
    );
    return unsub;
  }, [user, projectId]);

  async function createDependency(fromTaskId: string, toTaskId: string): Promise<string> {
    if (!user || !projectId) throw new Error("Missing user or project");
    const ref = await addDoc(collection(db, "dependencies"), {
      projectId,
      ownerId: user.uid,
      fromTaskId,
      toTaskId,
      createdAt: Date.now(),
    });
    return ref.id;
  }

  async function deleteDependency(id: string): Promise<void> {
    if (!user) throw new Error("Not authenticated");
    await deleteDoc(doc(db, "dependencies", id));
  }

  return { dependencies, loading, error, createDependency, deleteDependency };
}
