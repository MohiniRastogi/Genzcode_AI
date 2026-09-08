export type RunnableKind = "js" | "html";

export interface CodeBlock {
  lang: string;
  code: string;
}

const JS_LANGS = new Set([
  "js",
  "jsx",
  "javascript",
  "ts",
  "tsx",
  "typescript",
  "node",
  "nodejs",
]);
const HTML_LANGS = new Set(["html", "htm", "xml"]);
const CSS_LANGS = new Set(["css", "scss"]);

/** All fenced code blocks in a markdown document. */
export function extractCodeBlocks(markdown: string): CodeBlock[] {
  const blocks: CodeBlock[] = [];
  const re = /```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(markdown))) {
    const code = m[2].replace(/\s+$/, "");
    if (code.trim()) blocks.push({ lang: (m[1] || "").toLowerCase(), code });
  }
  return blocks;
}

export function kindOf(lang: string): RunnableKind | null {
  if (JS_LANGS.has(lang)) return "js";
  if (HTML_LANGS.has(lang)) return "html";
  return null;
}

export function isTypescript(lang: string) {
  return lang === "ts" || lang === "tsx" || lang === "typescript";
}

export function isJsx(lang: string) {
  return lang === "jsx" || lang === "tsx";
}

/**
 * Picks the best block to execute from an AI answer, and pairs an HTML block
 * with any CSS / JS blocks that belong to the same snippet.
 */
export function pickRunnable(markdown: string): {
  block: CodeBlock;
  kind: RunnableKind;
  css?: string;
  js?: string;
} | null {
  const blocks = extractCodeBlocks(markdown);
  const html = blocks.find((b) => HTML_LANGS.has(b.lang));
  if (html) {
    return {
      block: html,
      kind: "html",
      css: blocks.find((b) => CSS_LANGS.has(b.lang))?.code,
      js: blocks.find((b) => JS_LANGS.has(b.lang))?.code,
    };
  }
  const js = blocks.find((b) => JS_LANGS.has(b.lang));
  if (js) return { block: js, kind: "js" };
  return null;
}

/** Languages we can execute in the browser. */
export const RUNNABLE_NOTE =
  "JavaScript, TypeScript and HTML/CSS snippets run right here in a sandbox. Other languages can't be executed in the browser.";
