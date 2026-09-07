import { useCallback, useEffect, useState } from "react";

const KEY = "codemateai:favorite-tools:v1";
const EVENT = "codemateai:favorite-tools-changed";

function read(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as string[]) : [];
  } catch {
    return [];
  }
}

function write(ids: string[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(ids));
  window.dispatchEvent(new Event(EVENT));
}

/** Starred tools, persisted in local storage and synced across components/tabs. */
export function useFavoriteTools() {
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(read());
    const handler = () => setIds(read());
    window.addEventListener(EVENT, handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener(EVENT, handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const toggleTool = useCallback((id: string) => {
    const current = read();
    write(current.includes(id) ? current.filter((x) => x !== id) : [id, ...current]);
  }, []);

  const isFavoriteTool = useCallback((id: string) => ids.includes(id), [ids]);

  return { toolIds: ids, toggleTool, isFavoriteTool };
}
