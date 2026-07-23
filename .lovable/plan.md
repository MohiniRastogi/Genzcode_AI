# CodeMateAI — v1 Plan

A premium AI developer toolkit. Given the enormous surface area (40+ tools) I'm scoping v1 to ship a polished, production-feeling product rather than 40 half-built pages.

## Scope decisions (defaults)

- **v1 tools**: sidebar shell + Dashboard + 4 flagship AI tools fully working (Code Generator, Code Reviewer, Bug Solver, Code Converter) + 3 flagship utilities (JSON Formatter, Base64, JWT Decoder). All other tools listed in the sidebar/dashboard render a polished "Coming soon" tool page with the same layout shell, so the product feels complete and each tool is a one-file addition later.
- **Storage**: localStorage for History, Favorites, Saved Snippets (no auth). Keyed per-tool with a shared `useHistory` hook. Easy to swap to Lovable Cloud later.
- **Design**: premium light theme — soft neutrals, rounded 20px, soft shadows, subtle glassmorphism on cards, gradient accent (indigo→violet→pink) used sparingly on tool icons and hero. Framer Motion for entrance/hover. No dark mode in v1.
- **AI backend**: Lovable AI Gateway via a TanStack `createServerFn`, model `google/gemini-3.6-flash` (fast, multimodal, cheap). One shared `runAiTool` server function driven by per-tool prompt templates + structured output (zod). Reviewer/Bug Solver use structured JSON; Generator/Converter stream markdown.

## Architecture

```
src/
  routes/
    __root.tsx                    (AppShell w/ sidebar + header)
    index.tsx                     (Dashboard)
    tools/
      code-generator.tsx
      code-reviewer.tsx
      bug-solver.tsx
      code-converter.tsx
      $slug.tsx                   (generic ComingSoon for other tools)
    utilities/
      json-formatter.tsx
      base64.tsx
      jwt-decoder.tsx
      $slug.tsx                   (ComingSoon)
    history.tsx
    favorites.tsx
    settings.tsx
  components/
    layout/          AppSidebar, TopBar, GlobalSearch (⌘K)
    ui/              (shadcn)
    tools/           ToolPage shell, ToolHeader, GradientIcon, PromptForm,
                     AIResponseRenderer (markdown + syntax highlight + tables),
                     CodeBlock, ScoreCard, SkeletonResult, ErrorCard,
                     StatCard, QuickActionCard, ComingSoonCard
  features/
    ai/              prompts/ (per-tool templates), schemas/ (zod), types
    history/         useHistory, useFavorites (localStorage)
    tools/           registry.ts  (single source of truth: id, title, description,
                                   category, gradient, icon, route, status)
  lib/ai.functions.ts             (createServerFn: runAiTool, reviewCode, etc.)
  lib/ai-gateway.server.ts        (Lovable AI provider helper)
```

**Tool registry** drives the sidebar, dashboard quick actions, global search, and `$slug` coming-soon routes — adding a tool = one registry entry + one page file.

## Flagship tools

- **Code Generator**: form (language, difficulty, framework, style, comments, prompt) → streaming markdown response with code + explanation + complexity + edge cases. Copy / Download / Save / Regenerate.
- **Code Reviewer**: paste code → structured JSON (overallScore 0–100, per-category scores, bugs[], suggestions[], correctedCode, complexityBeforeAfter). Rendered as ScoreCard + accordions + diff-style code blocks.
- **Bug Solver**: paste broken code → structured JSON (errorType, cause, fixedCode, explanation, bestPractice).
- **Code Converter**: source language → target language dropdowns → converted code + syntax/perf notes.

## Utilities (client-only, no AI)

JSON Formatter (format / validate / minify), Base64 encode/decode, JWT decoder (header/payload/signature panels). Built on a shared `UtilityPage` shell so more utilities drop in easily.

## Shared UI contracts

- `AIResponseRenderer` — `react-markdown` + `react-syntax-highlighter` + `remark-gfm`. Used for every AI text output. Never renders raw objects.
- `ToolPage` — consistent header (gradient icon, title, description, breadcrumb), body slot, right-hand recent-history rail.
- `ErrorBoundary` at root already exists; add per-tool `ErrorCard` + `SkeletonResult` + Retry button.
- `sonner` toasts for copy/save/errors.

## Dashboard

- 6 gradient stat cards (counts pulled from localStorage history).
- Grouped quick-action cards for all 12 primary tools (registry-driven), each with gradient icon, title, description, Launch button.
- Recent activity list from history.

## Sidebar

Collapsible shadcn Sidebar with sections: Dashboard, AI Tools, Generators, Review, Converters, Utilities, History, Favorites, Settings. Active-route highlighting. ⌘K global search over the registry.

## SEO

Per-route `head()` with unique title, description, og:title, og:description, twitter:card. JSON-LD `SoftwareApplication` on `/` and `BreadcrumbList` on tool pages. Home replaces the placeholder.

## Performance / quality

- Route-level code splitting is automatic in TanStack.
- Zod on all AI inputs + structured outputs; catch `NoObjectGeneratedError` and fall back to raw text.
- Strict TS, no `any` in public surfaces, no raw-object children.

## Technical notes

- `bun add react-markdown remark-gfm react-syntax-highlighter framer-motion @ai-sdk/openai-compatible ai zod`
- AI: `streamText` on `google/gemini-3.6-flash` for text tools; `generateText` + `Output.object` (small schemas, no bounds) for Reviewer/Bug Solver, wrapped in `NoObjectGeneratedError` fallback.
- LOVABLE_API_KEY provisioned via `lovable_api_key--create` if missing; called only from server functions.
- History: `useHistory(toolId)` → localStorage array of `{id, toolId, input, output, createdAt, favorite}`. History and Favorites pages filter/search across all tools.

## Out of scope for v1 (visible as Coming Soon)

Documentation Generator, Regex, SQL, API, README, Flowchart, Algorithm, Mini Project generators; remaining 25+ utilities. All listed in registry with routes so links work.

## Deliverables checklist

- Sidebar shell + dashboard live on `/`
- 4 AI tools functional end-to-end against Lovable AI
- 3 utilities functional client-side
- History + Favorites pages backed by localStorage
- Global ⌘K search
- SEO metadata on every route
- No raw-object rendering, error boundaries, skeletons, toasts everywhere
