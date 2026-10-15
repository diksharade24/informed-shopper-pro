import { CATEGORIES } from "@/config/categories";
import { SAMPLE_CAMPAIGNS, SAMPLE_PRODUCTS } from "@/mocks/products";
import type { CategorySlug, Product, ProductQuery } from "@/types/catalog";
import type { CatalogService } from "./types";
import { ApiError } from "../api-client";

const delay = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve, reject) => {
    const t = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => {
      clearTimeout(t);
      reject(new ApiError("aborted", 0, "aborted"));
    });
  });

const matches = (p: Product, q: string) => {
  const hay = `${p.name} ${p.brand} ${p.category} ${p.tags.join(" ")}`.toLowerCase();
  return q.toLowerCase().split(/\s+/).filter(Boolean).every((t) => hay.includes(t));
};

const relevance = (p: Product, q?: string) => {
  if (!q) return p.reviewCount;
  return (p.name.toLowerCase().includes(q.toLowerCase()) ? 10_000 : 0) + p.reviewCount;
};

/** Pure filtering logic — mirrors what the backend is expected to do server-side. */
export function queryProducts(all: Product[], query: ProductQuery) {
  const pageSize = query.pageSize ?? 12;
  let list = all;
  if (query.q) list = list.filter((p) => matches(p, query.q ?? ""));
  if (query.category) list = list.filter((p) => p.category === query.category);
  // Brand facets reflect everything except the brand filter itself.
  const brandBase = list;
  if (query.brands?.length) list = list.filter((p) => query.brands?.includes(p.brand));
  if (query.minPrice !== undefined) list = list.filter((p) => p.price >= (query.minPrice ?? 0));
  if (query.maxPrice !== undefined) list = list.filter((p) => p.price <= (query.maxPrice ?? Infinity));
  if (query.minRating) list = list.filter((p) => p.rating >= (query.minRating ?? 0));
  if (query.inStock) list = list.filter((p) => p.stock > 0);

  const sorted = [...list];
  switch (query.sort) {
    case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
    case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
    case "rating": sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount); break;
    case "newest": sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt)); break;
    default: sorted.sort((a, b) => relevance(b, query.q) - relevance(a, query.q));
  }

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = Math.min(Math.max(1, query.page ?? 1), totalPages);
  const brandCounts = new Map<string, number>();
  for (const p of brandBase) brandCounts.set(p.brand, (brandCounts.get(p.brand) ?? 0) + 1);
  const prices = brandBase.map((p) => p.price);

  return {
    items: sorted.slice((page - 1) * pageSize, page * pageSize),
    total, page, pageSize, totalPages,
    facets: {
      brands: [...brandCounts].map(([value, count]) => ({ value, count })).sort((a, b) => a.value.localeCompare(b.value)),
      priceMin: prices.length ? Math.min(...prices) : 0,
      priceMax: prices.length ? Math.max(...prices) : 0,
    },
  };
}

const KEYWORD_CATEGORY: Array<[RegExp, CategorySlug]> = [
  [/headphone|earphone|speaker|watch|camera|audio/, "electronics"],
  [/backpack|bag|tote|sunglass/, "accessories"],
  [/shirt|tee|jacket|sneaker|shoe/, "fashion"],
  [/serum|lipstick|perfume|skin/, "beauty"],
  [/yoga|dumbbell|gym|workout/, "sports-fitness"],
  [/book|journal|notebook/, "books-stationery"],
  [/coffee|honey/, "grocery"],
  [/lamp|mug|chair|plant/, "home-living"],
];

export function createMockCatalogService(products: Product[] = SAMPLE_PRODUCTS, latency = 350): CatalogService {
  return {
    async listProducts(query, signal) {
      await delay(latency, signal);
      return queryProducts(products, query);
    },
    async getProduct(slug, signal) {
      await delay(latency, signal);
      return products.find((p) => p.slug === slug) ?? null;
    },
    async getProductsByIds(ids, signal) {
      await delay(latency / 2, signal);
      return products.filter((p) => ids.includes(p.id));
    },
    async getRelated(productId, signal) {
      await delay(latency, signal);
      const base = products.find((p) => p.id === productId);
      if (!base) return [];
      return products.filter((p) => p.category === base.category && p.id !== productId).slice(0, 8);
    },
    async suggest(q, signal) {
      await delay(150, signal);
      const term = q.trim().toLowerCase();
      if (!term) return [];
      const cats = CATEGORIES.filter((c) => c.name.toLowerCase().includes(term)).map((c) => ({ type: "category" as const, label: c.name, value: c.slug }));
      const brands = [...new Set(products.map((p) => p.brand))].filter((b) => b.toLowerCase().includes(term)).map((b) => ({ type: "brand" as const, label: b, value: b }));
      const prods = products.filter((p) => matches(p, term)).slice(0, 5).map((p) => ({ type: "product" as const, label: p.name, value: p.slug }));
      return [...cats, ...brands, ...prods].slice(0, 8);
    },
    async listBrands(signal) {
      await delay(latency / 2, signal);
      return [...new Set(products.map((p) => p.brand))].sort();
    },
    async listCampaigns(signal) {
      await delay(latency / 2, signal);
      return SAMPLE_CAMPAIGNS;
    },
    async discover(prompt, signal) {
      await delay(600, signal);
      const text = prompt.toLowerCase();
      const budgetMatch = text.match(/(?:under|below|less than|within|upto|up to)\s*(?:₹|rs\.?|inr)?\s*([\d,]+)/);
      const budgetMax = budgetMatch ? Number((budgetMatch[1] ?? "").replace(/,/g, "")) : undefined;
      const category = KEYWORD_CATEGORY.find(([re]) => re.test(text))?.[1];
      const keywords = products
        .flatMap((p) => p.tags)
        .filter((t, i, arr) => arr.indexOf(t) === i && text.includes(t));
      const scored = products
        .filter((p) => (budgetMax ? p.price <= budgetMax : true))
        .filter((p) => (category ? p.category === category : true))
        .map((p) => ({ p, score: p.tags.filter((t) => keywords.includes(t)).length }))
        .filter((x) => x.score > 0 || (!keywords.length && category))
        .sort((a, b) => b.score - a.score || b.p.rating - a.p.rating);
      return { interpreted: { budgetMax, category, keywords }, products: scored.map((x) => x.p).slice(0, 6), source: "sample-rules" };
    },
  };
}
