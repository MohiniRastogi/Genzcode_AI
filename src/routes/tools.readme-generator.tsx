import { createFileRoute } from "@tanstack/react-router";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
import { generateReadme } from "@/lib/ai.functions";

const LICENSES = ["MIT", "Apache-2.0", "GPL-3.0", "BSD-3-Clause", "Unlicense", "Proprietary"];

export const Route = createFileRoute("/tools/readme-generator")({
  head: () => ({
    meta: [
      { title: "AI README Generator — CodeMateAI" },
      {
        name: "description",
        content:
          "Generate a professional README.md with badges, installation, usage, features, screenshots, contributing and license.",
      },
      { property: "og:title", content: "AI README Generator" },
      {
        property: "og:description",
        content: "Beautiful project READMEs, complete with badges and structure.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const tool = findTool("readme-generator")!;
  const { prefs, set, reset } = useToolPreferences("readme-generator", {
    projectName: "",
    tech: "",
    license: "MIT",
  });

  return (
    <SimpleAITool
      tool={tool}
      filename="README.md"
      placeholder="A CLI that converts JSON schemas into TypeScript types…"
      examples={[
        "A React dashboard for tracking crypto portfolios",
        "A FastAPI service that summarizes PDFs with AI",
        "A CLI that converts JSON schemas to TypeScript",
        "A mobile app for habit tracking built with Flutter",
      ]}
      onResetPrefs={reset}
      controls={
        <div className="space-y-3">
          <div>
            <Label className="text-xs">Project name</Label>
            <Input
              className="mt-1"
              value={prefs.projectName}
              onChange={(e) => set("projectName", e.target.value)}
              placeholder="my-awesome-project"
            />
          </div>
          <div>
            <Label className="text-xs">Technologies</Label>
            <Input
              className="mt-1"
              value={prefs.tech}
              onChange={(e) => set("tech", e.target.value)}
              placeholder="React, TypeScript, Tailwind"
            />
          </div>
          <div>
            <Label className="text-xs">License</Label>
            <Select value={prefs.license} onValueChange={(v) => set("license", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {LICENSES.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      run={(prompt) =>
        generateReadme({
          data: {
            prompt,
            projectName: prefs.projectName,
            tech: prefs.tech,
            license: prefs.license,
          },
        })
      }
    />
  );
}
