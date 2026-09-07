import { createFileRoute, Link } from "@tanstack/react-router";
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
import { findTool, TOOLS } from "@/features/tools/registry";
import { generateCode } from "@/lib/ai.functions";
import { useHistory } from "@/features/history/useHistory";
import { useToolPreferences } from "@/features/preferences/useToolPreferences";
import { Sparkles, RefreshCw, RotateCcw, ArrowRight } from "lucide-react";

const LANGS = ["HTML", "CSS", "JavaScript", "TypeScript", "Python", "Java", "Go", "Rust", "C++", "C", "C#", "PHP", "Ruby", "Swift", "Kotlin"];
const DIFFICULTIES = ["Beginner", "Intermediate", "Advanced", "Expert"];
const STYLES = ["Idiomatic", "Functional", "Object-Oriented", "Performance-first"];

const POPULAR_EXAMPLES = [
  "Create a login page in React with form validation",
  "Build a REST API in Express with JWT authentication",
  "Generate a CRUD application in Django for a blog",
  "Binary search implementation in Java with comments",
  "Quick sort algorithm in Python with complexity notes",
  "Student management system in C++ using classes",
  "Todo app in React with local storage persistence",
  "Weather app in Flutter using a public API",
  "Portfolio website in HTML, CSS and Tailwind",
  "Calculator app in Kotlin for Android",
  "Real-time chat application in Node.js with Socket.IO",
  "SQL query to find top 10 customers by revenue",
];

const RELATED_TOOL_IDS = [
  "code-reviewer",
  "bug-solver",
  "code-converter",
  "documentation-generator",
  "readme-generator",
  "api-generator",
  "sql-generator",
  "regex-generator",
];

const CG_URL = "https://codemateai.lovable.app/tools/code-generator";
const CG_FAQ = [
  { q: "What can the AI Code Generator create?", a: "It writes production-ready code from a plain-English prompt across Python, JavaScript, TypeScript, Java, Go, Rust, C++, C#, PHP, Ruby, Swift and Kotlin — including React components, Node.js and Express APIs, Django views, SQL queries and Tailwind layouts." },
  { q: "Who should use it?", a: "Students exploring new languages, developers scaffolding features, freelancers shipping client work and teams standardizing patterns. It's useful whenever you'd rather describe intent than retype boilerplate." },
  { q: "How does it work?", a: "Pick a language, difficulty, framework and style, then describe what you want. The AI returns structured, syntax-highlighted code with optional inline comments you can copy, download or save to your history." },
  { q: "When should developers use an AI code generator?", a: "Reach for it when starting a new module, translating an idea into a first draft, exploring an unfamiliar framework, or generating repetitive glue code so you can focus on architecture and product decisions." },
];

export const Route = createFileRoute("/tools/code-generator")({
  head: () => ({
    meta: [
      { title: "AI Code Generator — Python, React, Node & SQL | CodeMateAI" },
      { name: "description", content: "Generate production-ready code from natural language in Python, JavaScript, TypeScript, Java, Go, React, Node.js, Django, Flutter and SQL — with comments and explanations." },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "AI Code Generator — CodeMateAI" },
      { property: "og:description", content: "Turn plain-English prompts into complete, explained code across 12+ languages and popular frameworks." },
      { property: "og:url", content: CG_URL },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "AI Code Generator — CodeMateAI" },
      { name: "twitter:description", content: "Generate React components, Node.js APIs, Python scripts and SQL queries from natural language." },
    ],
    links: [{ rel: "canonical", href: CG_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "CodeMateAI Code Generator",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: CG_URL,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description: "AI code generator that turns natural language into working code across Python, JavaScript, TypeScript, Java, Go, React, Node.js, Django and SQL.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: CG_FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
    ],
  }),
  component: Page,
});


function Page() {
  const tool = findTool("code-generator")!;
  const { add } = useHistory();
  const { prefs, set, reset } = useToolPreferences("code-generator", {
    language: "JavaScript",
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
            <Button
              variant="ghost"
              size="sm"
              className="h-7 gap-1 text-xs"
              onClick={() => {
                setPrompt("");
                mutation.reset();
                reset();
              }}
            >
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
            <div className="mt-3">
              <div className="mb-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Popular examples
              </div>
              <div className="flex flex-wrap gap-1.5">
                {POPULAR_EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => setPrompt(ex)}
                    className="rounded-full border border-border/60 bg-background/70 px-2.5 py-1 text-[11px] text-muted-foreground transition hover:-translate-y-0.5 hover:bg-background hover:text-foreground"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            </div>
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

      <section aria-labelledby="related-tools" className="mt-12">
        <h2 id="related-tools" className="text-lg font-semibold tracking-tight">Related tools</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Pair the code generator with a reviewer, converter or documentation tool to move faster.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {RELATED_TOOL_IDS.map((id) => {
            const t = TOOLS.find((x) => x.id === id);
            if (!t) return null;
            const Icon = t.icon;
            return (
              <Link
                key={t.id}
                to={t.to}
                className="group flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${t.gradient} text-white`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <div className="text-sm font-medium">{t.title}</div>
                    <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-foreground" />
                  </div>
                  <div className="line-clamp-2 text-xs text-muted-foreground">{t.description}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </ToolPage>
  );
}
