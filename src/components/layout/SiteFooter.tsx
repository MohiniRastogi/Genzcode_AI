import { Link } from "@tanstack/react-router";
import { Sparkles } from "lucide-react";

const columns: { title: string; links: { label: string; to: string }[] }[] = [
  {
    title: "AI Coding",
    links: [
      { label: "Code Generator", to: "/tools/code-generator" },
      { label: "Code Reviewer", to: "/tools/code-reviewer" },
      { label: "Bug Solver", to: "/tools/bug-solver" },
      { label: "Code Converter", to: "/tools/code-converter" },
    ],
  },
  {
    title: "Generators",
    links: [
      { label: "Regex Generator", to: "/tools/regex-generator" },
      { label: "SQL Generator", to: "/tools/sql-generator" },
      { label: "API Generator", to: "/tools/api-generator" },
      { label: "README Generator", to: "/tools/readme-generator" },
      { label: "Documentation Generator", to: "/tools/documentation-generator" },
    ],
  },
  {
    title: "Utilities",
    links: [
      { label: "JSON Formatter", to: "/utilities/json-formatter" },
      { label: "JWT Decoder", to: "/utilities/jwt-decoder" },
      { label: "Base64 Encoder", to: "/utilities/base64" },
    ],
  },
  {
    title: "Workspace",
    links: [
      { label: "History", to: "/history" },
      { label: "Favorites", to: "/favorites" },
      { label: "Settings", to: "/settings" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 bg-gradient-to-b from-background to-[oklch(0.97_0.01_260)]">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="text-sm font-semibold tracking-tight">CodeMateAI</span>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              A polished AI developer platform for building, reviewing, converting and
              documenting code — all in one dashboard.
            </p>
          </div>
          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {col.title}
              </h4>
              <ul className="mt-3 space-y-2">
                {col.links.map((l) => (
                  <li key={l.to}>
                    <Link
                      to={l.to}
                      className="text-sm text-foreground/80 transition hover:text-foreground"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-border/60 pt-6 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} CodeMateAI. All rights reserved.</p>
          <p>
            Created by <span className="font-medium text-foreground">Mohini Rastogi</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
