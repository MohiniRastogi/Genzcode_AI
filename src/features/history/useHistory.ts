import { useCallback, useEffect, useState } from "react";

export interface HistoryEntry {
  id: string;
  toolId: string;
  title: string;
  input: string;
  output: string;
  createdAt: number;
  favorite?: boolean;
}

const KEY = "codemateai:history:v1";

function read(): HistoryEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as HistoryEntry[];
  } catch {
    return [];
  }
}

function write(entries: HistoryEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, 200)));
  window.dispatchEvent(new Event("codemateai:history-changed"));
}

export function useHistory() {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);

  useEffect(() => {
    setEntries(read());
    const handler = () => setEntries(read());
    window.addEventListener("codemateai:history-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("codemateai:history-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const add = useCallback((entry: Omit<HistoryEntry, "id" | "createdAt">) => {
    const full: HistoryEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    write([full, ...read()]);
    return full;
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((e) => e.id !== id));
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    write(
      read().map((e) => (e.id === id ? { ...e, favorite: !e.favorite } : e)),
    );
  }, []);

  const clear = useCallback(() => write([]), []);

  return { entries, add, remove, toggleFavorite, clear };
}

export function useHistoryStats() {
  const { entries } = useHistory();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayTs = today.getTime();

  return {
    total: entries.length,
    today: entries.filter((e) => e.createdAt >= todayTs).length,
    byTool: (toolId: string) => entries.filter((e) => e.toolId === toolId).length,
    favorites: entries.filter((e) => e.favorite).length,
  };
}
