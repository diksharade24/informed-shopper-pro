import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function PagePagination({ page, totalPages, onPage }: { page: number; totalPages: number; onPage: (p: number) => void }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  const btn = "inline-flex size-10 items-center justify-center rounded-full border bg-card text-sm font-semibold disabled:opacity-40";
  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-2">
      <button type="button" className={btn} disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label="Previous page"><ChevronLeft className="size-4" /></button>
      {pages.map((p) => (
        <button key={p} type="button" aria-current={p === page ? "page" : undefined} onClick={() => onPage(p)} className={cn(btn, p === page && "border-foreground bg-foreground text-background")}>
          {p}
        </button>
      ))}
      <button type="button" className={btn} disabled={page >= totalPages} onClick={() => onPage(page + 1)} aria-label="Next page"><ChevronRight className="size-4" /></button>
    </nav>
  );
}
