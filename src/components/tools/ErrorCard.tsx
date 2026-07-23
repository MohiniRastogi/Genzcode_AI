import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ErrorCard({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const message = error instanceof Error ? error.message : String(error ?? "Unknown error");
  return (
    <div className="flex items-start gap-4 rounded-3xl border border-destructive/30 bg-destructive/5 p-6">
      <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
        <AlertTriangle className="h-5 w-5" />
      </div>
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-destructive">Something went wrong</h3>
        <p className="mt-1 text-sm text-muted-foreground">{message}</p>
        {onRetry && (
          <Button onClick={onRetry} size="sm" variant="outline" className="mt-4 gap-2">
            <RefreshCw className="h-3.5 w-3.5" /> Try again
          </Button>
        )}
      </div>
    </div>
  );
}
