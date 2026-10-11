import type {
  Campaign,
  Product,
  ProductListResponse,
  ProductQuery,
  SearchSuggestion,
  DiscoveryResult,
} from "@/types/catalog";

/** Contract shared by mock and HTTP implementations. Components only depend on this. */
export interface CatalogService {
  listProducts(query: ProductQuery, signal?: AbortSignal): Promise<ProductListResponse>;
  getProduct(slug: string, signal?: AbortSignal): Promise<Product | null>;
  getProductsByIds(ids: string[], signal?: AbortSignal): Promise<Product[]>;
  getRelated(productId: string, signal?: AbortSignal): Promise<Product[]>;
  suggest(q: string, signal?: AbortSignal): Promise<SearchSuggestion[]>;
  listBrands(signal?: AbortSignal): Promise<string[]>;
  listCampaigns(signal?: AbortSignal): Promise<Campaign[]>;
  discover(prompt: string, signal?: AbortSignal): Promise<DiscoveryResult>;
}
