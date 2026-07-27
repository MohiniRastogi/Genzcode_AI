import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Sparkles,
  ShieldCheck,
  Save,
  FolderCode,
  Star,
  TrendingUp,
  Pin,
  ChevronRight,
} from "lucide-react";
import { StatCard } from "@/components/tools/StatCard";
import { QuickActionCard } from "@/components/tools/QuickActionCard";
import { TOOLS } from "@/features/tools/registry";
import { useHistory, useHistoryStats } from "@/features/history/useHistory";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "Dashboard — CodeMateAI" },
      {
        name: "description",
        content:
          "Your CodeMateAI workspace: recent activity, pinned tools, trending AI utilities and quick access to every generator.",
      },
      { property: "og:title", content: "Dashboard — CodeMateAI" },
      {
        property: "og:description",
        content:
          "Your personal AI coding workspace with recent activity, pinned favorites and every tool one click away.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: DashboardPage,
});

function DashboardPage() {
  const stats = useHistoryStats();
  const { entries, toggleFavorite } = useHistory();
  const featured = TOOLS.filter((t) => t.status === "ready").slice(0, 12);
  const recent = entries.slice(0, 5);
  const trending = TOOLS.filter((t) => t.status === "ready").slice(0, 6);
  const pinned = entries.filter((e) => e.favorite).slice(0, 4);
  const usageByTool = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.toolId] = (acc[e.toolId] ?? 0) + 1;
    return acc;
  }, {});
  const popular = [...TOOLS]
    .filter((t) => t.status === "ready")
    .sort((a, b) => (usageByTool[b.id] ?? 0) - (usageByTool[a.id] ?? 0))
    .slice(0, 4);
  const continueWorking = recent[0];

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      <header className="mb-8">
        <p className="text-xs font-medium uppercase tracking-wider text-violet-600">
          Workspace
        </p>
        <h1 className="mt-1 text-3xl font-semibold tracking-tight sm:text-4xl">
          Your dashboard
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Pick up where you left off, jump into a pinned favorite, or launch any of the AI
          tools in one click.
        </p>
      </header>

      {/* Stats */}
      <section className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Today's AI requests" value={stats.today} icon={Activity} gradient="from-indigo-500 to-violet-500" />
        <StatCard label="Programs generated" value={stats.byTool("code-generator")} icon={Sparkles} gradient="from-fuchsia-500 to-pink-500" />
        <StatCard label="Code reviews" value={stats.byTool("code-reviewer")} icon={ShieldCheck} gradient="from-emerald-500 to-teal-500" />
        <StatCard label="Bugs solved" value={stats.byTool("bug-solver")} icon={FolderCode} gradient="from-rose-500 to-red-500" />
        <StatCard label="Saved snippets" value={stats.favorites} icon={Star} gradient="from-amber-500 to-orange-500" />
        <StatCard label="Total runs" value={stats.total} icon={Save} gradient="from-cyan-500 to-blue-500" />
      </section>

      {/* Continue working */}
      {continueWorking && (
        <section className="mb-10">
          <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-indigo-50 via-white to-fuchsia-50 p-5 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="min-w-0">
                <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Continue working
                </div>
                <div className="mt-1 truncate text-sm font-semibold">
                  {continueWorking.title}
                </div>
                <div className="mt-0.5 truncate text-xs text-muted-foreground">
                  {continueWorking.input.slice(0, 120)}
                </div>
              </div>
              <Link
                to="/history"
                className="inline-flex items-center gap-1 rounded-2xl bg-foreground px-4 py-2 text-xs font-medium text-background transition hover:opacity-90"
              >
                Resume <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Trending / Popular / Pinned */}
      <section className="mb-14 grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <TrendingUp className="h-4 w-4 text-rose-500" /> Trending tools
          </div>
          <ul className="mt-3 space-y-2">
            {trending.map((t) => (
              <li key={t.id}>
                <Link to={t.to} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm transition hover:bg-muted/50">
                  <span className="truncate">{t.title}</span>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Star className="h-4 w-4 text-amber-500" /> Popular for you
          </div>
          <ul className="mt-3 space-y-2">
            {popular.map((t) => (
              <li key={t.id}>
                <Link to={t.to} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm transition hover:bg-muted/50">
                  <span className="truncate">{t.title}</span>
                  <span className="text-[11px] text-muted-foreground">
                    {usageByTool[t.id] ?? 0} runs
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Pin className="h-4 w-4 text-indigo-500" /> Pinned favorites
          </div>
          {pinned.length === 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              Star any result to pin it here for one-click access.
            </p>
          ) : (
            <ul className="mt-3 space-y-2">
              {pinned.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-2">
                  <button
                    onClick={() => toggleFavorite(p.id)}
                    className="truncate text-left text-sm hover:text-foreground"
                  >
                    {p.title}
                  </button>
                  <span className="text-[11px] text-muted-foreground">
                    {new Date(p.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Quick launch */}
      <section className="mb-14">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Quick launch</h2>
          <span className="text-xs text-muted-foreground">{TOOLS.length} tools available</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((t) => (
            <QuickActionCard key={t.id} tool={t} />
          ))}
        </div>
      </section>
    </div>
  );
}
