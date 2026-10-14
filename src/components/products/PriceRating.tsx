import { Star } from "lucide-react";
import { discountPercent, formatPrice, stockLabel } from "@/lib/format";
import { cn } from "@/lib/utils";

export function PriceDisplay({ price, originalPrice, size = "md" }: { price: number; originalPrice?: number | undefined; size?: "md" | "lg" }) {
  const off = discountPercent(price, originalPrice);
  return (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
      <span className={cn("font-display font-bold", size === "lg" ? "text-3xl" : "text-lg")}>{formatPrice(price)}</span>
      {off !== null && originalPrice && (
        <>
          <span className="text-sm text-muted-foreground line-through">
            <span className="sr-only">Original price </span>
            {formatPrice(originalPrice)}
          </span>
          <span className="rounded-full bg-mint px-2 py-0.5 text-xs font-semibold text-success">{off}% off</span>
        </>
      )}
    </div>
  );
}

export function RatingDisplay({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5 text-sm">
      <span className="inline-flex items-center gap-1 rounded-full bg-butter px-2 py-0.5 font-semibold">
        <Star className="size-3.5 fill-current" aria-hidden />
        {rating.toFixed(1)}
      </span>
      <span className="text-muted-foreground">
        ({count.toLocaleString("en-IN")}<span className="sr-only"> reviews</span>)
      </span>
      <span className="sr-only">Rated {rating.toFixed(1)} out of 5</span>
    </div>
  );
}

export function StockBadge({ stock }: { stock: number }) {
  const s = stockLabel(stock);
  return (
    <span
      className={cn(
        "text-xs font-medium",
        s.tone === "ok" && "text-success",
        s.tone === "low" && "text-warning",
        s.tone === "out" && "text-destructive",
      )}
    >
      {s.label}
    </span>
  );
}
