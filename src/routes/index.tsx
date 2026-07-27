import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Activity,
  Sparkles,
  ShieldCheck,
  Save,
  FolderCode,
  Star,
  Bug,
  Code2,
  Database,
  Regex,
  TerminalSquare,
  BookOpen,
  FileText,
  GitCompare,
  Wand2,
  Zap,
  Lock,
  Globe,
  Layers,
  Rocket,
  Search,
  TrendingUp,
  Pin,
  Clock,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";
import { StatCard } from "@/components/tools/StatCard";
import { QuickActionCard } from "@/components/tools/QuickActionCard";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { TOOLS } from "@/features/tools/registry";
import { useHistory, useHistoryStats } from "@/features/history/useHistory";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const SITE_URL = "https://codemateai.lovable.app";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "CodeMateAI — AI Coding Assistant for Code, APIs, SQL & Docs" },
      {
        name: "description",
        content:
          "CodeMateAI is an AI coding assistant that generates production-ready code, reviews pull requests, fixes bugs, and produces APIs, SQL, regex, README files and technical documentation — right in the browser.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "CodeMateAI — AI Coding Assistant for Developers" },
      {
        property: "og:description",
        content:
          "Generate, review, debug and document code with an AI workspace built for students, developers, freelancers and software teams.",
      },
      { property: "og:url", content: SITE_URL },
      { property: "og:site_name", content: "CodeMateAI" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "CodeMateAI — AI Coding Assistant" },
      {
        name: "twitter:description",
        content:
          "One AI workspace to generate code, review pull requests, fix bugs, and produce APIs, SQL and documentation.",
      },
    ],
    links: [{ rel: "canonical", href: SITE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          name: "CodeMateAI",
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Web",
          url: SITE_URL,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          description:
            "AI coding assistant to generate code, review code, fix bugs, convert languages, and generate APIs, SQL, regex, README and documentation.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "CodeMateAI",
          url: SITE_URL,
          logo: `${SITE_URL}/favicon.ico`,
          sameAs: [],
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: FAQ.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
          ],
        }),
      },
    ],
  }),
  component: Dashboard,
});

const POPULAR_TASKS: { label: string; to: string }[] = [
  { label: "Generate a Python function", to: "/tools/code-generator" },
  { label: "Build a React component", to: "/tools/code-generator" },
  { label: "Create an Express API", to: "/tools/api-generator" },
  { label: "Fix a JavaScript error", to: "/tools/bug-solver" },
  { label: "Review an SQL query", to: "/tools/code-reviewer" },
  { label: "Generate a README", to: "/tools/readme-generator" },
  { label: "Generate a Regex", to: "/tools/regex-generator" },
  { label: "Write documentation", to: "/tools/documentation-generator" },
  { label: "Create a JWT", to: "/utilities/jwt-decoder" },
  { label: "Format JSON", to: "/utilities/json-formatter" },
  { label: "Convert Java to Python", to: "/tools/code-converter" },
  { label: "Optimize an SQL query", to: "/tools/sql-generator" },
];

const TRUST_BADGES = [
  { icon: Globe, label: "100+ programming languages" },
  { icon: Sparkles, label: "AI-powered workflows" },
  { icon: Zap, label: "Fast streaming responses" },
  { icon: Lock, label: "Secure browser workspace" },
  { icon: Rocket, label: "No installation required" },
];

const SOLUTIONS = [
  {
    icon: BookOpen,
    title: "For students",
    desc: "Learn programming faster with clear AI explanations, worked examples in Python or JavaScript, and step-by-step algorithm walkthroughs.",
    cta: "Explain code with AI",
    to: "/tools/code-generator",
    grad: "from-indigo-500 to-violet-500",
  },
  {
    icon: Code2,
    title: "For developers",
    desc: "Ship production-ready React, Node.js and Django code, scaffold REST APIs, generate SQL and keep technical documentation in sync.",
    cta: "Generate an API",
    to: "/tools/api-generator",
    grad: "from-fuchsia-500 to-pink-500",
  },
  {
    icon: Rocket,
    title: "For freelancers",
    desc: "Automate the repetitive parts of client work — convert code between languages, generate READMEs and deliver projects on time.",
    cta: "Convert a language",
    to: "/tools/code-converter",
    grad: "from-orange-500 to-amber-500",
  },
  {
    icon: Layers,
    title: "For teams",
    desc: "Standardize technical documentation, keep READMEs current, and raise code quality with consistent AI-assisted reviews.",
    cta: "Review code with AI",
    to: "/tools/code-reviewer",
    grad: "from-emerald-500 to-teal-500",
  },
];


