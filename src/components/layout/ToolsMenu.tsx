import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Wrench } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TOOLS } from "@/features/tools/registry";

// Most frequently used tools, surfaced directly in the nav dropdown.
const FEATURED_IDS = [
  "code-generator",
  "code-reviewer",
  "bug-solver",
  "api-generator",
  "sql-generator",
];

export function ToolsMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const featured = FEATURED_IDS.map((id) => TOOLS.find((t) => t.id === id)).filter(
    (t): t is (typeof TOOLS)[number] => Boolean(t),
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          aria-label="Browse tools"
          className="inline-flex h-[38px] items-center gap-1.5 rounded-lg border border-border bg-transparent px-3 text-sm font-medium text-foreground/80 transition hover:bg-accent hover:text-foreground"
        >
          <Wrench className="h-4 w-4" aria-hidden="true" />
          Tools
          <ChevronDown
            className={"h-4 w-4 transition-transform " + (open ? "rotate-180" : "")}
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[min(92vw,320px)] rounded-lg border border-border bg-popover p-0 shadow-none"
      >
        <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          Indexed tools
        </p>
        <ul>
          {featured.map((t) => (
            <li key={t.id} className="border-t border-border/60">
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  navigate({ to: t.to });
                }}
                className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-foreground transition hover:bg-accent"
              >
                <t.icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                <span className="truncate">{t.title}</span>
              </button>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
