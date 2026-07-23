import {
  Bug,
  Code2,
  FileCode,
  FileText,
  GitCompare,
  Wand2,
  Regex,
  Database,
  Workflow,
  Braces,
  Hash,
  KeyRound,
  Lock,
  Palette,
  QrCode,
  Sparkles,
  BookOpen,
  Layers,
  ScrollText,
  TerminalSquare,
  Type,
  Link2,
  FileJson,
  ShieldCheck,
  Fingerprint,
  Clock,
  type LucideIcon,
} from "lucide-react";

export type ToolCategory =
  | "AI Tools"
  | "Generators"
  | "Review"
  | "Converters"
  | "Utilities";

export type ToolStatus = "ready" | "soon";

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: ToolCategory;
  icon: LucideIcon;
  gradient: string; // tailwind gradient classes
  to: string;
  status: ToolStatus;
}

export const TOOLS: Tool[] = [
  // AI Tools
  {
    id: "code-generator",
    title: "AI Code Generator",
    description: "Generate production-ready code from natural language.",
    category: "AI Tools",
    icon: Wand2,
    gradient: "from-indigo-500 via-violet-500 to-fuchsia-500",
    to: "/tools/code-generator",
    status: "ready",
  },
  {
    id: "code-reviewer",
    title: "AI Code Reviewer",
    description: "Score, critique and improve your code.",
    category: "Review",
    icon: ShieldCheck,
    gradient: "from-emerald-500 via-teal-500 to-cyan-500",
    to: "/tools/code-reviewer",
    status: "ready",
  },
  {
    id: "bug-solver",
    title: "AI Bug Solver",
    description: "Detect and fix bugs in seconds.",
    category: "AI Tools",
    icon: Bug,
    gradient: "from-rose-500 via-pink-500 to-red-500",
    to: "/tools/bug-solver",
    status: "ready",
  },
  {
    id: "code-converter",
    title: "Code Converter",
    description: "Translate code between languages.",
    category: "Converters",
    icon: GitCompare,
    gradient: "from-orange-500 via-amber-500 to-yellow-500",
    to: "/tools/code-converter",
    status: "ready",
  },

  // Generators (coming soon)
  {
    id: "documentation-generator",
    title: "Documentation Generator",
    description: "READMEs, API docs, class docs — done.",
    category: "Generators",
    icon: BookOpen,
    gradient: "from-sky-500 to-blue-600",
    to: "/tools/documentation-generator",
    status: "soon",
  },
  {
    id: "regex-generator",
    title: "Regex Generator",
    description: "Describe it, get a bulletproof regex.",
    category: "Generators",
    icon: Regex,
    gradient: "from-violet-500 to-purple-600",
    to: "/tools/regex-generator",
    status: "soon",
  },
  {
    id: "sql-generator",
    title: "SQL Generator",
    description: "Natural language to SQL queries.",
    category: "Generators",
    icon: Database,
    gradient: "from-cyan-500 to-sky-600",
    to: "/tools/sql-generator",
    status: "soon",
  },
  {
    id: "api-generator",
    title: "API Generator",
    description: "REST, Express, Flask, Django, Spring.",
    category: "Generators",
    icon: TerminalSquare,
    gradient: "from-fuchsia-500 to-pink-600",
    to: "/tools/api-generator",
    status: "soon",
  },
  {
    id: "readme-generator",
    title: "README Generator",
    description: "Beautiful project READMEs in one shot.",
    category: "Generators",
    icon: FileText,
    gradient: "from-lime-500 to-emerald-600",
    to: "/tools/readme-generator",
    status: "soon",
  },
  {
    id: "flowchart-generator",
    title: "Flowchart Generator",
    description: "Mermaid diagrams from any prompt.",
    category: "Generators",
    icon: Workflow,
    gradient: "from-teal-500 to-emerald-600",
    to: "/tools/flowchart-generator",
    status: "soon",
  },
  {
    id: "algorithm-generator",
    title: "Algorithm Generator",
    description: "Pseudocode + complexity analysis.",
    category: "Generators",
    icon: Sparkles,
    gradient: "from-amber-500 to-orange-600",
    to: "/tools/algorithm-generator",
    status: "soon",
  },
  {
    id: "mini-project-generator",
    title: "Mini Project Generator",
    description: "Folder structure, code, deps, README.",
    category: "Generators",
    icon: Layers,
    gradient: "from-indigo-500 to-blue-600",
    to: "/tools/mini-project-generator",
    status: "soon",
  },

  // Utilities (ready)
  {
    id: "json-formatter",
    title: "JSON Formatter",
    description: "Format, validate, minify JSON.",
    category: "Utilities",
    icon: FileJson,
    gradient: "from-slate-500 to-slate-700",
    to: "/utilities/json-formatter",
    status: "ready",
  },
  {
    id: "base64",
    title: "Base64 Encode / Decode",
    description: "Convert to and from Base64.",
    category: "Utilities",
    icon: Braces,
    gradient: "from-zinc-500 to-zinc-700",
    to: "/utilities/base64",
    status: "ready",
  },
  {
    id: "jwt-decoder",
    title: "JWT Decoder",
    description: "Inspect JWT header and payload.",
    category: "Utilities",
    icon: KeyRound,
    gradient: "from-neutral-500 to-neutral-700",
    to: "/utilities/jwt-decoder",
    status: "ready",
  },
  // Utilities (soon)
  { id: "html-beautifier", title: "HTML Beautifier", description: "Format HTML markup.", category: "Utilities", icon: FileCode, gradient: "from-orange-400 to-red-500", to: "/utilities/html-beautifier", status: "soon" },
  { id: "css-beautifier", title: "CSS Beautifier", description: "Format CSS stylesheets.", category: "Utilities", icon: Palette, gradient: "from-pink-400 to-rose-500", to: "/utilities/css-beautifier", status: "soon" },
  { id: "js-beautifier", title: "JavaScript Beautifier", description: "Format and minify JS.", category: "Utilities", icon: Code2, gradient: "from-yellow-400 to-amber-500", to: "/utilities/js-beautifier", status: "soon" },
  { id: "sql-formatter", title: "SQL Formatter", description: "Pretty-print SQL.", category: "Utilities", icon: Database, gradient: "from-cyan-400 to-blue-500", to: "/utilities/sql-formatter", status: "soon" },
  { id: "markdown-preview", title: "Markdown Preview", description: "Live Markdown editor.", category: "Utilities", icon: ScrollText, gradient: "from-slate-400 to-slate-600", to: "/utilities/markdown-preview", status: "soon" },
  { id: "url-encode", title: "URL Encode / Decode", description: "Encode URL components.", category: "Utilities", icon: Link2, gradient: "from-blue-400 to-indigo-500", to: "/utilities/url-encode", status: "soon" },
  { id: "hash-generator", title: "Hash Generator", description: "MD5, SHA-1, SHA-256.", category: "Utilities", icon: Hash, gradient: "from-purple-400 to-violet-500", to: "/utilities/hash-generator", status: "soon" },
  { id: "uuid-generator", title: "UUID Generator", description: "Generate RFC-4122 UUIDs.", category: "Utilities", icon: Fingerprint, gradient: "from-emerald-400 to-teal-500", to: "/utilities/uuid-generator", status: "soon" },
  { id: "password-generator", title: "Password Generator", description: "Strong passwords, instantly.", category: "Utilities", icon: Lock, gradient: "from-red-400 to-rose-500", to: "/utilities/password-generator", status: "soon" },
  { id: "qr-generator", title: "QR Generator", description: "Turn text into QR codes.", category: "Utilities", icon: QrCode, gradient: "from-neutral-400 to-neutral-600", to: "/utilities/qr-generator", status: "soon" },
  { id: "color-picker", title: "Color Picker", description: "Pick and convert colors.", category: "Utilities", icon: Palette, gradient: "from-fuchsia-400 to-pink-500", to: "/utilities/color-picker", status: "soon" },
  { id: "lorem-ipsum", title: "Lorem Ipsum", description: "Generate placeholder text.", category: "Utilities", icon: Type, gradient: "from-gray-400 to-gray-600", to: "/utilities/lorem-ipsum", status: "soon" },
  { id: "timestamp-converter", title: "Timestamp Converter", description: "Unix time ↔ human date.", category: "Utilities", icon: Clock, gradient: "from-teal-400 to-cyan-500", to: "/utilities/timestamp-converter", status: "soon" },
];

export function findTool(id: string): Tool | undefined {
  return TOOLS.find((t) => t.id === id);
}

export const CATEGORIES: ToolCategory[] = [
  "AI Tools",
  "Generators",
  "Review",
  "Converters",
  "Utilities",
];
