import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ToolPage } from "@/components/tools/ToolPage";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { findTool } from "@/features/tools/registry";
import { Minimize2, Wand2, CheckCircle2, XCircle } from "lucide-react";
import { ResultActions } from "@/components/tools/ResultActions";

export const Route = createFileRoute("/utilities/json-formatter")({
  head: () => ({
    meta: [
      { title: "JSON Formatter — CodeMateAI" },
      { name: "description", content: "Format, validate and minify JSON — fast and free." },
    ],
  }),
  component: Page,
});

function Page() {
  const tool = findTool("json-formatter")!;
  const [input, setInput] = useState('{"hello":"world","items":[1,2,3]}');
  const [indent, setIndent] = useState(2);

  const { output, error } = useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      const parsed = JSON.parse(input);
      return { output: JSON.stringify(parsed, null, indent), error: null };
    } catch (e) {
      return { output: "", error: e instanceof Error ? e.message : "Invalid JSON" };
    }
  }, [input, indent]);

  const minify = () => {
    try {
      setInput(JSON.stringify(JSON.parse(input)));
    } catch {
      toast.error("Invalid JSON");
    }
  };

  return (
    <ToolPage tool={tool}>
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Input</h3>
            <div className="flex items-center gap-2">
              <select
                value={indent}
                onChange={(e) => setIndent(Number(e.target.value))}
                className="rounded-lg border border-border/60 bg-background px-2 py-1 text-xs"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
                <option value={0}>Minified</option>
              </select>
              <Button size="sm" variant="ghost" onClick={minify}>
                <Minimize2 className="h-3.5 w-3.5" /> Minify
              </Button>
            </div>
          </div>
          <Textarea
            className="min-h-96 font-mono text-xs"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
        <div className="rounded-3xl border border-border/60 bg-card/70 p-4 shadow-sm backdrop-blur-sm">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-semibold">Output</h3>
            {error ? (
              <span className="inline-flex items-center gap-1 text-xs text-destructive">
                <XCircle className="h-3.5 w-3.5" /> Invalid
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                <CheckCircle2 className="h-3.5 w-3.5" /> Valid
              </span>
            )}
          </div>
          {error ? (
            <div className="rounded-2xl border border-destructive/40 bg-destructive/5 p-4 text-xs text-destructive">
              {error}
            </div>
          ) : (
            <>
              <pre className="min-h-96 overflow-auto rounded-2xl border border-border/60 bg-muted/40 p-4 font-mono text-xs">
                {output}
              </pre>
              <div className="mt-2 flex flex-wrap items-center gap-1">
                <ResultActions content={output} baseName="formatted.json" markdown={false} />
              </div>
            </>
          )}
        </div>
      </div>
      <p className="mt-4 text-xs text-muted-foreground">
        <Wand2 className="mr-1 inline h-3 w-3" />
        Runs entirely in your browser — nothing is sent to a server.
      </p>
    </ToolPage>
  );
}
