import { useMutation } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { toast } from "sonner";
import {
  Sparkles,
  RefreshCw,
  RotateCcw,
  Share2,
  Star,
  Trash2,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolPage } from "@/components/tools/ToolPage";
import { SkeletonResult } from "@/components/tools/SkeletonResult";
import { ErrorCard } from "@/components/tools/ErrorCard";
import { ResultActions } from "@/components/tools/ResultActions";
import { AIResponseRenderer } from "@/components/tools/AIResponseRenderer";
import { useHistory } from "@/features/history/useHistory";
import type { Tool } from "@/features/tools/registry";

export interface SimpleAIToolProps {
  tool: Tool;
  /** Example prompts users can click to fill the textarea. */
  examples: string[];
  /** Placeholder for the prompt textarea. */
  placeholder: string;
  /** Extra controls rendered above the prompt (e.g. selects). */
  controls?: ReactNode;
  /** Called with the current prompt; must return markdown. */
  run: (prompt: string) => Promise<{ markdown: string }>;
  /** Optional custom right-column tabs (e.g. Regex Tester). */
  extraTabs?: { value: string; label: string; content: (markdown: string) => ReactNode }[];
  /** Optional preferences reset (from useToolPreferences). */
  onResetPrefs?: () => void;
  /** Download filename. */
  filename?: string;
  /** Draft storage key suffix. */
  draftKey?: string;
}

const DRAFT_PREFIX = "codemateai:draft:";

