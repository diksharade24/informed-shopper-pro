import type { ReactNode } from "react";
import { AlertCircle, PackageSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export function EmptyState({ title, body, action, icon }: { title: string; body?: string; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex flex-col items-center rounded-3xl border border-dashed bg-card px-6 py-14 text-center">
      <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-lavender">
        {icon ?? <PackageSearch className="size-7" aria-hidden />}
      </div>
      <h2 className="text-xl font-bold">{title}</h2>
      {body && <p className="mt-2 max-w-md text-muted-foreground">{body}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div role="alert" className="flex flex-col items-center rounded-3xl bg-peach/60 px-6 py-12 text-center">
      <AlertCircle className="mb-3 size-8 text-destructive" aria-hidden />
      <h2 className="text-lg font-bold">Oops, that didn't load</h2>
      <p className="mt-1 text-muted-foreground">{message}</p>
      {onRetry && (
        <Button className="mt-5" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4" aria-busy="true" aria-label="Loading products">
      {Array.from({ length: count }, (_, i) => (
        <div key={i} className="rounded-3xl border bg-card p-3">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="mt-3 h-3 w-1/3" />
          <Skeleton className="mt-2 h-4 w-4/5" />
          <Skeleton className="mt-3 h-5 w-1/2" />
        </div>
      ))}
    </div>
  );
}
