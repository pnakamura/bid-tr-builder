import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

export const CardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("space-y-3", className)}>
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-20 w-full" />
  </div>
);

export const StatCardSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("p-6 border rounded-lg space-y-4", className)}>
    <div className="flex items-center justify-between">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-8 rounded-full" />
    </div>
    <Skeleton className="h-8 w-16" />
    <Skeleton className="h-3 w-20" />
  </div>
);

export const FormSkeleton = ({ className }: { className?: string }) => (
  <div className={cn("space-y-6", className)}>
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-10 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-24 w-full" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-28" />
      <Skeleton className="h-10 w-full" />
    </div>
  </div>
);

export const TableSkeleton = ({ rows = 5, className }: { rows?: number; className?: string }) => (
  <div className={cn("space-y-2", className)}>
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-3 border rounded">
        <Skeleton className="h-4 w-4 rounded" />
        <Skeleton className="h-4 flex-1" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-20" />
      </div>
    ))}
  </div>
);