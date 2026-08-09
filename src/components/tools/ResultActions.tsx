import { Copy, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { buildExport, downloadAs, type ExportExt } from "@/lib/export";

const FORMATS: { ext: ExportExt; label: string }[] = [
  { ext: "md", label: "Markdown (.md)" },
  { ext: "txt", label: "Plain text (.txt)" },
  { ext: "json", label: "JSON (.json)" },
  { ext: "sql", label: "SQL (.sql)" },
];

interface Props {
  /** Raw result content (markdown for AI tools, plain text for utilities). */
  content: string;
  /** Base filename without extension. */
  baseName: string;
  size?: "sm" | "default";
  /** When false, content is exported as-is instead of being parsed as markdown. */
  markdown?: boolean;
}

/** Copy + multi-format download actions for a tool result. */
export function ResultActions({ content, baseName, size = "sm", markdown = true }: Props) {
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Could not copy");
    }
  };

  return (
    <>
      <Button size={size} variant="ghost" onClick={copy} disabled={!content}>
        <Copy className="h-4 w-4" /> Copy
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={size} variant="ghost" disabled={!content}>
            <Download className="h-4 w-4" /> Download
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel className="text-xs">Export as</DropdownMenuLabel>
          {FORMATS.map((f) => (
            <DropdownMenuItem
              key={f.ext}
              className="text-xs"
              onSelect={() => {
                downloadAs(markdown ? buildExport(content, f.ext) : content, baseName, f.ext);
                toast.success(`Downloaded .${f.ext}`);
              }}
            >
              {f.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