const USE_CASES = [
  { icon: Globe, title: "Web development", desc: "Ship React, Next.js and Vue interfaces with AI-generated components, hooks and utility functions.", grad: "from-indigo-500 to-blue-500" },
  { icon: TerminalSquare, title: "Backend development", desc: "Design Node.js, Django, FastAPI and Spring Boot services with clean, testable REST endpoints.", grad: "from-fuchsia-500 to-pink-500" },
  { icon: Database, title: "Database queries", desc: "Turn plain English into optimized PostgreSQL, MySQL, SQLite or MongoDB queries in seconds.", grad: "from-cyan-500 to-sky-500" },
  { icon: BookOpen, title: "Technical documentation", desc: "Auto-generate Markdown docs, JSDoc and Python docstrings directly from your source.", grad: "from-sky-500 to-blue-500" },
  { icon: Code2, title: "API development", desc: "Scaffold REST APIs with authentication, JWT, validation and Swagger definitions on demand.", grad: "from-violet-500 to-purple-500" },
  { icon: Sparkles, title: "Learning programming", desc: "Read AI explanations of unfamiliar snippets and study idiomatic patterns for each language.", grad: "from-amber-500 to-orange-500" },
  { icon: Wand2, title: "Interview preparation", desc: "Practice algorithm problems with complexity notes and cross-language conversions.", grad: "from-rose-500 to-red-500" },
  { icon: Rocket, title: "Automation scripts", desc: "Generate Bash, Python and Node.js scripts to replace repetitive terminal work.", grad: "from-emerald-500 to-teal-500" },
];

const WHY_CARDS = [
  { icon: Zap, title: "Speed", desc: "AI-assisted development removes boilerplate so features ship in hours, not days." },
  { icon: ShieldCheck, title: "Accuracy", desc: "Structured, reviewed output with consistent formatting across every language." },
  { icon: Rocket, title: "Productivity", desc: "Move from idea to running implementation without switching between tools." },
  { icon: BookOpen, title: "Learning", desc: "Understand unfamiliar code and frameworks with clear, contextual explanations." },
  { icon: Layers, title: "Organization", desc: "Auto-generate READMEs and documentation to keep every project tidy." },
  { icon: Sparkles, title: "Developer experience", desc: "One clean workspace for generation, review, conversion, SQL, regex and APIs." },
];

const HOW_STEPS = [
  { n: "01", title: "Describe your task", desc: "Type a plain-English prompt or paste the code you want to work with." },
  { n: "02", title: "Choose an AI tool", desc: "Generator, reviewer, bug solver, converter, SQL, regex, API or docs." },
  { n: "03", title: "Generate result", desc: "Get structured, syntax-highlighted Markdown ready for real use." },
  { n: "04", title: "Copy or download", desc: "One-click copy, download, share or save to your history and favorites." },
];

