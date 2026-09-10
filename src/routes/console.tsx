import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Play, Eraser, TerminalSquare, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIResponseRenderer } from "@/components/tools/AIResponseRenderer";
import { simulateExecution } from "@/lib/ai.functions";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/console")({
  head: () => ({
    meta: [
      { title: "Live Code Console — Run Code in Your Browser | CodeMateAI" },
      {
        name: "description",
        content:
          "Paste any snippet and run it instantly. JavaScript, TypeScript, Python and HTML execute in a sandbox; Java, C++, Go and more get a simulated run with predicted output.",
      },
      { property: "og:title", content: "Live Code Console — CodeMateAI" },
      {
        property: "og:description",
        content:
          "Run JavaScript, TypeScript, Python and HTML in your browser, and simulate Java, C++, Go, Rust and more.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ConsolePage,
});

const TOKEN = "codemateai-console";

type Engine = "js" | "python" | "html" | "ai";

interface LangDef {
  value: string;
  label: string;
  engine: Engine;
  group: string;
}

const LANGUAGES: LangDef[] = [
  { value: "JavaScript", label: "JavaScript", engine: "js", group: "Runs in your browser" },
  { value: "TypeScript", label: "TypeScript", engine: "js", group: "Runs in your browser" },
  { value: "Python", label: "Python", engine: "python", group: "Runs in your browser" },
  { value: "HTML", label: "HTML / CSS", engine: "html", group: "Runs in your browser" },
  { value: "Java", label: "Java", engine: "ai", group: "Simulated run" },
  { value: "C", label: "C", engine: "ai", group: "Simulated run" },
  { value: "C++", label: "C++", engine: "ai", group: "Simulated run" },
  { value: "C#", label: "C#", engine: "ai", group: "Simulated run" },
  { value: "Go", label: "Go", engine: "ai", group: "Simulated run" },
  { value: "Rust", label: "Rust", engine: "ai", group: "Simulated run" },
  { value: "PHP", label: "PHP", engine: "ai", group: "Simulated run" },
  { value: "Ruby", label: "Ruby", engine: "ai", group: "Simulated run" },
  { value: "Swift", label: "Swift", engine: "ai", group: "Simulated run" },
  { value: "Kotlin", label: "Kotlin", engine: "ai", group: "Simulated run" },
  { value: "SQL", label: "SQL", engine: "ai", group: "Simulated run" },
];

const STARTERS: Record<string, string> = {
  JavaScript: `const fib = (n) => (n < 2 ? n : fib(n - 1) + fib(n - 2));\nfor (let i = 0; i < 8; i++) console.log(i, fib(i));`,
  TypeScript: `function greet(name: string): string {\n  return \`Hello, \${name}!\`;\n}\nconsole.log(greet("CodeMateAI"));`,
  Python: `def fib(n):\n    a, b = 0, 1\n    for _ in range(n):\n        yield a\n        a, b = b, a + b\n\nprint(list(fib(10)))`,
  HTML: `<h1 style="font-family: system-ui">Hello 👋</h1>\n<p>Edit this markup and press Run.</p>`,
  Java: `public class Main {\n    public static void main(String[] args) {\n        for (int i = 1; i <= 5; i++) System.out.println("i = " + i);\n    }\n}`,
};

interface LogLine {
  level: "log" | "warn" | "error" | "info";
  text: string;
}

function jsDoc(code: string) {
  return `<!doctype html><html><head><meta charset="utf-8"></head><body><script>
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
    console[level] = function () { send(level, Array.prototype.slice.call(arguments)); };
  });
  window.onerror = function (msg, src, line) { send("error", [msg + " (line " + line + ")"]); };
  window.addEventListener("unhandledrejection", function (e) {
    send("error", ["Unhandled promise rejection: " + (e.reason && e.reason.message ? e.reason.message : e.reason)]);
  });
  try { (0, eval)(${JSON.stringify(code)}); }
  catch (err) { send("error", [(err && err.stack) ? err.stack : String(err)]); }
  parent.postMessage({ __token: ${JSON.stringify(TOKEN)}, done: true }, "*");
})();
<\/script></body></html>`;
}

function pythonDoc(code: string, stdin: string) {
  return `<!doctype html><html><head><meta charset="utf-8">
<script src="https://cdn.jsdelivr.net/pyodide/v0.26.4/full/pyodide.js"><\/script>
</head><body><script>
(function () {
  var send = function (level, text) {
    parent.postMessage({ __token: ${JSON.stringify(TOKEN)}, level: level, text: String(text) }, "*");
  };
  var done = function () { parent.postMessage({ __token: ${JSON.stringify(TOKEN)}, done: true }, "*"); };
  var lines = ${JSON.stringify(stdin)}.split("\\n");
  send("info", "Booting Python runtime…");
  (async function () {
    try {
      var pyodide = await loadPyodide();
      pyodide.setStdout({ batched: function (t) { send("log", t); } });
      pyodide.setStderr({ batched: function (t) { send("error", t); } });
      pyodide.setStdin({ stdin: function () { return lines.length ? lines.shift() : null; } });
      var code = ${JSON.stringify(code)};
      try { await pyodide.loadPackagesFromImports(code); } catch (e) {}
      await pyodide.runPythonAsync(code);
    } catch (err) {
      send("error", (err && err.message) ? err.message : String(err));
    }
    done();
  })();
})();
<\/script></body></html>`;
}

function htmlDoc(code: string) {
  if (/<html[\s>]/i.test(code)) return code;
  return `<!doctype html><html><head><meta charset="utf-8"><style>body{font-family:system-ui,sans-serif;margin:16px}</style></head><body>${code}</body></html>`;
}

function ConsolePage() {
  const [language, setLanguage] = useState("JavaScript");
  const [code, setCode] = useState(STARTERS.JavaScript);
  const [stdin, setStdin] = useState("");
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [srcDoc, setSrcDoc] = useState("");
  const [running, setRunning] = useState(false);
  const [transformError, setTransformError] = useState<string | null>(null);
  const timer = useRef<number | null>(null);

  const def = LANGUAGES.find((l) => l.value === language)!;
  const engine = def.engine;

  const sim = useMutation({
    mutationFn: async () => simulateExecution({ data: { language, code, stdin } }),
  });

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      const data = e.data as {
        __token?: string;
        level?: LogLine["level"];
        text?: string;
        done?: boolean;
      };
      if (!data || data.__token !== TOKEN) return;
      if (data.done) {
        setRunning(false);
        if (timer.current) window.clearTimeout(timer.current);
        return;
      }
      setLogs((prev) => [...prev, { level: data.level ?? "log", text: data.text ?? "" }]);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  const pickLanguage = (value: string) => {
    setLanguage(value);
    setLogs([]);
    setSrcDoc("");
    setTransformError(null);
    sim.reset();
    const starter = STARTERS[value];
    const isStarter = Object.values(STARTERS).includes(code.trim());
    if (starter && (!code.trim() || isStarter)) setCode(starter);
  };

  const clear = () => {
    setLogs([]);
    setSrcDoc("");
    setRunning(false);
    setTransformError(null);
    sim.reset();
  };

  const run = async () => {
    setLogs([]);
    setTransformError(null);
    sim.reset();
    if (!code.trim()) return;

    if (engine === "html") {
      setSrcDoc(htmlDoc(code));
      return;
    }
    if (engine === "ai") {
      setSrcDoc("");
      sim.mutate();
      return;
    }
    if (engine === "python") {
      setRunning(true);
      setSrcDoc(pythonDoc(code, stdin));
      timer.current = window.setTimeout(() => setRunning(false), 90000);
      return;
    }

    let js = code;
    if (language === "TypeScript") {
      try {
        const { transform } = await import("sucrase");
        js = transform(code, { transforms: ["typescript", "jsx", "imports"] }).code;
      } catch (err) {
        setTransformError(err instanceof Error ? err.message : String(err));
        return;
      }
    }
    setRunning(true);
    setSrcDoc(jsDoc(js));
    timer.current = window.setTimeout(() => setRunning(false), 10000);
  };

  const busy = running || sim.isPending;
  const groups = Array.from(new Set(LANGUAGES.map((l) => l.group)));

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="mb-6 flex items-start gap-4">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-600 via-slate-700 to-slate-900 shadow-lg shadow-black/5">
          <TerminalSquare className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Live Console</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Paste any code and run it. JavaScript, TypeScript, Python and HTML execute right here;
            other languages get a simulated run with predicted output.
          </p>
        </div>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="space-y-4" aria-label="Code input">
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="console-language">Language</Label>
              <Select value={language} onValueChange={pickLanguage}>
                <SelectTrigger id="console-language">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {groups.map((g) => (
                    <div key={g}>
                      <p className="px-2 py-1.5 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        {g}
                      </p>
                      {LANGUAGES.filter((l) => l.group === g).map((l) => (
                        <SelectItem key={l.value} value={l.value}>
                          {l.label}
                        </SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="console-stdin">Standard input (optional)</Label>
              <Textarea
                id="console-stdin"
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="One value per line"
                className="min-h-[38px] font-mono text-xs"
                rows={2}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="console-code">Code</Label>
            <Textarea
              id="console-code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              spellCheck={false}
              className="min-h-[380px] font-mono text-xs"
              placeholder="Paste your code here…"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={run} disabled={busy || !code.trim()} className="gap-1.5">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Play className="h-4 w-4" />}
              {busy ? "Running…" : engine === "ai" ? "Simulate run" : "Run"}
            </Button>
            <Button variant="ghost" onClick={clear} className="gap-1.5">
              <Eraser className="h-4 w-4" /> Clear
            </Button>
            <span className="text-xs text-muted-foreground">
              {engine === "ai"
                ? "Output is predicted by AI — no compiler runs."
                : engine === "python"
                  ? "First Python run downloads the runtime (a few seconds)."
                  : "Runs in a sandboxed frame in your browser."}
            </span>
          </div>
        </section>

        <section className="space-y-3" aria-label="Output">
          <h2 className="text-sm font-semibold">Output</h2>

          {transformError && (
            <p className="rounded-xl border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
              {transformError}
            </p>
          )}

          {engine === "html" ? (
            <iframe
              title="HTML preview"
              sandbox="allow-scripts"
              srcDoc={srcDoc}
              className="h-[460px] w-full rounded-2xl border border-border/60 bg-white"
            />
          ) : engine === "ai" ? (
            <div className="min-h-[200px] rounded-2xl border border-border/60 bg-card/60 p-4">
              {sim.isPending ? (
                <p className="text-sm text-muted-foreground">
                  <Sparkles className="mr-1 inline h-4 w-4" /> Simulating the {language} run…
                </p>
              ) : sim.isError ? (
                <p className="text-sm text-destructive">
                  {sim.error instanceof Error ? sim.error.message : "Simulation failed"}
                </p>
              ) : sim.data ? (
                <AIResponseRenderer content={sim.data.markdown} />
              ) : (
                <p className="text-sm text-muted-foreground">
                  Press “Simulate run” to see the predicted output for this {language} program.
                </p>
              )}
            </div>
          ) : (
            <>
              <div className="max-h-[460px] min-h-[200px] overflow-auto rounded-2xl border border-border/60 bg-muted/40 p-3 font-mono text-xs">
                {logs.length === 0 ? (
                  <span className="text-muted-foreground">
                    Press Run to execute. Use{" "}
                    <code>{language === "Python" ? "print()" : "console.log()"}</code> to print
                    values.
                  </span>
                ) : (
                  logs.map((l, i) => (
                    <pre
                      key={i}
                      className={cn(
                        "whitespace-pre-wrap",
                        l.level === "error" && "text-destructive",
                        l.level === "warn" && "text-amber-600",
                        l.level === "info" && "text-muted-foreground",
                      )}
                    >
                      {l.text}
                    </pre>
                  ))
                )}
              </div>
              <iframe
                title="Code sandbox"
                sandbox="allow-scripts allow-same-origin"
                srcDoc={srcDoc}
                className="hidden"
              />
            </>
          )}
        </section>
      </div>
    </div>
  );
}
