import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Activity,
  Sparkles,
  ShieldCheck,
  Save,
  FolderCode,
  Star,
} from "lucide-react";
import { StatCard } from "@/components/tools/StatCard";
import { QuickActionCard } from "@/components/tools/QuickActionCard";
import { TOOLS } from "@/features/tools/registry";
import { useHistory, useHistoryStats } from "@/features/history/useHistory";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — CodeMateAI" },
      {
        name: "description",
        content:
          "Your AI developer command center — code generation, review, debugging, conversion and utilities.",
      },
      { property: "og:title", content: "CodeMateAI Dashboard" },
      {
        property: "og:description",
        content: "Every AI dev tool in one polished workspace.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const stats = useHistoryStats();
  const { entries } = useHistory();
  const featured = TOOLS.slice(0, 12);
  const recent = entries.slice(0, 5);

  return (
    <div className="mx-auto w-full max-w-7xl px-6 py-8">
      {/* Hero */}
      <section className="relative mb-10 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-white via-white to-[oklch(0.97_0.02_290)] p-8 shadow-sm">
        <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-20 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-64 w-64 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-10 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
            <Sparkles className="h-3.5 w-3.5 text-violet-500" />
            Powered by Lovable AI
          </div>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight sm:text-5xl">
            The AI toolkit for
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
              {" "}modern developers.
            </span>
          </h1>
          <p className="mt-3 max-w-xl text-sm text-muted-foreground">
            Generate. Review. Convert. Optimize. Learn. Thirty+ tools, one polished
            workspace.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            <Link
              to="/tools/code-generator"
              className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
            >
              <Sparkles className="h-4 w-4" /> Launch Code Generator
            </Link>
            <Link
              to="/tools/code-reviewer"
              className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-background"
            >
              <ShieldCheck className="h-4 w-4" /> Review My Code
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
        <StatCard
          label="Today's AI Requests"
          value={stats.today}
          icon={Activity}
          gradient="from-indigo-500 to-violet-500"
        />
        <StatCard
          label="Programs Generated"
          value={stats.byTool("code-generator")}
          icon={Sparkles}
          gradient="from-fuchsia-500 to-pink-500"
        />
        <StatCard
          label="Code Reviews"
          value={stats.byTool("code-reviewer")}
          icon={ShieldCheck}
          gradient="from-emerald-500 to-teal-500"
        />
        <StatCard
          label="Bugs Solved"
          value={stats.byTool("bug-solver")}
          icon={FolderCode}
          gradient="from-rose-500 to-red-500"
        />
        <StatCard
          label="Saved Snippets"
          value={stats.favorites}
          icon={Star}
          gradient="from-amber-500 to-orange-500"
        />
        <StatCard
          label="Total Runs"
          value={stats.total}
          icon={Save}
          gradient="from-cyan-500 to-blue-500"
        />
      </section>

      {/* Quick actions */}
      <section className="mb-10">
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Quick actions</h2>
          <span className="text-xs text-muted-foreground">
            {TOOLS.length} tools available
          </span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {featured.map((t) => (
            <QuickActionCard key={t.id} tool={t} />
          ))}
        </div>
      </section>

      {/* Recent activity */}
      <section>
        <div className="mb-4 flex items-baseline justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent activity</h2>
          <Link to="/history" className="text-xs text-muted-foreground hover:text-foreground">
            View all →
          </Link>
        </div>
        <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur-sm">
          {recent.length === 0 ? (
            <div className="px-6 py-10 text-center text-sm text-muted-foreground">
              Nothing yet. Launch a tool above to get started.
            </div>
          ) : (
            <ul className="divide-y divide-border/60">
              {recent.map((e) => (
                <li key={e.id} className="flex items-center justify-between px-6 py-3 text-sm">
                  <div className="min-w-0">
                    <div className="font-medium">{e.title}</div>
                    <div className="truncate text-xs text-muted-foreground">
                      {e.input.slice(0, 80)}
                    </div>
                  </div>
                  <div className="ml-4 text-xs text-muted-foreground">
                    {new Date(e.createdAt).toLocaleString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </div>
  );
}