const FAQ: { q: string; a: string }[] = [
  { q: "What is CodeMateAI?", a: "CodeMateAI is an AI coding workspace that helps you generate, review, debug and document code from your browser. You describe a task in plain English, pick a tool — code generator, bug solver, SQL, regex, API or documentation — and get a structured, syntax-highlighted result you can drop straight into your project." },
  { q: "Who is CodeMateAI for?", a: "It's built for students learning to code, developers shipping production apps, freelancers juggling client work, and teams that want consistent documentation and code quality. If you write JavaScript, Python, TypeScript, Java, Go or SQL on a regular basis, CodeMateAI takes care of the repetitive parts so you can focus on the interesting problems." },
  { q: "Why should developers use an AI coding assistant?", a: "A good AI assistant handles the boring 20% of software work — boilerplate, docstrings, sample data, SQL joins — so you can spend more time on architecture and product decisions. It also shortens the loop between an idea and a working prototype, which usually means shipping features and fixing bugs noticeably faster." },
  { q: "How does AI help software development?", a: "AI turns natural-language descriptions into working code, explains unfamiliar files, suggests refactors and catches obvious bugs during review. Used well, it acts like a patient pair-programmer: quick to draft a first version, quick to explain trade-offs, and always available when you're stuck on something outside your usual stack." },
  { q: "How can AI help you write documentation?", a: "CodeMateAI reads your source and produces Markdown docs, JSDoc comments, Python docstrings or Javadoc that match what the code actually does. It's especially useful for README files, API references and onboarding notes — the writing tasks most teams skip because they're time-consuming rather than technically hard." },
  { q: "How can AI generate SQL from plain English?", a: "You describe the result you want — 'top 10 customers by revenue this quarter' — and the SQL generator produces a query for PostgreSQL, MySQL, SQLite or SQL Server, along with an assumed schema and a short explanation. You can tweak the prompt, compare dialects, and paste the query straight into your database client." },
  { q: "How can AI generate REST APIs?", a: "The API generator scaffolds Express, FastAPI, Flask, Django or Spring Boot services with routes, validation, JWT authentication, pagination and Swagger definitions. You describe the resource you need, choose a framework, and get a working starting point plus a Postman collection — no need to remember every idiomatic pattern per stack." },
  { q: "How does AI review code?", a: "You paste a file or diff and the reviewer scores it across readability, performance, security and best practices. It highlights bugs, dead code and risky patterns, then suggests a cleaner version. It won't replace a senior review, but it's a solid first pass that catches the obvious issues before they hit a pull request." },
  { q: "Can AI convert code between programming languages?", a: "Yes — the converter translates between JavaScript, TypeScript, Python, Java, Go, Rust, C#, PHP and more while preserving behavior. It also flags where the target language differs, so you know when a Pythonic list comprehension becomes a Java stream or when Go's error handling replaces a JavaScript try/catch." },
  { q: "Is CodeMateAI free to use?", a: "The core tools are free while you're getting started. Usage is metered through the Lovable AI Gateway's monthly allowance, so heavier workloads may need extra credits added to your workspace. There's no installation, no separate account to manage, and nothing to configure before you run your first prompt." },
  { q: "Is my code kept private?", a: "Your prompts are sent to the AI gateway only to answer the current request — nothing is used to train external models. Your history and favorites stay in local browser storage, not on a server, so you can clear them at any time from Settings without leaving a trace behind." },
  { q: "Which languages and frameworks are supported?", a: "CodeMateAI works with mainstream languages including Python, JavaScript, TypeScript, Java, Go, Rust, C++, C#, PHP, Ruby, Swift and Kotlin, plus frameworks like React, Next.js, Vue, Angular, Node.js, Express, FastAPI, Django and Spring Boot. Databases covered include PostgreSQL, MySQL, MongoDB and SQLite." },
];

const CATEGORIES: { title: string; ids: string[]; grad: string }[] = [
  {
    title: "AI Coding",
    ids: ["code-generator", "bug-solver", "code-reviewer", "code-converter"],
    grad: "from-indigo-500 to-violet-500",
  },
  {
    title: "Generators",
    ids: ["documentation-generator", "readme-generator", "regex-generator", "sql-generator", "api-generator"],
    grad: "from-fuchsia-500 to-pink-500",
  },
  {
    title: "Utilities",
    ids: ["json-formatter", "jwt-decoder", "base64"],
    grad: "from-emerald-500 to-teal-500",
  },
];

function TypingHeadline() {
  const words = ["modern developers.", "shipping teams.", "Indian developers.", "solo builders."];
  const [i, setI] = useState(0);
  const [text, setText] = useState("");
  const [dir, setDir] = useState<1 | -1>(1);
  useEffect(() => {
    const current = words[i % words.length];
    const done = dir === 1 && text === current;
    const empty = dir === -1 && text === "";
    if (done) {
      const t = setTimeout(() => setDir(-1), 1400);
      return () => clearTimeout(t);
    }
    if (empty) {
      setDir(1);
      setI((n) => n + 1);
      return;
    }
    const t = setTimeout(() => {
      setText(dir === 1 ? current.slice(0, text.length + 1) : current.slice(0, text.length - 1));
    }, dir === 1 ? 70 : 40);
    return () => clearTimeout(t);
  }, [text, dir, i]);
  return (
    <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
      {text}
      <span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-1 animate-pulse bg-fuchsia-500 align-middle" />
    </span>
  );
}

