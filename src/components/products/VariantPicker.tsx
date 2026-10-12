import type { Product } from "@/types/catalog";
import { cn } from "@/lib/utils";

export function VariantPicker({ product, value, onChange }: { product: Product; value?: string; onChange: (id: string) => void }) {
  if (!product.variants?.length) return null;
  const groupId = `variant-${product.id}`;
  return (
    <fieldset>
      <legend id={groupId} className="mb-2 text-sm font-semibold">
        {product.variantGroup ?? "Option"}
        {value && <span className="font-normal text-muted-foreground">: {product.variants.find((v) => v.id === value)?.label}</span>}
      </legend>
      <div role="radiogroup" aria-labelledby={groupId} className="flex flex-wrap gap-2">
        {product.variants.map((v) => {
          const out = v.stock <= 0;
          const selected = v.id === value;
          return (
            <button
              key={v.id}
              type="button"
              role="radio"
              aria-checked={selected}
              disabled={out}
              onClick={() => onChange(v.id)}
              className={cn(
                "min-h-10 min-w-12 rounded-full border px-4 text-sm font-medium transition-colors",
                selected ? "border-foreground bg-foreground text-background" : "bg-card hover:bg-accent",
                out && "cursor-not-allowed line-through opacity-50",
              )}
            >
              {v.label}
              {out && <span className="sr-only"> (out of stock)</span>}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
