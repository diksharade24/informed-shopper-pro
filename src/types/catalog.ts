export type CategorySlug =
  | "electronics"
  | "fashion"
  | "beauty"
  | "home-living"
  | "grocery"
  | "sports-fitness"
  | "books-stationery"
  | "accessories";

export interface Category {
  slug: CategorySlug;
  name: string;
  blurb: string;
  tone: "lavender" | "peach" | "butter" | "mint";
}

export interface ProductVariant {
  id: string;
  label: string;
  /** Overrides product price when set. */
  price?: number;
  stock: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: CategorySlug;
  description: string;
  highlights: string[];
  specs: Record<string, string>;
  images: string[];
  /** Current price in INR (paise not used in mock). */
  price: number;
  /** Only set when strictly greater than price. */
  originalPrice?: number;
  rating: number;
  reviewCount: number;
  stock: number;
  createdAt: string;
  variantGroup?: string;
  variants?: ProductVariant[];
  returnPolicy?: string;
  tags: string[];
}

export type SortOption = "relevance" | "price-asc" | "price-desc" | "rating" | "newest";

export interface ProductQuery {
  q?: string;
  category?: CategorySlug;
  brands?: string[];
  minPrice?: number;
  maxPrice?: number;
  minRating?: number;
  inStock?: boolean;
  sort?: SortOption;
  page?: number;
  pageSize?: number;
}

export interface FacetCount {
  value: string;
  count: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ProductListResponse extends Paginated<Product> {
  facets: { brands: FacetCount[]; priceMin: number; priceMax: number };
}

export interface SearchSuggestion {
  type: "product" | "category" | "brand";
  label: string;
  value: string;
}

export interface Campaign {
  id: string;
  title: string;
  description: string;
  terms: string;
  tone: "lavender" | "peach" | "butter" | "mint";
  category?: CategorySlug;
  /** ISO date; only shown when provided by the backend. */
  endsAt?: string;
}

export interface DiscoveryResult {
  interpreted: { budgetMax?: number; category?: CategorySlug; keywords: string[] };
  products: Product[];
  source: "sample-rules" | "ai-service";
}
