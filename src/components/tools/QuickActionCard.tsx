import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Star } from "lucide-react";
import type { Tool } from "@/features/tools/registry";
import { useFavoriteTools } from "@/features/favorites/useFavoriteTools";

export function QuickActionCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const soon = tool.status === "soon";
  const { isFavoriteTool, toggleTool } = useFavoriteTools();
  const starred = isFavoriteTool(tool.id);
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative flex h-full min-h-[190px] flex-col overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm transition hover:border-violet-500/40 hover:shadow-lg"
    >
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${tool.gradient} opacity-10 blur-2xl transition group-hover:opacity-25`} />
      <button
        type="button"
        aria-label={starred ? `Unstar ${tool.title}` : `Star ${tool.title}`}
        aria-pressed={starred}
        onClick={() => toggleTool(tool.id)}
        className={`absolute right-3 ${soon ? "top-12" : "top-3"} inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition hover:bg-background/70 hover:text-amber-500 ${starred ? "text-amber-500" : ""}`}
      >
        <Star className={starred ? "h-4 w-4 fill-current" : "h-4 w-4"} />
      </button>
      <div className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-white shadow-md`}>
        <Icon className="h-5 w-5" />
      </div>

      <h3 className="mt-4 text-sm font-semibold tracking-tight">{tool.title}</h3>
      <p className="mt-1 line-clamp-3 flex-1 text-xs leading-relaxed text-muted-foreground">{tool.description}</p>

      <Link
        to={tool.to}
        className="mt-4 inline-flex min-h-11 items-center gap-1 text-xs font-medium text-foreground/80 transition group-hover:text-foreground sm:min-h-0"
      >
        {soon ? "Preview" : "Launch"} <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
      </Link>

      {soon && (
        <span className="absolute right-4 top-4 rounded-full border border-border/60 bg-background/80 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Soon
        </span>
      )}
    </motion.div>
  );
}
