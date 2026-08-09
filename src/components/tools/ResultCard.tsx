import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIResponseRenderer } from "./AIResponseRenderer";
import { ResultActions } from "./ResultActions";

interface Props {
  markdown: string;
  filename?: string;
  onSave?: () => void;
  saved?: boolean;
}

export function ResultCard({ markdown, filename = "codemateai-result.md", onSave, saved }: Props) {
  return (
    <div className="overflow-hidden rounded-3xl border border-border/60 bg-card/70 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between border-b border-border/60 px-6 py-3">
        <h2 className="text-sm font-semibold">Result</h2>
        <div className="flex items-center gap-2">
          <ResultActions content={markdown} baseName={filename} />

          {onSave && (
            <Button
              size="sm"
              variant={saved ? "default" : "outline"}
              onClick={onSave}
            >
              <Star className={saved ? "h-4 w-4 fill-current" : "h-4 w-4"} />
              {saved ? "Saved" : "Save"}
            </Button>
          )}
        </div>
      </div>
      <div className="px-6 py-5">
        <AIResponseRenderer content={markdown} />
      </div>
    </div>
  );
}
