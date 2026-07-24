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
import { generateSql } from "@/lib/ai.functions";

const DIALECTS = ["PostgreSQL", "MySQL", "SQLite", "SQL Server"];
const OPS = ["Auto", "SELECT", "INSERT", "UPDATE", "DELETE", "JOIN", "GROUP BY", "ORDER BY", "HAVING", "Optimize", "Explain"];

export const Route = createFileRoute("/tools/sql-generator")({
  head: () => ({
    meta: [
      { title: "AI SQL Generator — CodeMateAI" },
      {
        name: "description",
        content:
          "Turn plain English into optimized SQL queries across PostgreSQL, MySQL, SQLite and SQL Server.",
      },
      { property: "og:title", content: "AI SQL Generator" },
      {
        property: "og:description",
        content: "Generate, optimize, and explain SQL queries in seconds.",
      },
    ],
  }),
  component: Page,
});

function Page() {
  const tool = findTool("sql-generator")!;
  const { prefs, set, reset } = useToolPreferences("sql-generator", {
    dialect: "PostgreSQL",
    operation: "Auto",
  });

  return (
    <SimpleAITool
      tool={tool}
      filename="query.sql.md"
      placeholder="Find the top 5 customers by revenue in the last 30 days…"
      examples={[
        "Top 5 customers by revenue in last 30 days",
        "Monthly signups grouped by plan",
        "Delete duplicate rows keeping the newest",
        "Join orders with users and calculate LTV",
        "Optimize this slow query with indexes",
      ]}
      onResetPrefs={reset}
      controls={
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label className="text-xs">Dialect</Label>
            <Select value={prefs.dialect} onValueChange={(v) => set("dialect", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {DIALECTS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Operation</Label>
            <Select value={prefs.operation} onValueChange={(v) => set("operation", v)}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {OPS.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      }
      run={(prompt) => generateSql({ data: { prompt, dialect: prefs.dialect, operation: prefs.operation } })}
    />
  );
}
