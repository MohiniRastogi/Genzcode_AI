import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHistory } from "@/features/history/useHistory";
import { findTool, TOOLS } from "@/features/tools/registry";
import { AIResponseRenderer } from "@/components/tools/AIResponseRenderer";
import { Star, Trash2, ChevronRight, Search, ArrowLeft, Home } from "lucide-react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: "History — CodeMateAI" },
      { name: "description", content: "Every generation, review and fix — searchable and reusable." },
    ],
  }),
  component: HistoryPage,
});

const QUICK_ACTION_IDS = [
  "code-generator",
  "code-reviewer",
  "code-converter",
  "sql-generator",
  "api-generator",
  "readme-generator",
];

function HistoryPage() {
  const { entries, remove, toggleFavorite, clear } = useHistory();
  const [q, setQ] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const filtered = useMemo(
    () =>
      entries.filter((e) =>
        (e.title + " " + e.input + " " + e.toolId).toLowerCase().includes(q.toLowerCase()),
      ),
    [entries, q],
  );

  const active = filtered.find((e) => e.id === open);
  const quickActions = QUICK_ACTION_IDS
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter((t): t is NonNullable<typeof t> => !!t);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button asChild variant="outline" size="sm">
          <Link to="/dashboard">
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </Button>
        <Button asChild variant="ghost" size="sm">
          <Link to="/">
            <Home className="h-4 w-4" /> Home
          </Link>
        </Button>
      </div>
      <header className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">History</h1>
          <p className="text-sm text-muted-foreground">
            {entries.length} entries stored locally in your browser.
          </p>
        </div>
        {entries.length > 0 && (
          <Button variant="outline" size="sm" onClick={clear}>
            <Trash2 className="h-4 w-4" /> Clear all
          </Button>
        )}
      </header>
      {entries.length > 0 && (
        <div className="mb-4 flex items-center gap-2 rounded-2xl border border-border/60 bg-card/70 px-3 py-2 backdrop-blur-sm">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search history…"
            className="border-0 bg-transparent shadow-none focus-visible:ring-0"
          />
        </div>
      )}
      {entries.length === 0 ? (
        <div className="space-y-6">
          <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center">
            <p className="text-sm font-medium text-foreground">No recent activity yet.</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Anything you generate will appear here automatically.
            </p>
          </div>
          <div>
            <h2 className="mb-3 text-sm font-semibold text-foreground">Quick actions</h2>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {quickActions.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Link
                    key={tool.id}
                    to={tool.to}
                    className="group flex items-start gap-3 rounded-2xl border border-border/60 bg-card/70 p-4 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium">{tool.title}</div>
                      <div className="line-clamp-2 text-xs text-muted-foreground">{tool.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
          No results for “{q}”.
        </div>
      ) : (
        <ul className="divide-y divide-border/60 overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur-sm">
          {filtered.map((e) => {
            const tool = findTool(e.toolId);
            return (
              <li key={e.id} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
                <button className="flex flex-1 items-center gap-3 text-left" onClick={() => setOpen(e.id)}>
                  {tool && (
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white`}>
                      <tool.icon className="h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{e.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {tool?.title ?? e.toolId} · {new Date(e.createdAt).toLocaleString()}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => toggleFavorite(e.id)}
                  className={e.favorite ? "text-amber-500" : ""}
                >
                  <Star className={e.favorite ? "h-4 w-4 fill-current" : "h-4 w-4"} />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => remove(e.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            );
          })}
        </ul>
      )}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-auto">
          <DialogHeader>
            <DialogTitle>{active?.title}</DialogTitle>
          </DialogHeader>
          {active && <AIResponseRenderer content={active.output} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}