export function SimpleAITool({
  tool,
  examples,
  placeholder,
  controls,
  run,
  extraTabs,
  onResetPrefs,
  filename,
  draftKey,
}: SimpleAIToolProps) {
  const storageKey = `${DRAFT_PREFIX}${draftKey ?? tool.id}`;
  const [prompt, setPrompt] = useState("");
  const { add, entries, toggleFavorite } = useHistory();
  const [savedEntryId, setSavedEntryId] = useState<string | null>(null);

  // Load draft
  useEffect(() => {
    if (typeof window === "undefined") return;
    const draft = window.localStorage.getItem(storageKey);
    if (draft) setPrompt(draft);
  }, [storageKey]);

  // Autosave draft (debounced)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const id = window.setTimeout(() => {
      window.localStorage.setItem(storageKey, prompt);
    }, 400);
    return () => window.clearTimeout(id);
  }, [prompt, storageKey]);

  const mutation = useMutation({
    mutationFn: async () => run(prompt),
    onSuccess: (res) => {
      const entry = add({
        toolId: tool.id,
        title: prompt.slice(0, 60) || tool.title,
        input: prompt,
        output: res.markdown,
      });
      setSavedEntryId(entry.id);
    },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Failed"),
  });

  const submit = useCallback(() => {
    if (!prompt.trim() || mutation.isPending) return;
    mutation.mutate();
  }, [prompt, mutation]);

  // Ctrl/Cmd+Enter shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        submit();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [submit]);

  const markdown = mutation.data?.markdown ?? "";
  const savedEntry = useMemo(
    () => entries.find((e) => e.id === savedEntryId) ?? null,
    [entries, savedEntryId],
  );
  const isFavorited = !!savedEntry?.favorite;

  const words = prompt.trim() ? prompt.trim().split(/\s+/).length : 0;

  const doCopy = () => {
    navigator.clipboard.writeText(markdown);
    toast.success("Copied to clipboard");
  };

  const doDownload = () => {
    const blob = new Blob([markdown], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename ?? `${tool.id}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const doShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({ title: tool.title, text: markdown });
      } else {
        await navigator.clipboard.writeText(markdown);
        toast.success("Copied — paste anywhere to share");
      }
    } catch {
      /* cancelled */
    }
  };

  const doFavorite = () => {
    if (!savedEntryId) {
      toast.info("Nothing to save yet");
      return;
    }
    toggleFavorite(savedEntryId);
    toast.success(isFavorited ? "Removed from favorites" : "Added to favorites");
  };

  const doClear = () => {
    setPrompt("");
    mutation.reset();
    setSavedEntryId(null);
    if (typeof window !== "undefined") window.localStorage.removeItem(storageKey);
  };

  return (
    <ToolPage tool={tool}>
      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <div className="space-y-4 rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              Draft auto-saved · ⌘/Ctrl + Enter to run
            </span>
            {onResetPrefs && (
              <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={onResetPrefs}>
                <RotateCcw className="h-3 w-3" /> Reset
              </Button>
            )}
          </div>

          {controls}

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">Prompt</Label>
              <span className="text-[10px] text-muted-foreground">
                {prompt.length} chars · {words} words
              </span>
            </div>
            <Textarea
              className="mt-1 min-h-40"
              placeholder={placeholder}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {examples.length > 0 && (
            <div>
              <Label className="text-xs">Example prompts</Label>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {examples.map((ex) => (
                  <button
                    key={ex}
                    onClick={() => setPrompt(ex)}
                    className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground transition hover:bg-background hover:text-foreground"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button
            className={`w-full gap-2 rounded-2xl bg-gradient-to-r ${tool.gradient} text-white hover:opacity-90`}
            disabled={!prompt.trim() || mutation.isPending}
            onClick={submit}
          >
            {mutation.isPending ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" /> Generate
              </>
            )}
          </Button>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              className="rounded-2xl"
              disabled={!mutation.data || mutation.isPending}
              onClick={() => mutation.mutate()}
            >
              <RefreshCw className="h-4 w-4" /> Regenerate
            </Button>
            <Button variant="outline" className="rounded-2xl" onClick={doClear}>
              <Trash2 className="h-4 w-4" /> Clear
            </Button>
          </div>
        </div>

        <div>
          {mutation.isPending && <SkeletonResult />}
          {mutation.isError && !mutation.isPending && (
            <ErrorCard error={mutation.error} onRetry={() => mutation.mutate()} />
          )}
          {mutation.data && !mutation.isPending && (
            <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-sm backdrop-blur-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border/60 px-4 py-3">
                <h2 className="text-sm font-semibold">Result</h2>
                <div className="flex flex-wrap items-center gap-1.5">
                  <ResultActions content={markdown} baseName={filename ?? `${tool.id}.md`} />

                  <Button size="sm" variant="ghost" onClick={doShare}>
                    <Share2 className="h-4 w-4" /> Share
                  </Button>
                  <Button
                    size="sm"
                    variant={isFavorited ? "default" : "outline"}
                    onClick={doFavorite}
                  >
                    <Star className={isFavorited ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                    {isFavorited ? "Saved" : "Favorite"}
                  </Button>
                  <span className="ml-1 inline-flex items-center gap-1 rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[10px] text-muted-foreground">
                    <Save className="h-3 w-3" /> in History
                  </span>
                </div>
              </div>
              <Tabs defaultValue="output" className="w-full">
                <div className="border-b border-border/60 px-4">
                  <TabsList className="my-2">
                    <TabsTrigger value="output">Output</TabsTrigger>
                    <TabsTrigger value="raw">Raw</TabsTrigger>
                    {extraTabs?.map((t) => (
                      <TabsTrigger key={t.value} value={t.value}>
                        {t.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </div>
                <TabsContent value="output" className="px-6 py-5">
                  <AIResponseRenderer content={markdown} />
                </TabsContent>
                <TabsContent value="raw" className="px-6 py-5">
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-2xl border border-border/60 bg-muted/40 p-4 text-xs">
                    {markdown}
                  </pre>
                </TabsContent>
                {extraTabs?.map((t) => (
                  <TabsContent key={t.value} value={t.value} className="px-6 py-5">
                    {t.content(markdown)}
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          )}
          {!mutation.isPending && !mutation.data && !mutation.isError && (
            <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
              Fill in the prompt and press <span className="mx-1 font-medium">Generate</span> — or
              use <kbd className="mx-1 rounded border border-border/60 bg-background px-1.5 py-0.5 text-[10px]">⌘/Ctrl + Enter</kbd>.
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
}

/** Extracts the first regex pattern from a markdown ```regex block. */
export function extractRegex(md: string): { pattern: string; flags: string } {
  const match = md.match(/```regex\s+([\s\S]*?)```/i);
  const pattern = match ? match[1].trim() : "";
  const flagsMatch = md.match(/##\s*Flags[\s\S]*?`([a-z]*)`/i);
  return { pattern, flags: flagsMatch?.[1] ?? "g" };
}
