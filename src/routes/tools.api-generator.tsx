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
import { generateApi } from "@/lib/ai.functions";

const FRAMEWORKS = ["Express", "Node (Fastify)", "FastAPI", "Flask", "Django", "Spring Boot"];
const AUTHS = ["None", "JWT", "OAuth 2.0", "API Key", "Session"];

export const Route = createFileRoute("/tools/api-generator")({
  head: () => ({
    meta: [
      { title: "AI API Generator — CodeMateAI" },
      {
        name: "description",
        content:
          "Generate full REST APIs — Express, FastAPI, Flask, Django, Spring Boot — with authentication, CRUD, pagination and Swagger.",
      },
      { property: "og:title", content: "AI API Generator" },
      {
        property: "og:description",
        content: "Production-ready REST APIs with auth, CRUD and Postman collection.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const tool = findTool("api-generator")!;
  const { prefs, set, reset } = useToolPreferences("api-generator", {
    framework: "Express",
    auth: "JWT",
    features: "CRUD, pagination, validation, Swagger, error handling",
  });

  return (
    <SimpleAITool
      tool={tool}
      filename="api.md"
      placeholder="Build a Products API with categories and reviews…"
      examples={[
        "Blog API with posts, comments and tags",
        "E-commerce Products API with categories",
        "User auth API with signup, login, refresh",
        "File upload API with S3",
        "Todo API with pagination and search",
      ]}
      onResetPrefs={reset}
      controls={
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Framework</Label>
              <Select value={prefs.framework} onValueChange={(v) => set("framework", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FRAMEWORKS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Authentication</Label>
              <Select value={prefs.auth} onValueChange={(v) => set("auth", v)}>
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {AUTHS.map((f) => <SelectItem key={f} value={f}>{f}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="text-xs">Features</Label>
            <Input
              className="mt-1"
              value={prefs.features}
              onChange={(e) => set("features", e.target.value)}
              placeholder="CRUD, pagination, Swagger…"
            />
          </div>
        </div>
      }
      run={(prompt) =>
        generateApi({
          data: {
            prompt,
            framework: prefs.framework,
            auth: prefs.auth,
            features: prefs.features,
          },
        })
      }
    />
  );
}
