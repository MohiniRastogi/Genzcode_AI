import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import type { Tool } from "@/features/tools/registry";

export function QuickActionCard({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  const soon = tool.status === "soon";
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm transition hover:shadow-lg"
    >
      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${tool.gradient} opacity-10 blur-2xl transition group-hover:opacity-25`} />
      <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} text-white shadow-md`}>
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 text-sm font-semibold tracking-tight">{tool.title}</h3>
      <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{tool.description}</p>
      <Link
        to={tool.to}
        className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition group-hover:text-foreground"
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
