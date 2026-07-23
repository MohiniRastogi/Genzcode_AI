import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonResult() {
  return (
    <div className="space-y-4 rounded-3xl border border-border/60 bg-card/60 p-6 backdrop-blur-sm">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-11/12" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-2/3" />
    </div>
  );
}
