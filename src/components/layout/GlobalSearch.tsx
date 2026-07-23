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

export function GlobalSearch() {
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
        className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/60 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-sm transition hover:bg-background"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Search tools…</span>
        <kbd className="ml-2 hidden rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] sm:inline">
          ⌘K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search 30+ developer tools…" />
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
                    value={`${t.title} ${t.description}`}
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
