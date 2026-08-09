import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Sparkles, ArrowLeft } from "lucide-react";
import { ToolPage } from "@/components/tools/ToolPage";
import { findTool } from "@/features/tools/registry";

export const Route = createFileRoute("/utilities/$slug")({
  head: ({ params }) => {
    const tool = findTool(params.slug);
    return {
      meta: [
        { title: tool ? `${tool.title} — CodeMateAI` : "Utility — CodeMateAI" },
        { name: "description", content: tool?.description ?? "Developer utility." },
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
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-white to-[oklch(0.97_0.02_260)] p-10 text-center shadow-sm">
        <div className={`relative mx-auto inline-flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br ${tool.gradient} text-white shadow-lg`}>
          <Sparkles className="h-8 w-8" />
        </div>
        <h2 className="relative mt-6 text-2xl font-semibold tracking-tight">Coming soon</h2>
        <p className="relative mx-auto mt-2 max-w-md text-sm text-muted-foreground">
          {tool.title} is on the way. Try the utilities that are already live.
        </p>
        <div className="relative mt-6 flex justify-center gap-2">
          <Link
            to="/utilities/json-formatter"
            className="inline-flex items-center gap-2 rounded-2xl bg-foreground px-4 py-2 text-sm font-medium text-background transition hover:opacity-90"
          >
            Open JSON Formatter
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
