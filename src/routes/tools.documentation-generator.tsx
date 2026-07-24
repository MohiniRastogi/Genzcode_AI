import { createFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SimpleAITool } from "@/components/tools/SimpleAITool";
import { findTool } from "@/features/tools/registry";
import { useToolPreferences } from "@/features/preferences/useToolPreferences";
import { generateDocs } from "@/lib/ai.functions";

const DOC_TYPES = ["API Docs", "Function Docs", "Class Docs", "Project Docs"];
const FORMATS = ["Markdown", "HTML", "JSDoc", "Python Docstrings", "Java Docs"];
const LANGS = ["auto", "JavaScript", "TypeScript", "Python", "Java", "Go", "C#", "PHP", "Ruby"];

export const Route = createFileRoute("/tools/documentation-generator")({
  head: () => ({
    meta: [
      { title: "AI Documentation Generator — CodeMateAI" },
      {
        name: "description",
        content:
          "Generate API, function, class and project documentation in Markdown, HTML, JSDoc, Python docstrings or Javadoc.",
      },
      { property: "og:title", content: "AI Documentation Generator" },
      {
        property: "og:description",
        content: "Document any codebase in seconds — pick your format and language.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const tool = findTool("documentation-generator")!;
  const { prefs, set, reset } = useToolPreferences("documentation-generator", {
    docType: "API Docs",
    format: "Markdown",
    language: "auto",
  });

  return (
    <SimpleAITool
      tool={tool}
      filename="docs.md"
      placeholder="Paste code, or describe a module to document…"
      examples={[
        "Document this Express router with JSDoc",
        "Generate Python docstrings for a data-cleaning script",
        "Write API reference for a REST endpoint",
        "Explain and document a React hook",
      ]}
      onResetPrefs={reset}
      controls={
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Doc type</Label>
              <Select value={prefs.docType} onValueChange={(v) => set("docType", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DOC_TYPES.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Format</Label>
              <Select value={prefs.format} onValueChange={(v) => set("format", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FORMATS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Language</Label>
            <Select value={prefs.language} onValueChange={(v) => set("language", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LANGS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      run={(prompt) =>
        generateDocs({
          data: {
            code: prompt,
            docType: prefs.docType,
            format: prefs.format,
            language: prefs.language,
          },
        })
      }
    />
  );
}
