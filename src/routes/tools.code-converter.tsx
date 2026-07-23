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
import { convertCode } from "@/lib/ai.functions";
import { useHistory } from "@/features/history/useHistory";
import { GitCompare, RefreshCw } from "lucide-react";

const LANGS = ["Python", "Java", "JavaScript", "TypeScript", "Go", "Rust", "PHP", "C", "C++", "Swift", "Kotlin", "Ruby", "C#"];

export const Route = createFileRoute("/tools/code-converter")({
  head: () => ({
    meta: [
      { title: "Code Converter — CodeMateAI" },
      { name: "description", content: "Convert code between 12+ languages with syntax and performance notes." },
      { property: "og:title", content: "Code Converter" },
      { property: "og:description", content: "Translate code between languages effortlessly." },
    ],
  }),
  component: Page,
});

function Page() {
  const tool = findTool("code-converter")!;
  const { add } = useHistory();
  const [code, setCode] = useState("");
  const [from, setFrom] = useState("Python");
  const [to, setTo] = useState("TypeScript");

  const mutation = useMutation({
    mutationFn: async () => convertCode({ data: { code, from, to } }),
    onSuccess: (res) => {
      add({
        toolId: "code-converter",
        title: `${from} → ${to}`,
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
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">From</Label>
              <Select value={from} onValueChange={setFrom}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">To</Label>
              <Select value={to} onValueChange={setTo}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {LANGS.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Source code</Label>
            <Textarea
              className="mt-1 min-h-72 font-mono text-xs"
              placeholder={`Paste ${from} code here...`}
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <Button
            className="w-full gap-2 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 text-white hover:opacity-90"
            disabled={!code.trim() || from === to || mutation.isPending}
            onClick={() => mutation.mutate()}
          >
            {mutation.isPending ? (
              <><RefreshCw className="h-4 w-4 animate-spin" /> Converting…</>
            ) : (
              <><GitCompare className="h-4 w-4" /> Convert Code</>
            )}
          </Button>
        </div>
        <div>
          {mutation.isPending && <SkeletonResult />}
          {mutation.isError && !mutation.isPending && (
            <ErrorCard error={mutation.error} onRetry={() => mutation.mutate()} />
          )}
          {mutation.data && !mutation.isPending && (
            <ResultCard markdown={mutation.data.markdown} filename={`converted-${to.toLowerCase()}.md`} />
          )}
          {!mutation.isPending && !mutation.data && !mutation.isError && (
            <div className="flex h-full min-h-64 items-center justify-center rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
              Choose languages, paste code, and press <span className="font-medium">Convert Code</span>.
            </div>
          )}
        </div>
      </div>
    </ToolPage>
  );
}
