import { useEffect, useMemo, useRef, useState } from "react";
import { Play, Square, Eraser, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { pickRunnable, isTypescript, isJsx, type RunnableKind } from "@/lib/run-code";

interface LogLine {
  level: "log" | "warn" | "error" | "info";
  text: string;
}

const TOKEN = "codemateai-runner";

function buildJsDoc(code: string) {
  return `<!doctype html><html><head><meta charset="utf-8"></head><body>
<script>
(function () {
  var send = function (level, args) {
    try {
      parent.postMessage({ __token: ${JSON.stringify(TOKEN)}, level: level, text: args.map(function (a) {
        if (typeof a === "string") return a;
        try { return JSON.stringify(a, null, 2); } catch (e) { return String(a); }
      }).join(" ") }, "*");
    } catch (e) {}
  };
  ["log", "info", "warn", "error"].forEach(function (level) {
    var orig = console[level];
    console[level] = function () {
      send(level, Array.prototype.slice.call(arguments));
      try { orig.apply(console, arguments); } catch (e) {}
    };
  });
  window.onerror = function (msg, src, line) { send("error", [msg + " (line " + line + ")"]); };
  window.addEventListener("unhandledrejection", function (e) { send("error", ["Unhandled promise rejection: " + (e.reason && e.reason.message ? e.reason.message : e.reason)]); });
  try {
    (0, eval)(${JSON.stringify(code)});
  } catch (err) {
    send("error", [(err && err.stack) ? err.stack : String(err)]);
  }
  parent.postMessage({ __token: ${JSON.stringify(TOKEN)}, done: true }, "*");
})();
<\/script></body></html>`;
}

function buildHtmlDoc(html: string, css?: string, js?: string) {
  const style = css ? `<style>${css}</style>` : "";
  const script = js ? `<script>try{${js}}catch(e){console.error(e)}<\/script>` : "";
  if (/<html[\s>]/i.test(html)) {
    return html.replace(/<\/head>/i, `${style}</head>`).replace(/<\/body>/i, `${script}</body>`);
  }
  return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;margin:16px}</style>${style}</head><body>${html}${script}</body></html>`;
}

export function CodeRunner({ markdown }: { markdown: string }) {
  const detected = useMemo(() => pickRunnable(markdown), [markdown]);
  const [code, setCode] = useState(detected?.block.code ?? "");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [running, setRunning] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const [transformError, setTransformError] = useState<string | null>(null);
  const frameRef = useRef<HTMLIFrameElement | null>(null);

  useEffect(() => {
    setCode(detected?.block.code ?? "");
    setLogs([]);
    setSrcDoc("");
    setTransformError(null);
  }, [detected]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as { __token?: string; level?: LogLine["level"]; text?: string; done?: boolean };
      if (!data || data.__token !== TOKEN) return;
      if (data.done) {
        setRunning(false);
        return;
      }
      setLogs((prev) => [...prev, { level: data.level ?? "log", text: data.text ?? "" }]);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  if (!detected) return null;

  const kind: RunnableKind = detected.kind;
  const lang = detected.block.lang;

  const run = async () => {
    setLogs([]);
    setTransformError(null);
    if (kind === "html") {
      setSrcDoc(buildHtmlDoc(code, detected.css, detected.js));
      return;
    }
    let js = code;
    if (isTypescript(lang) || isJsx(lang)) {
      try {
        const { transform } = await import("sucrase");
        js = transform(code, {
          transforms: [
            ...(isTypescript(lang) ? (["typescript"] as const) : []),
            ...(isJsx(lang) ? (["jsx"] as const) : []),
            "imports" as const,
          ],
        }).code;
      } catch (err) {
        setTransformError(err instanceof Error ? err.message : String(err));
        return;
      }
    }
    setRunning(true);
    setSrcDoc(buildJsDoc(js));
    window.setTimeout(() => setRunning(false), 8000);
  };

  const stop = () => {
    setSrcDoc("");
    setRunning(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 text-xs text-muted-foreground">
          <TerminalSquare className="h-3.5 w-3.5" />
          Runs in a sandbox · detected <span className="font-mono">{lang || kind}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Button size="sm" onClick={run} disabled={running || !code.trim()} className="gap-1">
            <Play className="h-4 w-4" /> {running ? "Running…" : "Run"}
          </Button>
          {(srcDoc || logs.length > 0) && (
            <Button size="sm" variant="outline" onClick={stop} className="gap-1">
              <Square className="h-4 w-4" /> Stop
            </Button>
          )}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              setLogs([]);
              setSrcDoc("");
            }}
            className="gap-1"
          >
            <Eraser className="h-4 w-4" /> Clear
          </Button>
        </div>
      </div>

      <div>
        <p className="mb-1 text-xs font-medium">Editable code</p>
        <Textarea
          className="min-h-56 font-mono text-xs"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          spellCheck={false}
        />
      </div>

      {transformError && (
        <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
          {transformError}
        </p>
      )}

      {kind === "html" ? (
        <div>
          <p className="mb-1 text-xs font-medium">Preview</p>
          <iframe
            ref={frameRef}
            title="Code preview"
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            className="h-80 w-full rounded-2xl border border-border/60 bg-white"
          />
        </div>
      ) : (
        <>
          <div>
            <p className="mb-1 text-xs font-medium">Console output</p>
            <div className="max-h-72 overflow-auto rounded-2xl border border-border/60 bg-muted/40 p-3 font-mono text-xs">
              {logs.length === 0 ? (
                <span className="text-muted-foreground">
                  Press Run to execute. Use <code>console.log()</code> to print values.
                </span>
              ) : (
                logs.map((l, i) => (
                  <pre
                    key={i}
                    className={cn(
                      "whitespace-pre-wrap",
                      l.level === "error" && "text-destructive",
                      l.level === "warn" && "text-amber-600",
                    )}
                  >
                    {l.text}
                  </pre>
                ))
              )}
            </div>
          </div>
          <iframe
            ref={frameRef}
            title="Code sandbox"
            sandbox="allow-scripts"
            srcDoc={srcDoc}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}
