import { createFileRoute } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { ToolPage } from "@/components/tools/ToolPage";
import { SkeletonResult } from "@/components/tools/SkeletonResult";
import { ErrorCard } from "@/components/tools/ErrorCard";
import { ResultCard } from "@/components/tools/ResultCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { findTool } from "@/features/tools/registry";
import { generateCode } from "@/lib/ai.functions";
import { useHistory } from "@/features/history/useHistory";
import { useToolPreferences } from "@/features/preferences/useToolPreferences";
import { Sparkles, RefreshCw, RotateCcw } from "lucide-react";

const LANGS = ["JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C#", "PHP", "Ruby", "Swift", "Kotlin"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];
const STYLES = ["Idiomatic", "Functional", "Object-Oriented", "Performance-first"];

export const Route = createFileRoute("/tools/code-generator")({
  head: () => ({
    meta: [
      { title: "AI Code Generator — CodeMateAI" },
      { name: "description", content: "Generate production-ready code from natural language across 12+ languages." },
      { property: "og:title", content: "AI Code Generator" },
      { property: "og:description", content: "Turn prompts into complete, explained code." },
    ],
  }),
  component: Page,
});

function Page() {
  const tool = findTool("code-generator")!;
  const { add } = useHistory();
  const { prefs, set, reset } = useToolPreferences("code-generator", {
    language: "TypeScript",
    difficulty: "Intermediate",
    framework: "",
    style: "Idiomatic",
    comments: true,
  });
  const { language, difficulty, framework, style, comments } = prefs;
  const [prompt, setPrompt] = useState("");

  const mutation = useMutation({
    mutationFn: async () =>
      generateCode({
        data: { language, difficulty, framework, style, comments, prompt },
      }),
    onSuccess: (res) => {
      add({
        toolId: "code-generator",
        title: prompt.slice(0, 60) || "Untitled generation",
        input: prompt,
        output: res.markdown,
      });
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  return (
    <ToolPage tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4 rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Preferences auto-save</span>
            <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={reset}>
              <RotateCcw className="h-3 w-3" /> Reset
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Language</Label>
              <Select value={language} onValueChange={(v) => set("language", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Difficulty</Label>
              <Select value={difficulty} onValueChange={(v) => set("difficulty", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DIFFICULTIES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Framework (optional)</Label>
            <Input
              className="mt-1"
              placeholder="e.g. React, FastAPI, Spring"
              value={framework}
              onChange={(e) => set("framework", e.target.value)}
            />
          </div>
          <div>
            <Label className="text-xs">Code Style</Label>
            <Select value={style} onValueChange={(v) => set("style", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {STYLES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-border/60 px-3 py-2">
            <Label htmlFor="comments" className="text-xs">Include comments</Label>
            <Switch id="comments" checked={comments} onCheckedChange={(v) => set("comments", v)} />
          </div>
          <div>
            <Label className="text-xs">Prompt</Label>
            <Textarea
              className="mt-1 min-h-32"
              placeholder="Describe what you want to build..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>
          <Button
            className="w-full gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 text-white hover:opacity-90"
            disabled={!prompt.trim() || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Generating…</>
            ) : (
              <><Sparkles className="h-4 w-4" /> Generate Code</>
            )}
          </Button>
          {mutation.data && (
            <Button
              variant="outline"
              className="w-full gap-2 rounded-2xl"
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
            >
              <RefreshCw className="h-4 w-4" /> Regenerate
            </Button>
          )}
        </div>

        <div>
          {mutation.isPending && <SkeletonResult />}
          {mutation.isError && !mutation.isPending && (
            <ErrorCard error={mutation.error} onRetry={() => mutation.mutate()} />
          )}
          {mutation.data && !mutation.isPending && (
            <ResultCard markdown={mutation.data.markdown} filename="generated-code.md" />
          )}
          {!mutation.isPending && !mutation.data && !mutation.isError && (
            <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
              Fill in the form and press <span className="font-medium">Generate Code</span> — output appears here.
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
}
