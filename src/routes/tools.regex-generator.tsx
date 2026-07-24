import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimpleAITool, extractRegex } from "@/components/tools/SimpleAITool";
import { findTool } from "@/features/tools/registry";
import { useToolPreferences } from "@/features/preferences/useToolPreferences";
import { generateRegex } from "@/lib/ai.functions";

const FLAVORS = ["JavaScript", "Python", "PHP", "Java", "Go", ".NET"];

export const Route = createFileRoute("/tools/regex-generator")({
  head: () => ({
    meta: [
      { title: "AI Regex Generator — CodeMateAI" },
      {
        name: "description",
        content:
          "Generate, explain, and test regular expressions with live match highlighting and a regex cheat sheet.",
      },
      { property: "og:title", content: "AI Regex Generator" },
      {
        property: "og:description",
        content: "Describe it — get a bulletproof regex, explanation and tester.",
      },
    ],
  }),
  component: Page,
});

function RegexTester({ markdown }: { markdown: string }) {
  const { pattern, flags } = useMemo(() => extractRegex(markdown), [markdown]);
  const [input, setInput] = useState("Try pasting text here to see live matches.");
  const highlighted = useMemo(() => {
    if (!pattern) return null;
    try {
      const re = new RegExp(pattern, flags.includes("g") ? flags : `${flags}g`);
      const parts: { text: string; match: boolean }[] = [];
      let last = 0;
      for (const m of input.matchAll(re)) {
        const idx = m.index ?? 0;
        if (idx > last) parts.push({ text: input.slice(last, idx), match: false });
        parts.push({ text: m[0], match: true });
        last = idx + m[0].length;
      }
      if (last < input.length) parts.push({ text: input.slice(last), match: false });
      return parts;
    } catch (e) {
      return [{ text: `Invalid regex: ${(e as Error).message}`, match: false }];
    }
  }, [pattern, flags, input]);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-border/60 bg-muted/40 p-3 font-mono text-xs">
        <span className="text-muted-foreground">/</span>
        {pattern || <span className="text-muted-foreground">no pattern</span>}
        <span className="text-muted-foreground">/{flags}</span>
      </div>
      <div>
        <Label className="text-xs">Sample input</Label>
        <Textarea
          className="mt-1 min-h-32 font-mono text-xs"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
      </div>
      <div>
        <Label className="text-xs">Live matches</Label>
        <div className="mt-1 whitespace-pre-wrap rounded-2xl border border-border/60 bg-background p-3 font-mono text-xs">
          {highlighted?.map((p, i) =>
            p.match ? (
              <mark key={i} className="rounded bg-violet-200/70 px-0.5 text-violet-900">
                {p.text}
              </mark>
            ) : (
              <span key={i}>{p.text}</span>
            ),
          )}
        </div>
      </div>
    </div>
  );
}

function Page() {
  const tool = findTool("regex-generator")!;
  const { prefs, set, reset } = useToolPreferences("regex-generator", {
    flavor: "JavaScript",
  });

  return (
    <SimpleAITool
      tool={tool}
      filename="regex.md"
      placeholder="Match valid email addresses, allow subdomains and plus tags…"
      examples={[
        "Match valid email addresses",
        "Extract hex colors like #fff or #ffffff",
        "Validate strong passwords (8+ chars, upper, lower, digit, symbol)",
        "Match URLs including query strings",
        "Find US phone numbers",
      ]}
      onResetPrefs={reset}
      controls={
        <div>
          <Label className="text-xs">Regex flavor</Label>
          <Select value={prefs.flavor} onValueChange={(v) => set("flavor", v)}>
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FLAVORS.map((f) => (
                <SelectItem key={f} value={f}>
                  {f}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
      run={(prompt) => generateRegex({ data: { prompt, flavor: prefs.flavor } })}
      extraTabs={[
        {
          value: "tester",
          label: "Regex Tester",
          content: (md) => <RegexTester markdown={md} />,
        },
      ]}
    />
  );
}
