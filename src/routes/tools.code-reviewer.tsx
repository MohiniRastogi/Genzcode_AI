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
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { findTool } from "@/features/tools/registry";
import { reviewCode } from "@/lib/ai.functions";
import { useHistory } from "@/features/history/useHistory";
import { ShieldCheck, RefreshCw } from "lucide-react";

const LANGS = ["auto", "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "PHP"];

export const Route = createFileRoute("/tools/code-reviewer")({
  head: () => ({
    meta: [
      { title: "AI Code Reviewer — CodeMateAI" },
      { name: "description", content: "Get a full AI code review: scores, bugs, optimizations and a corrected version." },
      { property: "og:title", content: "AI Code Reviewer" },
      { property: "og:description", content: "Rigorous, actionable AI code reviews in seconds." },
    ],
  }),
  component: Page,
});

function Page() {
  const tool = findTool("code-reviewer")!;
  const { add } = useHistory();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("auto");

  const mutation = useMutation({
    mutationFn: async () => reviewCode({ data: { code, language } }),
    onSuccess: (res) => {
      add({
        toolId: "code-reviewer",
        title: `Review · ${language}`,
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
            <Label className="text-xs">Code to review</Label>
            <Textarea
              className="mt-1 min-h-72 font-mono text-xs"
              placeholder="Paste your code here..."
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <Button
            className="w-full gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white hover:opacity-90"
            disabled={!code.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Reviewing…</>
            ) : (
              <><ShieldCheck className="h-4 w-4" /> Review Code</>
            )}
          </Button>
        </div>
        <div>
          {mutation.isPending && <SkeletonResult />}
          {mutation.isError && !mutation.isPending && (
            <ErrorCard error={mutation.error} onRetry={() => mutation.mutate()} />
          )}
          {mutation.data && !mutation.isPending && (
            <ResultCard markdown={mutation.data.markdown} filename="code-review.md" />
          )}
          {!mutation.isPending && !mutation.data && !mutation.isError && (
            <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
              Paste code and press <span className="font-medium">Review Code</span>.
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
}
