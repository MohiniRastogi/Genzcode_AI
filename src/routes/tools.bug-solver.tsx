import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ToolPage } from "@/components/tools/ToolPage";
import { SkeletonResult } from "@/components/tools/SkeletonResult";
import { ErrorCard } from "@/components/tools/ErrorCard";
import { ResultCard } from "@/components/tools/ResultCard";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { findTool } from "@/features/tools/registry";
import { solveBug } from "@/lib/ai.functions";
import { useHistory } from "@/features/history/useHistory";
import { Bug, RefreshCw } from "lucide-react";

const LANGS = ["auto", "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "PHP"];

export const Route = createFileRoute("/tools/bug-solver")({
  head: () => ({
    meta: [
      { title: "AI Bug Solver — CodeMateAI" },
      { name: "description", content: "Detect syntax, logic, runtime and security bugs — and get an instant fix." },
      { property: "og:title", content: "AI Bug Solver" },
      { property: "og:description", content: "Paste broken code, get a working fix and an explanation." },
    ],
  }),
  component: Page,
});

function Page() {
  const tool = findTool("bug-solver")!;
  const { add } = useHistory();
  const [code, setCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [language, setLanguage] = useState("auto");

  const mutation = useMutation({
    mutationFn: async () => solveBug({ data: { code, language, errorMessage } }),
    onSuccess: (res) => {
      add({
        toolId: "bug-solver",
        title: `Fix · ${language}`,
        input: code.slice(0, 200),
        output: res.markdown,
      });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <ToolPage tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4 rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
          <div>
            <Label className="text-xs">Language</Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Error message (optional)</Label>
            <Input
              className="mt-1"
              placeholder="Paste the exception / stack trace"
              value={errorMessage}
              onChange={(e) => setErrorMessage(e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Broken code</Label>
            <Textarea
              className="mt-1 min-h-64 font-mono text-xs"
              placeholder="Paste the broken code..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <Button
            className="w-full gap-2 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-red-500 text-white hover:opacity-90"
            disabled={!code.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Solving…</>
            ) : (
              <><Bug className="h-4 w-4" /> Solve Bug</>
            )}
          </Button>
        </div>
        <div>
          {mutation.isPending && <SkeletonResult />}
          {mutation.isError && !mutation.isPending && (
            <ErrorCard error={mutation.error} onRetry={() => mutation.mutate()} />
          )}
          {mutation.data && !mutation.isPending && (
            <ResultCard markdown={mutation.data.markdown} filename="bug-fix.md" />
          )}
          {!mutation.isPending && !mutation.data && !mutation.isError && (
            <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
              Paste broken code and press <span className="font-medium">Solve Bug</span>.
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
}
