import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ChevronDown, Sparkles, Code2, Wrench, Clock } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { TOOLS, type Tool } from "@/features/tools/registry";

type SectionKey = "AI Coding" | "Development" | "Utilities" | "Coming Soon";

const SECTION_ICONS: Record<SectionKey, typeof Sparkles> = {
  "AI Coding": Sparkles,
  Development: Code2,
  Utilities: Wrench,
  "Coming Soon": Clock,
};

function sectionOf(tool: Tool): SectionKey {
  if (tool.status === "soon") return "Coming Soon";
  if (tool.category === "AI Tools" || tool.category === "Review") return "AI Coding";
  if (tool.category === "Generators" || tool.category === "Converters") return "Development";
  return "Utilities";
}

const SECTION_ORDER: SectionKey[] = ["AI Coding", "Development", "Utilities", "Coming Soon"];

const ALIASES: Record<string, string> = {
  "code-generator": "python javascript typescript react vue nextjs node java go rust",
  "code-reviewer": "review lint quality security pr pull request",
  "bug-solver": "debug error stack trace fix crash",
  "code-converter": "translate migrate java python javascript typescript",
  "api-generator": "rest express fastapi flask django spring node endpoint",
  "sql-generator": "postgres postgresql mysql sqlite mssql query database",
  "regex-generator": "regex regular expression pattern",
  "readme-generator": "readme markdown docs",
  "documentation-generator": "docs jsdoc docstring javadoc",
  "json-formatter": "json format validate minify",
  "jwt-decoder": "jwt token auth",
  base64: "base64 encode decode",
};

export function ToolsMenu() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const grouped = SECTION_ORDER.map((section) => ({
    section,
    items: TOOLS.filter((t) => sectionOf(t) === section),
  })).filter((g) => g.items.length);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="hidden sm:inline-flex items-center gap-1.5 rounded-2xl border border-border/60 bg-background/60 px-3 py-1.5 text-xs font-medium text-foreground/80 backdrop-blur-sm transition hover:bg-background"
          aria-label="Browse tools by category"
        >
          <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
          Tools
          <ChevronDown
            className={"h-3.5 w-3.5 transition-transform " + (open ? "rotate-180" : "")}
            aria-hidden="true"
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        sideOffset={8}
        className="w-[min(92vw,540px)] p-0 shadow-xl"
      >
        <Command
          filter={(value, search) => {
            if (!search) return 1;
            return value.toLowerCase().includes(search.toLowerCase()) ? 1 : 0;
          }}
        >
          <CommandInput placeholder="Search by tool, language or framework…" />
          <CommandList className="max-h-[420px]">
            <CommandEmpty>No tool found.</CommandEmpty>
            {grouped.map(({ section, items }) => {
              const SectionIcon = SECTION_ICONS[section];
              return (
                <CommandGroup
                  key={section}
                  heading={
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      <SectionIcon className="h-3 w-3" aria-hidden="true" />
                      {section}
                    </span>
                  }
                >
                  {items.map((t) => (
                    <CommandItem
                      key={t.id}
                      value={`${t.title} ${t.description} ${ALIASES[t.id] ?? ""}`}
                      onSelect={() => {
                        setOpen(false);
                        navigate({ to: t.to });
                      }}
                      className="gap-3 py-2"
                    >
                      <span
                        className={`inline-flex h-7 w-7 flex-none items-center justify-center rounded-lg bg-gradient-to-br ${t.gradient} text-white shadow-sm`}
                      >
                        <t.icon className="h-3.5 w-3.5" aria-hidden="true" />
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">{t.title}</span>
                        <span className="truncate text-[11px] text-muted-foreground">
                          {t.description}
                        </span>
                      </span>
                      {t.status === "soon" && (
                        <span className="ml-auto rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                          Soon
                        </span>
                      )}
                    </CommandItem>
                  ))}
                </CommandGroup>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
