import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { ChevronDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TOOLS } from "@/features/tools/registry";

type Category = { label: string; ids: string[] };

const CATEGORIES: Category[] = [
  {
    label: "AI Coding",
    ids: ["code-generator", "code-reviewer", "bug-solver", "code-converter"],
  },
  {
    label: "Generators",
    ids: [
      "documentation-generator",
      "regex-generator",
      "sql-generator",
      "api-generator",
      "readme-generator",
    ],
  },
  {
    label: "Utilities",
    ids: ["live-console", "json-formatter", "base64", "jwt-decoder"],
  },
];

const triggerClass =
  "inline-flex h-[38px] items-center gap-1.5 rounded-lg border border-border bg-transparent px-3 text-sm font-medium text-foreground/80 transition hover:bg-accent hover:text-foreground";

function toolsFor(ids: string[]) {
  return ids
    .map((id) => TOOLS.find((t) => t.id === id))
    .filter((t): t is (typeof TOOLS)[number] => Boolean(t));
}

function ToolRows({
  ids,
  onNavigate,
  heading,
}: {
  ids: string[];
  onNavigate: () => void;
  heading?: string;
}) {
  const navigate = useNavigate();
  return (
    <>
      {heading ? (
        <p className="px-3 py-2 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {heading}
        </p>
      ) : null}
      <ul>
        {toolsFor(ids).map((t) => (
          <li key={t.id} className="border-t border-border/60">
            <button
              type="button"
              onClick={() => {
                onNavigate();
                navigate({ to: t.to });
              }}
              className="flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-sm text-foreground transition hover:bg-accent"
            >
              <t.icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate">{t.title}</span>
              {t.status === "soon" ? (
                <span className="ml-auto shrink-0 rounded-md border border-border px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  Soon
                </span>
              ) : null}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

function CategoryDropdown({ category }: { category: Category }) {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" aria-label={`${category.label} tools`} className={triggerClass}>
          {category.label}
          <ChevronDown
            className={"h-4 w-4 transition-transform " + (open ? "rotate-180" : "")}
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-[min(92vw,300px)] rounded-lg border border-border bg-popover p-0 shadow-none"
      >
        <ToolRows ids={category.ids} onNavigate={() => setOpen(false)} heading={category.label} />
      </PopoverContent>
    </Popover>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Menu" className={triggerClass}>
          Menu
          <ChevronDown
            className={"h-4 w-4 transition-transform " + (open ? "rotate-180" : "")}
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="max-h-[70vh] w-[min(92vw,300px)] overflow-auto rounded-lg border border-border bg-popover p-0 shadow-none"
      >
        {CATEGORIES.map((c) => (
          <ToolRows key={c.label} ids={c.ids} heading={c.label} onNavigate={() => setOpen(false)} />
        ))}
        <div className="border-t border-border/60">
          <Link
            to="/dashboard"
            onClick={() => setOpen(false)}
            className="block px-3 py-2.5 text-sm text-foreground transition hover:bg-accent"
          >
            All tools
          </Link>
          <Link
            to="/favorites"
            onClick={() => setOpen(false)}
            className="block border-t border-border/60 px-3 py-2.5 text-sm text-foreground transition hover:bg-accent"
          >
            Favorites
          </Link>
        </div>
      </PopoverContent>
    </Popover>
  );
}

export function ToolsMenu() {
  return (
    <nav aria-label="Tool categories" className="flex min-w-0 items-center gap-2">
      <div className="hidden items-center gap-2 lg:flex">
        {CATEGORIES.map((c) => (
          <CategoryDropdown key={c.label} category={c} />
        ))}
        <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />
        <Link
          to="/dashboard"
          className="text-sm font-medium text-foreground/80 transition hover:text-foreground"
        >
          All tools
        </Link>
        <Link
          to="/favorites"
          className="text-sm font-medium text-foreground/80 transition hover:text-foreground"
        >
          Favorites
        </Link>
      </div>
      <div className="lg:hidden">
        <MobileMenu />
      </div>
    </nav>
  );
}
