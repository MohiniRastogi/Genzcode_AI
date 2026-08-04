import { useEffect, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Search } from "lucide-react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TOOLS, CATEGORIES } from "@/features/tools/registry";

// Aliases so typing a language / tech / framework surfaces the right tool.
const TOOL_ALIASES: Record<string, string> = {
  "code-generator": "python javascript typescript react vue nextjs node java go rust php ruby swift kotlin function component",
  "code-reviewer": "review lint quality security readability performance pull request pr",
  "bug-solver": "debug error exception stack trace fix crash",
  "code-converter": "translate migrate java python javascript typescript go rust c# php",
  "api-generator": "rest express fastapi flask django spring boot node backend endpoint jwt swagger",
  "sql-generator": "postgres postgresql mysql sqlite mssql query database join",
  "regex-generator": "regex regular expression pattern match validate",
  "readme-generator": "readme markdown documentation project",
  "documentation-generator": "docs jsdoc docstring javadoc api documentation",
  "json-formatter": "json format validate minify",
  "jwt-decoder": "jwt token auth decode header payload",
  "base64": "base64 encode decode",
};

export function GlobalSearch({
  fullWidth = false,
  iconOnly = false,
}: { fullWidth?: boolean; iconOnly?: boolean } = {}) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (e.key === "/" && document.activeElement instanceof HTMLElement) {
          const tag = document.activeElement.tagName;
          if (tag === "INPUT" || tag === "TEXTAREA") return;
        }
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Search tools"
        title="Search tools (⌘K)"
        className={
          iconOnly
            ? "inline-flex h-[38px] w-[38px] items-center justify-center rounded-full border border-border bg-transparent text-foreground/80 transition hover:bg-accent hover:text-foreground"
            : fullWidth
              ? "flex min-h-11 w-full items-center gap-2 rounded-lg border border-border bg-transparent px-3 py-2 text-sm text-muted-foreground transition hover:bg-accent"
              : "inline-flex h-[38px] items-center gap-2 rounded-lg border border-border bg-transparent px-3 text-sm text-muted-foreground transition hover:bg-accent"
        }
      >
        <Search className="h-4 w-4" />
        {!iconOnly && (
          <>
            <span className={fullWidth ? "inline" : "hidden sm:inline"}>Search tools…</span>
            <kbd className="ml-auto hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
              ⌘K
            </kbd>
          </>
        )}
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search by tool, language, framework — python, react, sql…" />
        <CommandList>
          <CommandEmpty>No tool found.</CommandEmpty>
          {CATEGORIES.map((cat) => {
            const items = TOOLS.filter((t) => t.category === cat);
            if (!items.length) return null;
            return (
              <CommandGroup key={cat} heading={cat}>
                {items.map((t) => (
                  <CommandItem
                    key={t.id}
                    value={`${t.title} ${t.description} ${TOOL_ALIASES[t.id] ?? ""}`}
                    keywords={(TOOL_ALIASES[t.id] ?? "").split(" ").filter(Boolean)}
                    onSelect={() => {
                      setOpen(false);
                      navigate({ to: t.to });
                    }}
                  >
                    <t.icon className="mr-2 h-4 w-4" />
                    <span>{t.title}</span>
                    {t.status === "soon" && (
                      <span className="ml-auto text-[10px] uppercase text-muted-foreground">
                        soon
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
}
