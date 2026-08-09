/** Shared helpers for copying and exporting tool results. */

export type ExportExt = "md" | "txt" | "json" | "sql";

const MIME: Record<ExportExt, string> = {
  md: "text/markdown",
  txt: "text/plain",
  json: "application/json",
  sql: "application/sql",
};

/** Strips a file extension from a base name. */
function stripExt(name: string) {
  return name.replace(/\.[a-z0-9]+$/i, "");
}

/** Triggers a browser download of `content` as `<baseName>.<ext>`. */
export function downloadAs(content: string, baseName: string, ext: ExportExt) {
  const blob = new Blob([content], { type: `${MIME[ext]};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${stripExt(baseName)}.${ext}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

/** Returns the first fenced code block matching `lang` (or any block). */
export function extractCodeBlock(markdown: string, lang?: string): string | null {
  const re = lang
    ? new RegExp("```" + lang + "[^\\n]*\\n([\\s\\S]*?)```", "i")
    : /```[^\n]*\n([\s\S]*?)```/;
  const m = markdown.match(re);
  return m ? m[1].trim() : null;
}

/** Markdown with fences/headings removed — good enough for a .txt export. */
export function toPlainText(markdown: string): string {
  return markdown
    .replace(/```[^\n]*\n?/g, "")
    .replace(/^#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .trim();
}

/**
 * Builds the payload for a given export format from a markdown result.
 * Falls back to a JSON envelope / the raw markdown when no matching block exists.
 */
export function buildExport(markdown: string, ext: ExportExt): string {
  if (ext === "md") return markdown;
  if (ext === "txt") return toPlainText(markdown);
  if (ext === "sql") return extractCodeBlock(markdown, "sql") ?? toPlainText(markdown);
  const json = extractCodeBlock(markdown, "json");
  if (json) {
    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch {
      return json;
    }
  }
  return JSON.stringify({ result: markdown }, null, 2);
}
