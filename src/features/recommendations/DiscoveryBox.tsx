import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Sparkles } from "lucide-react";
import { catalogService } from "@/services/catalog";
import { friendlyError } from "@/services/api-client";
import { getCategory } from "@/config/categories";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/feedback/States";

export function DiscoveryBox({ placeholder = "I need comfortable headphones under ₹2,000 for online classes." }: { placeholder?: string }) {
  const [text, setText] = useState("");
  const m = useMutation({ mutationFn: (prompt: string) => catalogService.discover(prompt) });

  return (
    <div>
      <form
        className="flex flex-col gap-3 sm:flex-row"
        onSubmit={(e) => {
          e.preventDefault();
          if (text.trim().length >= 3) m.mutate(text.trim());
        }}
      >
        <label htmlFor="discover" className="sr-only">Describe what you're looking for</label>
        <input id="discover" value={text} onChange={(e) => setText(e.target.value)} placeholder={placeholder} maxLength={300}
          className="h-12 flex-1 rounded-full border bg-card px-5 text-sm" />
        <Button type="submit" size="lg" disabled={m.isPending || text.trim().length < 3}>
          <Sparkles aria-hidden /> {m.isPending ? "Finding…" : "Find it"}
        </Button>
      </form>
      <div className="mt-6" aria-live="polite">
        {m.isPending && <ProductGridSkeleton count={4} />}
        {m.isError && <ErrorState message={friendlyError(m.error)} onRetry={() => m.mutate(text.trim())} />}
        {m.data && (
          <div className="space-y-5">
            <div className="rounded-2xl bg-card p-4 text-sm">
              <p className="font-semibold">What we understood</p>
              <ul className="mt-2 flex flex-wrap gap-2">
                {m.data.interpreted.budgetMax && <li className="rounded-full bg-butter px-3 py-1">Budget ≤ {formatPrice(m.data.interpreted.budgetMax)}</li>}
                {m.data.interpreted.category && <li className="rounded-full bg-lavender px-3 py-1">{getCategory(m.data.interpreted.category)?.name}</li>}
                {m.data.interpreted.keywords.map((k) => <li key={k} className="rounded-full bg-mint px-3 py-1">{k}</li>)}
              </ul>
              {m.data.source === "sample-rules" && (
                <p className="mt-3 text-xs text-muted-foreground">Sample mode: simple keyword matching on demo data — not AI predictions.</p>
              )}
            </div>
            {m.data.products.length ? <ProductGrid products={m.data.products} /> : <EmptyState title="Nothing matched that" body="Try naming a product type or a different budget." />}
          </div>
        )}
      </div>
    </div>
  );
}
