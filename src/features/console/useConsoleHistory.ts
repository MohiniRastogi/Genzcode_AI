import { useCallback, useEffect, useState } from "react";

export interface ConsoleRunEntry {
  id: string;
  language: string;
  code: string;
  stdin: string;
  output: string;
  createdAt: number;
  stopped?: boolean;
}

const KEY = "codemateai:console-history:v1";
const EVENT = "codemateai:console-history-changed";
const MAX = 50;

function read(): ConsoleRunEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    return JSON.parse(raw) as ConsoleRunEntry[];
  } catch {
    return [];
  }
}

function write(entries: ConsoleRunEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(entries.slice(0, MAX)));
  window.dispatchEvent(new Event(EVENT));
}

/** Local run history for the Live Console, synced across components and tabs. */
export function useConsoleHistory() {
  const [runs, setRuns] = useState<ConsoleRunEntry[]>([]);

  useEffect(() => {
    setRuns(read());
    const handler = () => setRuns(read());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const add = useCallback((entry: Omit<ConsoleRunEntry, "id" | "createdAt">) => {
    const full: ConsoleRunEntry = {
      ...entry,
      id: crypto.randomUUID(),
      createdAt: Date.now(),
    };
    write([full, ...read()]);
    return full;
  }, []);

  const remove = useCallback((id: string) => {
    write(read().filter((r) => r.id !== id));
  }, []);

  const clear = useCallback(() => write([]), []);

  return { runs, add, remove, clear };
}
