import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ToolPage } from "@/components/tools/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { findTool } from "@/features/tools/registry";
import { CheckCircle2, XCircle } from "lucide-react";
import { ResultActions } from "@/components/tools/ResultActions";

export const Route = createFileRoute("/utilities/jwt-decoder")({
  head: () => ({
    meta: [
      { title: "JWT Decoder — CodeMateAI" },
      { name: "description", content: "Decode and inspect JWT header and payload in your browser." },
    ],
  }),
  component: Page,
});

function b64urlDecode(v: string) {
  try {
    const s = v.replace(/-/g, "+").replace(/_/g, "/");
    const padded = s + "=".repeat((4 - (s.length % 4)) % 4);
    return decodeURIComponent(
      escape(atob(padded)),
    );
  } catch {
    return null;
  }
}

function Page() {
  const tool = findTool("jwt-decoder")!;
  const [token, setToken] = useState(
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkNvZGVNYXRlQUkiLCJpYXQiOjE3MDAwMDAwMDB9.abc",
  );

  const parsed = useMemo(() => {
    const parts = token.split(".");
    if (parts.length < 2) return { error: "JWT must have at least 2 parts" as string | null, header: null, payload: null };
    const header = b64urlDecode(parts[0]);
    const payload = b64urlDecode(parts[1]);
    try {
      return {
        error: null,
        header: header ? JSON.stringify(JSON.parse(header), null, 2) : null,
        payload: payload ? JSON.stringify(JSON.parse(payload), null, 2) : null,
        signature: parts[2] ?? "",
      };
    } catch {
      return { error: "Invalid JSON inside JWT", header: null, payload: null };
    }
  }, [token]);

  return (
    <ToolPage tool={tool}>
      <div className="space-y-4">
        <div className="rounded-3xl border border-border/60 bg-card/70 p-4">
          <h3 className="mb-2 text-sm font-semibold">JWT</h3>
          <Textarea className="min-h-28 font-mono text-xs break-all" value={token} onChange={(e) => setToken(e.target.value)} />
          {parsed.error ? (
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-destructive">
              <XCircle className="h-3.5 w-3.5" /> {parsed.error}
            </div>
          ) : (
            <div className="mt-2 inline-flex items-center gap-1 text-xs text-emerald-600">
              <CheckCircle2 className="h-3.5 w-3.5" /> Decoded
            </div>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Panel title="Header" body={parsed.header ?? "—"} accent="from-indigo-500 to-violet-500" file="jwt-header" />
          <Panel title="Payload" body={parsed.payload ?? "—"} accent="from-emerald-500 to-teal-500" file="jwt-payload" />
          <Panel title="Signature" body={parsed.signature ?? "—"} accent="from-rose-500 to-pink-500" mono file="jwt-signature" />
        </div>
      </div>
    </ToolPage>
  );
}

function Panel({ title, body, accent, mono, file }: { title: string; body: string; accent: string; mono?: boolean; file: string }) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70">
      <div className={`bg-gradient-to-r ${accent} px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white`}>
        {title}
      </div>
      <pre className={`min-h-48 overflow-auto p-4 text-xs ${mono ? "break-all font-mono" : "font-mono"}`}>
        {body}
      </pre>
      <div className="flex flex-wrap items-center gap-1 border-t border-border/60 px-2 py-2">
        <ResultActions content={body} baseName={file} markdown={false} />
      </div>
    </div>
  );
}
