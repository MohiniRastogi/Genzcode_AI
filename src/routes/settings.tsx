import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useHistory } from "@/features/history/useHistory";
import { Trash2, Info } from "lucide-react";

export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — CodeMateAI" },
      { name: "description", content: "Manage your CodeMateAI workspace." },
    ],
  }),
  component: SettingsPage,
});

function SettingsPage() {
  const { entries, clear } = useHistory();
  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8">
      <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
      <p className="text-sm text-muted-foreground">Manage your workspace and local data.</p>
      <section className="mt-8 space-y-4">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm">
          <h2 className="text-sm font-semibold">Local data</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            CodeMateAI stores your history and favorites in your browser only. Nothing is uploaded.
            You currently have <strong>{entries.length}</strong> entries.
          </p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4"
            onClick={() => {
              clear();
              toast.success("History cleared");
            }}
          >
            <Trash2 className="h-4 w-4" /> Clear all history
          </Button>
        </div>
        <div className="flex items-start gap-3 rounded-3xl border border-border/60 bg-card/70 p-5 backdrop-blur-sm">
          <Info className="mt-0.5 h-4 w-4 text-muted-foreground" />
          <div className="text-xs text-muted-foreground">
            Powered by Lovable AI Gateway using <code className="rounded bg-muted px-1 py-0.5">google/gemini-3.6-flash</code>.
            Account sync, teams, and OpenAI Responses API integration are on the roadmap.
          </div>
        </div>
      </section>
    </div>
  );
}
