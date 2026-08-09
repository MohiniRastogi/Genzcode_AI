import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";
import { ToolPage } from "@/components/tools/ToolPage";
import { findTool } from "@/features/tools/registry";

export const Route = createFileRoute("/tools/$slug")({
  head: ({ params }) => {
    const tool = findTool(params.slug);
    const title = tool ? `${tool.title} — CodeMateAI` : "Tool — CodeMateAI";
    return {
      meta: [
        { title },
        { name: "description", content: tool?.description ?? "AI developer tool." },
        { property: "og:title", content: title },
        { property: "og:description", content: tool?.description ?? "" },
      ],
    };
  },
  loader: ({ params }) => {
    const tool = findTool(params.slug);
    if (!tool) throw notFound();
    return { tool };
  },
  component: Page,
});

function Page() {
  const { slug } = Route.useParams();
  const tool = findTool(slug)!;
  return (
    <ToolPage tool={tool}>
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-white to-[oklch(0.97_0.02_290)] p-10 text-center shadow-sm">
        <div className={`absolute inset-x-0 -top-24 mx-auto h-48 w-48 rounded-full bg-gradient-to-br ${tool.gradient} opacity-20 blur-3xl`} />
        <div className={`relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${tool.gradient} text-white shadow-lg`}>
          <Sparkles className="h-8 w-8" />
        </div>
        <h2 className="relative mt-6 text-2xl font-semibold tracking-tight">Coming soon</h2>
        <p className="relative mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {tool.title} is on the roadmap. In the meantime, try one of the AI tools already live.
        </p>
        <div className="relative mt-6 flex justify-center gap-2">
          <Link
            to="/tools/code-generator"
            className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Open Code Generator
          </Link>
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 rounded-2xl border border-border/60 bg-background/70 px-4 py-2 text-sm font-medium backdrop-blur-sm transition hover:bg-background"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    </ToolPage>
  );
}
