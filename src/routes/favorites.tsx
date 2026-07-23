import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { useHistory } from "@/features/history/useHistory";
import { findTool } from "@/features/tools/registry";
import { AIResponseRenderer } from "@/components/tools/AIResponseRenderer";
import { Button } from "@/components/ui/button";
import { Star, ChevronRight } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites — CodeMateAI" },
      { name: "description", content: "Your bookmarked programs, reviews and projects." },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { entries, toggleFavorite } = useHistory();
  const favs = useMemo(() => entries.filter((e) => e.favorite), [entries]);
  const [open, setOpen] = useState<string | null>(null);
  const active = favs.find((e) => e.id === open);

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Favorites</h1>
        <p className="text-sm text-muted-foreground">
          {favs.length} bookmarked entries.
        </p>
      </header>
      {favs.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-border/60 bg-card/40 p-10 text-center text-sm text-muted-foreground">
          Star an entry from <Link to="/history" className="underline">History</Link> to see it here.
        </div>
      ) : (
        <ul className="divide-y divide-border/60 overflow-hidden rounded-3xl border border-border/60 bg-card/70 backdrop-blur-sm">
          {favs.map((e) => {
            const tool = findTool(e.toolId);
            return (
              <li key={e.id} className="flex items-center gap-3 px-5 py-3 text-sm">
                <button className="flex flex-1 items-center gap-3 text-left" onClick={() => setOpen(e.id)}>
                  {tool && (
                    <div className={`flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br ${tool.gradient} text-white`}>
                      <tool.icon className="h-4 w-4" />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="font-medium">{e.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {tool?.title ?? e.toolId}
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </button>
                <Button size="icon" variant="ghost" className="text-amber-500" onClick={() => toggleFavorite(e.id)}>
                  <Star className="h-4 w-4 fill-current" />
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
