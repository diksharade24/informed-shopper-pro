import { apiRequest } from "../api-client";
import type { CatalogService } from "./types";
import type { Campaign, DiscoveryResult, Product, ProductListResponse, SearchSuggestion } from "@/types/catalog";

/** FastAPI implementation. Endpoint paths are the agreed contract for the backend team. */
export const httpCatalogService: CatalogService = {
  listProducts: (q, signal) =>
    apiRequest<ProductListResponse>("/products", {
      signal,
      query: {
        q: q.q, category: q.category, brands: q.brands, min_price: q.minPrice, max_price: q.maxPrice,
        min_rating: q.minRating, in_stock: q.inStock, sort: q.sort, page: q.page, page_size: q.pageSize,
      },
    }),
  getProduct: (slug, signal) => apiRequest<Product | null>(`/products/${encodeURIComponent(slug)}`, { signal }),
  getProductsByIds: (ids, signal) => apiRequest<Product[]>("/products/batch", { signal, query: { ids } }),
  getRelated: (id, signal) => apiRequest<Product[]>(`/products/${id}/related`, { signal }),
  suggest: (q, signal) => apiRequest<SearchSuggestion[]>("/search/suggest", { signal, query: { q } }),
  listBrands: (signal) => apiRequest<string[]>("/brands", { signal }),
  listCampaigns: (signal) => apiRequest<Campaign[]>("/campaigns/active", { signal }),
  discover: (prompt, signal) =>
    apiRequest<DiscoveryResult>("/recommendations/discover", { method: "POST", body: { prompt }, signal }),
};
