import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { productListQuery } from "@/services/catalog";
import { friendlyError } from "@/services/api-client";
import { getCategory } from "@/config/categories";
import { SORT_LABELS, toProductQuery, validateCatalogSearch, type CatalogSearch } from "@/features/catalog/search-params";
import { FilterPanel } from "@/features/catalog/FilterPanel";
import { ProductGrid } from "@/components/products/ProductGrid";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/feedback/States";
import { PagePagination } from "@/components/ui/page-pagination";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { SortOption } from "@/types/catalog";

export const Route = createFileRoute("/products/")({
  validateSearch: validateCatalogSearch,
  loaderDeps: ({ search }) => search,
  loader: ({ context, deps }) => {
    void context.queryClient.prefetchQuery(productListQuery(toProductQuery(deps)));
  },
  head: () => ({
    meta: [
      { title: "Shop all products — ShopSmart AI" },
      { name: "description", content: "Browse electronics, fashion, beauty, home, grocery and more. Filter by price, brand and rating." },
      { property: "og:title", content: "Shop all products — ShopSmart AI" },
      { property: "og:description", content: "Browse and filter the full ShopSmart AI catalog." },
    ],
  }),
  component: CatalogPage,
});

function CatalogPage() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/products/" });
  const [filtersOpen, setFiltersOpen] = useState(false);
  const { data, isPending, isError, error, refetch, isFetching } = useQuery({
    ...productListQuery(toProductQuery(search)),
    placeholderData: keepPreviousData,
  });

  const update = (patch: Partial<CatalogSearch>) =>
    void navigate({ to: ".", search: (prev) => ({ ...prev, ...patch, page: undefined }) });
  const clearAll = () => void navigate({ to: ".", search: search.q ? { q: search.q } : {} });
  const category = getCategory(search.category);
  const title = category?.name ?? (search.q ? `Results for “${search.q}”` : "All products");

  const chips: Array<{ label: string; patch: Partial<CatalogSearch> }> = [];
  if (search.q) chips.push({ label: `“${search.q}”`, patch: { q: undefined } });
  if (category) chips.push({ label: category.name, patch: { category: undefined } });
  search.brands?.split(",").forEach((b) => chips.push({ label: b, patch: { brands: search.brands?.split(",").filter((x) => x !== b).join(",") || undefined } }));
  if (search.minPrice !== undefined || search.maxPrice !== undefined) chips.push({ label: `₹${search.minPrice ?? 0} – ${search.maxPrice !== undefined ? `₹${search.maxPrice}` : "any"}`, patch: { minPrice: undefined, maxPrice: undefined } });
  if (search.rating) chips.push({ label: `${search.rating}★ & up`, patch: { rating: undefined } });
  if (search.inStock) chips.push({ label: "In stock", patch: { inStock: undefined } });

  const panel = <FilterPanel search={search} brands={data?.facets.brands ?? []} onChange={update} onClear={clearAll} />;

  return (
    <div className="container-page py-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1">
          <li><Link to="/" className="hover:text-foreground">Home</Link></li>
          <li aria-hidden><ChevronRight className="size-3.5" /></li>
          <li><Link to="/products" className="hover:text-foreground">Shop</Link></li>
          {category && (<><li aria-hidden><ChevronRight className="size-3.5" /></li><li aria-current="page" className="text-foreground">{category.name}</li></>)}
        </ol>
      </nav>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">{title}</h1>
          <p className="mt-1 text-sm text-muted-foreground" aria-live="polite">
            {data ? `${data.total} ${data.total === 1 ? "product" : "products"}` : "Loading…"}
            {category && ` · ${category.blurb}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="lg:hidden" onClick={() => setFiltersOpen(true)}>
            <SlidersHorizontal aria-hidden /> Filters{chips.length ? ` (${chips.length})` : ""}
          </Button>
          <label className="flex items-center gap-2 text-sm">
            <span className="hidden sm:inline">Sort by</span>
            <select
              aria-label="Sort products"
              value={search.sort ?? "relevance"}
              onChange={(e) => update({ sort: e.target.value === "relevance" ? undefined : (e.target.value as SortOption) })}
              className="h-10 rounded-full border bg-card px-4 text-sm font-medium"
            >
              {Object.entries(SORT_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
          </label>
        </div>
      </div>

      {chips.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2" aria-label="Active filters">
          {chips.map((c) => (
            <li key={c.label}>
              <button type="button" onClick={() => update(c.patch)} className="inline-flex h-8 items-center gap-1 rounded-full bg-lavender px-3 text-xs font-semibold hover:bg-secondary/70" aria-label={`Remove filter ${c.label}`}>
                {c.label} <X className="size-3.5" aria-hidden />
              </button>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-8 grid gap-8 lg:grid-cols-[240px_1fr]">
        <aside className="hidden lg:block" aria-label="Filters">{panel}</aside>
        <section aria-label="Products" className={isFetching && data ? "opacity-60 transition-opacity" : undefined}>
          {isPending ? (
            <ProductGridSkeleton />
          ) : isError ? (
            <ErrorState message={friendlyError(error)} onRetry={() => void refetch()} />
          ) : data.items.length === 0 ? (
            <EmptyState
              title="No matches (yet!)"
              body="Try removing a filter or searching for something a little different."
              action={<Button onClick={() => void navigate({ to: ".", search: {} })}>Clear search & filters</Button>}
            />
          ) : (
            <>
              <ProductGrid products={data.items} />
              <PagePagination
                page={data.page}
                totalPages={data.totalPages}
                onPage={(p) => {
                  void navigate({ to: ".", search: (prev) => ({ ...prev, page: p > 1 ? p : undefined }) });
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            </>
          )}
        </section>
      </div>

      <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
        <SheetContent side="left" className="w-[88vw] max-w-sm overflow-y-auto bg-background px-5 pb-24">
          <SheetHeader className="px-0"><SheetTitle className="sr-only">Filters</SheetTitle></SheetHeader>
          {panel}
          <div className="fixed bottom-0 left-0 w-[88vw] max-w-sm border-t bg-background p-4">
            <Button className="w-full" onClick={() => setFiltersOpen(false)}>Show {data?.total ?? ""} results</Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
