import { isCategorySlug } from "@/config/categories";
import type { CategorySlug, ProductQuery, SortOption } from "@/types/catalog";

export interface CatalogSearch {
  q?: string | undefined;
  category?: CategorySlug | undefined;
  /** Comma-separated brand names. */
  brands?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  rating?: number | undefined;
  inStock?: boolean | undefined;
  sort?: SortOption | undefined;
  page?: number | undefined;
}

const SORTS: SortOption[] = ["relevance", "price-asc", "price-desc", "rating", "newest"];

const num = (v: unknown) => {
  const n = typeof v === "number" ? v : typeof v === "string" && v !== "" ? Number(v) : NaN;
  return Number.isFinite(n) && n >= 0 ? n : undefined;
};

export function validateCatalogSearch(raw: Record<string, unknown>): CatalogSearch {
  const out: CatalogSearch = {};
  if (typeof raw.q === "string" && raw.q.trim()) out.q = raw.q.trim().slice(0, 100);
  if (isCategorySlug(raw.category)) out.category = raw.category;
  if (typeof raw.brands === "string" && raw.brands) out.brands = raw.brands;
  const minPrice = num(raw.minPrice);
  const maxPrice = num(raw.maxPrice);
  if (minPrice !== undefined) out.minPrice = minPrice;
  if (maxPrice !== undefined) out.maxPrice = maxPrice;
  const rating = num(raw.rating);
  if (rating && rating <= 5) out.rating = rating;
  if (raw.inStock === true || raw.inStock === "true") out.inStock = true;
  if (typeof raw.sort === "string" && (SORTS as string[]).includes(raw.sort) && raw.sort !== "relevance") out.sort = raw.sort as SortOption;
  const page = num(raw.page);
  if (page && page > 1) out.page = Math.floor(page);
  return out;
}

export function toProductQuery(s: CatalogSearch): ProductQuery {
  return {
    q: s.q,
    category: s.category,
    brands: s.brands ? s.brands.split(",").filter(Boolean) : undefined,
    minPrice: s.minPrice,
    maxPrice: s.maxPrice,
    minRating: s.rating,
    inStock: s.inStock,
    sort: s.sort ?? "relevance",
    page: s.page ?? 1,
    pageSize: 12,
  };
}

export const SORT_LABELS: Record<SortOption, string> = {
  relevance: "Relevance",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  rating: "Top rated",
  newest: "Newest",
};
