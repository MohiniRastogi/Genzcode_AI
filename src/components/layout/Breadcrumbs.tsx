import { Link, useRouterState } from "@tanstack/react-router";
import { ChevronRight, Home } from "lucide-react";
import { findTool } from "@/features/tools/registry";

const STATIC_LABELS: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/history": "History",
  "/favorites": "Favorites",
  "/settings": "Settings",
};

function humanize(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function labelFor(pathname: string): string | null {
  if (STATIC_LABELS[pathname]) return STATIC_LABELS[pathname];
  const toolMatch = pathname.match(/^\/tools\/(.+)$/);
  if (toolMatch) return findTool(toolMatch[1])?.title ?? humanize(toolMatch[1]);
  const utilMatch = pathname.match(/^\/utilities\/(.+)$/);
  if (utilMatch) return findTool(utilMatch[1])?.title ?? humanize(utilMatch[1]);
  return null;
}

export function Breadcrumbs() {
  const pathname = useRouterState({ select: (r) => r.location.pathname });
  if (pathname === "/") return null;
  const label = labelFor(pathname);
  if (!label) return null;

  return (
    <nav aria-label="Breadcrumb" className="mx-auto w-full max-w-7xl px-6 pt-4">
      <ol className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <li>
          <Link
            to="/"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 transition hover:bg-muted/60 hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Home</span>
          </Link>
        </li>
        <li aria-hidden="true">
          <ChevronRight className="h-3.5 w-3.5" />
        </li>
        <li aria-current="page" className="font-medium text-foreground">
          {label}
        </li>
      </ol>
    </nav>
  );
}
