import { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { CATEGORIES } from "@/config/categories";
import type { FacetCount } from "@/types/catalog";
import type { CatalogSearch } from "./search-params";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Props {
  search: CatalogSearch;
  brands: FacetCount[];
  onChange: (patch: Partial<CatalogSearch>) => void;
  onClear: () => void;
}

export function FilterPanel({ search, brands, onChange, onClear }: Props) {
  const selectedBrands = search.brands?.split(",").filter(Boolean) ?? [];
  const [min, setMin] = useState(search.minPrice?.toString() ?? "");
  const [max, setMax] = useState(search.maxPrice?.toString() ?? "");
  const [priceErr, setPriceErr] = useState("");
  useEffect(() => { setMin(search.minPrice?.toString() ?? ""); setMax(search.maxPrice?.toString() ?? ""); }, [search.minPrice, search.maxPrice]);

  const toggleBrand = (b: string) => {
    const next = selectedBrands.includes(b) ? selectedBrands.filter((x) => x !== b) : [...selectedBrands, b];
    onChange({ brands: next.length ? next.join(",") : undefined });
  };

  return (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Filters</h2>
        <Button variant="link" size="sm" onClick={onClear} className="px-0">Clear all</Button>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Category</legend>
        <div className="flex flex-col gap-1">
          <label className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm">
            <input type="radio" name="category" checked={!search.category} onChange={() => onChange({ category: undefined })} className="size-4 accent-primary" />
            All categories
          </label>
          {CATEGORIES.map((c) => (
            <label key={c.slug} className="flex cursor-pointer items-center gap-2 rounded-lg px-1 py-1 text-sm">
              <input type="radio" name="category" checked={search.category === c.slug} onChange={() => onChange({ category: c.slug, brands: undefined })} className="size-4 accent-primary" />
              {c.name}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Price (₹)</legend>
        <form
          className="flex items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const lo = min === "" ? undefined : Number(min);
            const hi = max === "" ? undefined : Number(max);
            if (lo !== undefined && hi !== undefined && lo > hi) return setPriceErr("Min must be less than max.");
            setPriceErr("");
            onChange({ minPrice: lo, maxPrice: hi });
          }}
        >
          <label className="flex-1 text-xs">Min
            <input inputMode="numeric" value={min} onChange={(e) => setMin(e.target.value.replace(/\D/g, ""))} className="mt-1 h-10 w-full rounded-xl border bg-card px-3 text-sm" />
          </label>
          <label className="flex-1 text-xs">Max
            <input inputMode="numeric" value={max} onChange={(e) => setMax(e.target.value.replace(/\D/g, ""))} className="mt-1 h-10 w-full rounded-xl border bg-card px-3 text-sm" />
          </label>
          <Button type="submit" size="sm" variant="plum" className="h-10">Go</Button>
        </form>
        {priceErr && <p role="alert" className="mt-1 text-xs text-destructive">{priceErr}</p>}
      </fieldset>

      {brands.length > 0 && (
        <fieldset>
          <legend className="mb-2 text-sm font-semibold">Brand</legend>
          <div className="flex flex-col gap-1">
            {brands.map((b) => (
              <label key={b.value} className="flex cursor-pointer items-center gap-2 px-1 py-1 text-sm">
                <input type="checkbox" checked={selectedBrands.includes(b.value)} onChange={() => toggleBrand(b.value)} className="size-4 accent-primary" />
                <span className="flex-1">{b.value}</span>
                <span className="text-xs text-muted-foreground">{b.count}</span>
              </label>
            ))}
          </div>
        </fieldset>
      )}

      <fieldset>
        <legend className="mb-2 text-sm font-semibold">Customer rating</legend>
        <div className="flex flex-wrap gap-2">
          {[4, 3, 2].map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={search.rating === r}
              onClick={() => onChange({ rating: search.rating === r ? undefined : r })}
              className={cn("inline-flex h-9 items-center gap-1 rounded-full border px-3 text-sm", search.rating === r ? "border-foreground bg-foreground text-background" : "bg-card hover:bg-muted")}
            >
              {r}<Star className="size-3.5 fill-current" aria-hidden /> & up
            </button>
          ))}
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold">
        <input type="checkbox" checked={!!search.inStock} onChange={(e) => onChange({ inStock: e.target.checked || undefined })} className="size-4 accent-primary" />
        In stock only
      </label>
    </div>
  );
}
