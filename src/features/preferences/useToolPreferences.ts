import { useCallback, useEffect, useRef, useState } from "react";

const KEY = "codemateai:tool-prefs:v1";

type PrefsMap = Record<string, Record<string, unknown>>;

function readAll(): PrefsMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PrefsMap) : {};
  } catch {
    return {};
  }
}

function writeAll(map: PrefsMap) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(KEY, JSON.stringify(map));
  window.dispatchEvent(new Event("codemateai:prefs-changed"));
}

/**
 * Per-tool preferences persisted to localStorage.
 * Returns the merged prefs (defaults + stored), a setter, and a reset fn.
 * Auto-hydrates on mount so SSR-rendered defaults don't mismatch.
 */
export function useToolPreferences<T extends Record<string, unknown>>(
  toolId: string,
  defaults: T,
) {
  const defaultsRef = useRef(defaults);
  const [prefs, setPrefs] = useState<T>(defaults);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = readAll()[toolId] as Partial<T> | undefined;
    if (stored) setPrefs({ ...defaultsRef.current, ...stored });
    setHydrated(true);
    const handler = () => {
      const s = readAll()[toolId] as Partial<T> | undefined;
      setPrefs({ ...defaultsRef.current, ...(s ?? {}) });
    };
    window.addEventListener("codemateai:prefs-changed", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("codemateai:prefs-changed", handler);
      window.removeEventListener("storage", handler);
    };
  }, [toolId]);

  const set = useCallback(
    <K extends keyof T>(key: K, value: T[K]) => {
      setPrefs((prev) => {
        const next = { ...prev, [key]: value };
        const all = readAll();
        all[toolId] = next as Record<string, unknown>;
        writeAll(all);
        return next;
      });
    },
    [toolId],
  );

  const reset = useCallback(() => {
    const all = readAll();
    delete all[toolId];
    writeAll(all);
    setPrefs(defaultsRef.current);
  }, [toolId]);

  return { prefs, set, reset, hydrated };
}

export function clearAllToolPreferences() {
  writeAll({});
}
