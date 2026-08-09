import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ToolPage } from "@/components/tools/ToolPage";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { findTool } from "@/features/tools/registry";
import { ResultActions } from "@/components/tools/ResultActions";

export const Route = createFileRoute("/utilities/base64")({
  head: () => ({
    meta: [
      { title: "Base64 Encoder / Decoder — CodeMateAI" },
      { name: "description", content: "Encode and decode Base64 strings in your browser." },
    ],
  }),
  component: Page,
});

function safeEncode(v: string) {
  try {
    return btoa(unescape(encodeURIComponent(v)));
  } catch {
    return "";
  }
}
function safeDecode(v: string) {
  try {
    return decodeURIComponent(escape(atob(v)));
  } catch {
    return "Invalid Base64";
  }
}

function Page() {
  const tool = findTool("base64")!;
  const [encodeIn, setEncodeIn] = useState("Hello, CodeMateAI!");
  const [decodeIn, setDecodeIn] = useState("SGVsbG8sIENvZGVNYXRlQUkh");

  return (
    <ToolPage tool={tool}>
      <Tabs defaultValue="encode" className="w-full">
        <TabsList>
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>
        <TabsContent value="encode" className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-border/60 bg-card/70 p-4">
            <h3 className="mb-2 text-sm font-semibold">Plain text</h3>
            <Textarea className="min-h-64 font-mono text-xs" value={encodeIn} onChange={(e) => setEncodeIn(e.target.value)} />
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/70 p-4">
            <h3 className="mb-2 text-sm font-semibold">Base64</h3>
            <pre className="min-h-64 overflow-auto rounded-2xl border border-border/60 bg-muted/40 p-4 font-mono text-xs break-all">
              {safeEncode(encodeIn)}
            </pre>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <ResultActions content={safeEncode(encodeIn)} baseName="base64-encoded" markdown={false} />
            </div>
          </div>
        </TabsContent>
        <TabsContent value="decode" className="grid gap-4 md:grid-cols-2">
          <div className="rounded-3xl border border-border/60 bg-card/70 p-4">
            <h3 className="mb-2 text-sm font-semibold">Base64</h3>
            <Textarea className="min-h-64 font-mono text-xs" value={decodeIn} onChange={(e) => setDecodeIn(e.target.value)} />
          </div>
          <div className="rounded-3xl border border-border/60 bg-card/70 p-4">
            <h3 className="mb-2 text-sm font-semibold">Plain text</h3>
            <pre className="min-h-64 overflow-auto rounded-2xl border border-border/60 bg-muted/40 p-4 font-mono text-xs">
              {safeDecode(decodeIn)}
            </pre>
            <div className="mt-2 flex flex-wrap items-center gap-1">
              <ResultActions content={safeDecode(decodeIn)} baseName="base64-decoded" markdown={false} />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </ToolPage>
  );
}
