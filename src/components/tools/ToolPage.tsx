import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";
import type { Tool } from "@/features/tools/registry";

interface Props {
  tool: Tool;
  children: ReactNode;
}

export function ToolPage({ tool, children }: Props) {
  const Icon = tool.icon;
  return (
    <div className="mx-auto w-full max-w-6xl px-6 py-8">
      <nav className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span>{tool.category}</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{tool.title}</span>
      </nav>
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="mb-8 flex items-start gap-4"
      >
        <div
          className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${tool.gradient} shadow-lg shadow-black/5`}
        >
          <Icon className="h-7 w-7 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{tool.title}</h1>
          <p className="mt-1 text-sm text-muted-foreground">{tool.description}</p>
        </div>
      </motion.header>
      {children}
    </div>
  );
}
