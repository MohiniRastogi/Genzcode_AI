import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Star, ChevronRight, Sparkles, LayoutDashboard } from "lucide-react";
import { useHistory } from "@/features/history/useHistory";
import { useFavoriteTools } from "@/features/favorites/useFavoriteTools";
import { findTool, TOOLS } from "@/features/tools/registry";
import { AIResponseRenderer } from "@/components/tools/AIResponseRenderer";
import { ResultActions } from "@/components/tools/ResultActions";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — CodeMateAI" },
      {
        name: "description",
        content:
          "Every result and tool you have starred in CodeMateAI, in one place — preview, reopen or unstar them instantly.",
      },
      { property: "og:title", content: "Favorites — CodeMateAI" },
      {
        property: "og:description",
        content: "Your starred code snippets, READMEs, regex patterns and favorite AI tools.",
      },
    ],
  }),
  component: FavoritesPage,
});

const TYPE_LABELS: Record<string, string> = {
  "code-generator": "Code Snippet",
  "code-reviewer": "Code Review",
  "bug-solver": "Bug Fix",
  "code-converter": "Converted Code",
  "documentation-generator": "Documentation",
  "readme-generator": "README",
  "regex-generator": "Regex Pattern",
  "sql-generator": "SQL Query",
  "api-generator": "API Code",
};

function typeLabel(toolId: string) {
  return TYPE_LABELS[toolId] ?? "Result";
}

function preview(text: string) {
  return text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#*`>_-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

function timeAgo(ts: number) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(ts).toLocaleDateString();
}

function FavoritesPage() {
  const { entries, toggleFavorite } = useHistory();
  const { toolIds, toggleTool } = useFavoriteTools();
  const favs = useMemo(() => entries.filter((e) => e.favorite), [entries]);
  const favTools = useMemo(
    () => toolIds.map((id) => TOOLS.find((t) => t.id === id)).filter((t) => !!t),
    [toolIds],
  );
  const [open, setOpen] = useState<string | null>(null);
  const active = favs.find((e) => e.id === open) ?? null;
  const empty = favs.length === 0 && favTools.length === 0;

  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Favorites</h1>
          <p className="text-sm text-muted-foreground">
            {favs.length} saved {favs.length === 1 ? "result" : "results"} · {favTools.length}{" "}
            starred {favTools.length === 1 ? "tool" : "tools"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild size="sm" variant="outline" className="rounded-2xl">
            <Link to="/dashboard">
              <LayoutDashboard className="h-4 w-4" /> Dashboard
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-2xl">
            <Link to="/history">History</Link>
          </Button>
        </div>
      </header>

      {empty ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-12 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-500 text-white">
            <Star className="h-5 w-5" />
          </div>
          <h2 className="mt-4 text-base font-semibold">Nothing starred yet</h2>
          <p className="mx-auto mt-1 max-w-md text-sm text-muted-foreground">
            Star a generated result or a tool card and it will show up here for one-click access.
          </p>
          <Button asChild className="mt-5 rounded-2xl">
            <Link to="/dashboard">
              <Sparkles className="h-4 w-4" /> Browse the tools
            </Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-10">
          {favTools.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-tight">Starred tools</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favTools.map((t) => (
                  <div
                    key={t.id}
                    className="relative flex flex-col rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm"
                  >
                    <div
                      className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${t.gradient} text-white`}
                    >
                      <t.icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-3 text-sm font-semibold">{t.title}</h3>
                    <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                      {t.description}
                    </p>
                    <Link
                      to={t.to}
                      className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 hover:text-foreground"
                    >
                      Launch <ChevronRight className="h-3.5 w-3.5" />
                    </Link>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Unstar ${t.title}`}
                      className="absolute right-3 top-3 text-amber-500"
                      onClick={() => toggleTool(t.id)}
                    >
                      <Star className="h-4 w-4 fill-current" />
                    </Button>
                  </div>
                ))}
              </div>
            </section>
          )}

          {favs.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-semibold tracking-tight">Saved results</h2>
              <ul className="divide-y divide-border/60 overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur-sm">
                {favs.map((e) => {
                  const tool = findTool(e.toolId);
                  return (
                    <li key={e.id} className="flex items-center gap-3 px-5 py-4 text-sm">
                      <button
                        className="flex flex-1 items-center gap-3 text-left"
                        onClick={() => setOpen(e.id)}
                      >
                        {tool && (
                          <div
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white`}
                          >
                            <tool.icon className="h-4 w-4" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-full border border-border/60 bg-background/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                              {typeLabel(e.toolId)}
                            </span>
                            <span className="truncate font-medium">{e.title}</span>
                          </div>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {preview(e.output) || "No preview available"}
                          </p>
                          <div className="mt-1 text-[11px] text-muted-foreground">
                            {tool?.title ?? e.toolId} · {timeAgo(e.createdAt)}
                          </div>
                        </div>
                        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                      </button>
                      <Button
                        size="icon"
                        variant="ghost"
                        aria-label="Remove from favorites"
                        className="text-amber-500"
                        onClick={() => toggleFavorite(e.id)}
                      >
                        <Star className="h-4 w-4 fill-current" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>
      )}

      <Dialog open={!!open} onOpenChange={(o) => !o && setOpen(null)}>
        <DialogContent className="max-h-[85vh] max-w-3xl overflow-auto">
          <DialogHeader>
            <DialogTitle>{active?.title}</DialogTitle>
          </DialogHeader>
          {active && (
            <>
              <div className="flex flex-wrap items-center gap-1.5">
                <ResultActions content={active.output} baseName={`${active.toolId}.md`} />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    toggleFavorite(active.id);
                    setOpen(null);
                  }}
                >
                  <Star className="h-4 w-4 fill-current text-amber-500" /> Unstar
                </Button>
              </div>
              <AIResponseRenderer content={active.output} />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