function AnimatedNumber({ value }: { value: number }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    const start = performance.now();
    const dur = 700;
    const from = 0;
    const to = value;
    let raf = 0;
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      setN(Math.round(from + (to - from) * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value]);
  return <>{n}</>;
}

function Dashboard() {
  const stats = useHistoryStats();
  const { entries, toggleFavorite } = useHistory();
  const featured = TOOLS.filter((t) => t.status === "ready").slice(0, 12);
  const recent = entries.slice(0, 5);
  const trending = TOOLS.filter((t) => t.status === "ready").slice(0, 6);
  const pinned = entries.filter((e) => e.favorite).slice(0, 4);
  const usageByTool = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.toolId] = (acc[e.toolId] ?? 0) + 1;
    return acc;
  }, {});
  const popular = [...TOOLS]
    .filter((t) => t.status === "ready")
    .sort((a, b) => (usageByTool[b.id] ?? 0) - (usageByTool[a.id] ?? 0))
    .slice(0, 4);
  const continueWorking = recent[0];

  return (
    <div>
      <div className="mx-auto w-full max-w-7xl px-6 py-8">
        {/* Hero */}
        <section className="relative mb-10 overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-white via-white to-[oklch(0.97_0.02_290)] p-8 shadow-sm sm:p-12">
          <motion.div
            animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-20 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -15, 0], y: [0, 12, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 opacity-15 blur-3xl"
          />
          <div className="relative">
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs font-medium text-muted-foreground backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-violet-500" />
              An AI developer platform — powered by Lovable AI
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
              The AI toolkit for
              <br className="hidden sm:inline" /> <TypingHeadline />
            </h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground">
              CodeMateAI is an AI-powered coding workspace where developers generate
              production-ready code, review pull requests, fix bugs, convert languages,
              and produce APIs, SQL, regex and technical documentation. Built for
              students, developers and software teams — right in the browser.
            </p>
            <div className="mt-7 flex flex-wrap gap-2">
              <Link
                to="/tools/code-generator"
                className="group inline-flex items-center gap-2 rounded-2xl bg-foreground px-5 py-2.5 text-sm font-medium text-background shadow-lg transition hover:opacity-90"
              >
                <Sparkles className="h-4 w-4" /> Start generating code
                <ChevronRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/tools/code-reviewer"
                className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:bg-background"
              >
                <ShieldCheck className="h-4 w-4" /> Review my code
              </Link>
            </div>

            {/* Popular searches */}
            <div className="mt-8">
              <div id="popular-tasks-label" className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                <Search className="h-3.5 w-3.5" aria-hidden="true" /> Popular tasks
              </div>
              <nav aria-labelledby="popular-tasks-label">
                <ul className="flex flex-wrap gap-1.5">
                  {POPULAR_TASKS.map((p) => (
                    <li key={p.label}>
                      <Link
                        to={p.to}
                        className="inline-block rounded-full border border-border/60 bg-background/70 px-3 py-1 text-xs text-foreground/80 transition hover:bg-background hover:text-foreground hover:shadow-sm"
                      >
                        {p.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </section>

        {/* Trust bar */}
        <section aria-label="Product highlights" className="mb-10 rounded-3xl border border-border/60 bg-white/60 px-6 py-4 shadow-sm backdrop-blur-md">
          <ul className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs font-medium text-foreground/80">
            {TRUST_BADGES.map((b) => {
              const Icon = b.icon;
              return (
                <li key={b.label} className="flex items-center gap-2">
                  <span aria-hidden="true" className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/10 to-fuchsia-500/10 text-emerald-700">
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  {b.label}
                </li>
              );
            })}
          </ul>
        </section>

        {/* Stats */}
        <section className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Today's AI requests" value={stats.today} icon={Activity} gradient="from-indigo-500 to-violet-500" />
          <StatCard label="Programs generated" value={stats.byTool("code-generator")} icon={Sparkles} gradient="from-fuchsia-500 to-pink-500" />
          <StatCard label="Code reviews" value={stats.byTool("code-reviewer")} icon={ShieldCheck} gradient="from-emerald-500 to-teal-500" />
          <StatCard label="Bugs solved" value={stats.byTool("bug-solver")} icon={FolderCode} gradient="from-rose-500 to-red-500" />
          <StatCard label="Saved snippets" value={stats.favorites} icon={Star} gradient="from-amber-500 to-orange-500" />
          <StatCard label="Total runs" value={stats.total} icon={Save} gradient="from-cyan-500 to-blue-500" />
        </section>

        {/* Continue working */}
        {continueWorking && (
          <section className="mb-10">
            <div className="rounded-3xl border border-border/60 bg-gradient-to-r from-indigo-50 via-white to-fuchsia-50 p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Continue working
                  </div>
                  <div className="mt-1 truncate text-sm font-semibold">
                    {continueWorking.title}
                  </div>
                  <div className="mt-0.5 truncate text-xs text-muted-foreground">
                    {continueWorking.input.slice(0, 120)}
                  </div>
                </div>
                <Link
                  to="/history"
                  className="inline-flex items-center gap-1 rounded-2xl bg-foreground px-4 py-2 text-xs font-medium text-background transition hover:opacity-90"
                >
                  Resume <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </section>
        )}

        {/* Solutions */}
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-violet-600">
              Built for every kind of builder
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Solutions for how you actually work
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              From your first Python function to a production API — CodeMateAI adapts to the way you build.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {SOLUTIONS.map((s, idx) => {
              const Icon = s.icon;
              return (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.35, delay: idx * 0.05 }}
                  whileHover={{ y: -3 }}
                  className="group relative flex flex-col overflow-hidden rounded-3xl border border-border/60 bg-white/60 p-5 shadow-sm backdrop-blur-md transition hover:shadow-xl"
                >
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${s.grad} opacity-10 blur-2xl transition group-hover:opacity-30`} />
                  <div className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br ${s.grad} text-white shadow-md`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-4 text-sm font-semibold tracking-tight">{s.title}</h3>
                  <p className="mt-1 flex-1 text-xs text-muted-foreground">{s.desc}</p>
                  <Link to={s.to} className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground/80 transition hover:text-foreground">
                    {s.cta} <ChevronRight className="h-3.5 w-3.5" />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Quick actions */}
        <section className="mb-14">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Quick launch</h2>
            <span className="text-xs text-muted-foreground">{TOOLS.length} tools available</span>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {featured.map((t) => (
              <QuickActionCard key={t.id} tool={t} />
            ))}
          </div>
        </section>

        {/* Trending / Popular / Pinned */}
        <section className="mb-14 grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <TrendingUp className="h-4 w-4 text-rose-500" /> Trending tools
            </div>
            <ul className="mt-3 space-y-2">
              {trending.map((t) => (
                <li key={t.id}>
                  <Link to={t.to} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm transition hover:bg-muted/50">
                    <span className="truncate">{t.title}</span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Star className="h-4 w-4 text-amber-500" /> Popular for you
            </div>
            <ul className="mt-3 space-y-2">
              {popular.map((t) => (
                <li key={t.id}>
                  <Link to={t.to} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm transition hover:bg-muted/50">
                    <span className="truncate">{t.title}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {usageByTool[t.id] ?? 0} runs
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm font-semibold">
              <Pin className="h-4 w-4 text-indigo-500" /> Pinned favorites
            </div>
            {pinned.length === 0 ? (
              <p className="mt-3 text-xs text-muted-foreground">
                Star any result to pin it here for one-click access.
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {pinned.map((p) => (
                  <li key={p.id} className="flex items-center justify-between gap-2">
                    <button
                      onClick={() => toggleFavorite(p.id)}
                      className="truncate text-left text-sm hover:text-foreground"
                    >
                      {p.title}
                    </button>
                    <span className="text-[11px] text-muted-foreground">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Supported technologies — described in prose, not keyword chips */}
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-fuchsia-600">
              Works with your stack
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Fluent across the languages and frameworks you ship with
            </h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="text-sm font-semibold">Application code</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Generate idiomatic Python, JavaScript, TypeScript, Java, Go, Rust, C#, PHP,
                Ruby, Swift and Kotlin — with first-class support for React, Next.js, Vue,
                Angular, Node.js, Express, FastAPI, Django and Spring Boot when you scaffold
                full features or REST endpoints.
              </p>
            </div>
            <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-sm backdrop-blur-sm">
              <h3 className="text-sm font-semibold">Data & tooling</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Turn plain English into optimized SQL for PostgreSQL, MySQL, SQLite or SQL
                Server, model MongoDB collections, craft precise regular expressions, and
                handle everyday utilities like JSON, JWT and Base64 without leaving the
                workspace.
              </p>
            </div>
          </div>
        </section>


        {/* Tool categories */}
        <section className="mb-14">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">Browse by category</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <div key={cat.title} className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
                <div className={`inline-flex rounded-full bg-gradient-to-r ${cat.grad} px-3 py-1 text-[11px] font-medium uppercase tracking-wider text-white shadow`}>
                  {cat.title}
                </div>
                <ul className="mt-4 space-y-1.5">
                  {cat.ids.map((id) => {
                    const t = TOOLS.find((x) => x.id === id);
                    if (!t) return null;
                    const Icon = t.icon;
                    return (
                      <li key={id}>
                        <Link to={t.to} className="flex items-center gap-3 rounded-xl px-2 py-1.5 text-sm transition hover:bg-muted/50">
                          <div className={`flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br ${t.gradient} text-white`}>
                            <Icon className="h-3.5 w-3.5" />
                          </div>
                          {t.title}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* What is CodeMateAI */}
        <section className="mb-14 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl font-semibold tracking-tight">What is CodeMateAI?</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              CodeMateAI is a free AI coding tool and programming assistant that lives
              in your browser. It's an AI code generator online that helps developers
              write, understand, review and refactor code across the languages and
              frameworks they use every day. Instead of jumping between chat windows,
              docs and playgrounds, CodeMateAI gives you a single dashboard where an AI
              programming assistant handles the repetitive work — from scaffolding APIs
              to explaining tricky regex — so you can focus on the interesting problems.
            </p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/70 p-8 shadow-sm backdrop-blur-sm">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <ol className="mt-4 space-y-3">
              {HOW_STEPS.map((s) => (
                <li key={s.n} className="flex gap-4">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-xs font-semibold text-white">
                    {s.n}
                  </div>
                  <div>
                    <div className="text-sm font-semibold">{s.title}</div>
                    <div className="text-xs text-muted-foreground">{s.desc}</div>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Why choose */}
        <section className="mb-14">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Why developers choose CodeMateAI
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Six reasons engineers keep this tab open next to their editor.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {WHY_CARDS.map((c) => {
              const Icon = c.icon;
              return (
                <motion.div
                  key={c.title}
                  whileHover={{ y: -3 }}
                  className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm transition hover:shadow-md"
                >
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-slate-800 to-slate-600 text-white shadow">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{c.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Comparison */}
        <section className="mb-14">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              CodeMateAI vs. copy-pasting from a chat window
            </h2>
          </div>
          <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-sm backdrop-blur-sm">
            <table className="w-full text-sm">
              <caption className="sr-only">Feature comparison: CodeMateAI versus generic AI chat tools</caption>
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground">
                <tr>
                  <th scope="col" className="px-4 py-3 text-left">Capability</th>
                  <th scope="col" className="px-4 py-3 text-left">CodeMateAI</th>
                  <th scope="col" className="px-4 py-3 text-left">Generic AI chat</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {[
                  ["Dedicated code generator", "✓ Structured output", "Free text only"],
                  ["AI code review with scores", "✓ Per-category scoring", "Ad-hoc"],
                  ["Bug solver with fix", "✓ Detects & fixes", "Manual"],
                  ["SQL, Regex, API, README", "✓ Purpose-built tools", "Prompt engineering"],
                  ["History & favorites", "✓ Local & private", "None"],
                  ["Utilities (JSON, JWT, Base64)", "✓ Built-in", "External sites"],
                ].map((row) => (
                  <tr key={row[0]}>
                    <th scope="row" className="px-4 py-3 text-left font-medium">{row[0]}</th>
                    <td className="px-4 py-3 font-medium text-emerald-800">{row[1]}</td>
                    <td className="px-4 py-3 text-muted-foreground">{row[2]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent activity */}
        <section className="mb-14">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold tracking-tight flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" /> Recently used
            </h2>
            <Link to="/history" className="text-xs text-muted-foreground hover:text-foreground">
              View all →
            </Link>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/70 backdrop-blur-sm">
            {recent.length === 0 ? (
              <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                Nothing yet. Launch a tool above to get started.
              </div>
            ) : (
              <ul className="divide-y divide-border/60">
                {recent.map((e) => (
                  <li key={e.id} className="flex items-center justify-between px-6 py-3 text-sm">
                    <div className="min-w-0">
                      <div className="font-medium">{e.title}</div>
                      <div className="truncate text-xs text-muted-foreground">
                        {e.input.slice(0, 80)}
                      </div>
                    </div>
                    <div className="ml-4 text-xs text-muted-foreground">
                      {new Date(e.createdAt).toLocaleString()}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>

        {/* Counters */}
        <section className="mb-14 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "AI tools ready", value: TOOLS.filter((t) => t.status === "ready").length },
            { label: "Languages supported", value: 12 },
            { label: "Backend frameworks", value: 6 },
            { label: "Utilities included", value: 3 },
          ].map((c) => (
            <div key={c.label} className="rounded-3xl border border-border/60 bg-card/70 p-5 text-center shadow-sm backdrop-blur-sm">
              <div className="bg-gradient-to-br from-indigo-500 to-fuchsia-500 bg-clip-text text-3xl font-semibold text-transparent">
                <AnimatedNumber value={c.value} />+
              </div>
              <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {c.label}
              </div>
            </div>
          ))}
        </section>

        {/* Use cases */}
        <section className="mb-14">
          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-wider text-emerald-600">
              Use cases
            </p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">
              Where CodeMateAI fits in your day
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
              A few common workflows engineers reach for CodeMateAI to handle.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {USE_CASES.map((u) => {
              const Icon = u.icon;
              return (
                <motion.div
                  key={u.title}
                  whileHover={{ y: -3 }}
                  className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm transition hover:shadow-lg"
                >
                  <div className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${u.grad} opacity-10 blur-2xl transition group-hover:opacity-25`} />
                  <div className={`inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br ${u.grad} text-white shadow`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="mt-3 text-sm font-semibold">{u.title}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{u.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-14">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold tracking-tight">
              Frequently asked questions
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Straight answers about how CodeMateAI works and where it helps most.
            </p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/70 px-6 py-2 shadow-sm backdrop-blur-sm">
            <Accordion type="single" collapsible className="w-full">
              {FAQ.map((f, i) => (
                <AccordionItem key={f.q} value={`q-${i}`}>
                  <AccordionTrigger className="text-left text-sm font-medium">
                    {f.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {f.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="mb-6">
          <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 p-8 text-white shadow-lg sm:p-12">
            <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <h2 className="max-w-2xl text-2xl font-semibold tracking-tight sm:text-3xl">
              Ready to ship faster? Start generating code with AI now.
            </h2>
            <p className="mt-2 max-w-xl text-sm text-white/80">
              Free to try. No installation. Your history stays private in your browser.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link
                to="/tools/code-generator"
                className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 py-2.5 text-sm font-medium text-slate-900 shadow transition hover:opacity-95"
              >
                <Sparkles className="h-4 w-4" /> Open Code Generator
              </Link>
              <Link
                to="/tools/api-generator"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-medium backdrop-blur-sm transition hover:bg-white/20"
              >
                <TerminalSquare className="h-4 w-4" /> Generate an API
              </Link>
            </div>
          </div>
        </section>
      </div>

      <SiteFooter />
    </div>
  );
}

// Re-export FAQ for JSON-LD (defined before Route via hoisting? Not hoisted since const).
