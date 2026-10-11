import { queryOptions } from "@tanstack/react-query";
import { env } from "@/config/env";
import type { ProductQuery } from "@/types/catalog";
import { httpCatalogService } from "./http";
import { createMockCatalogService } from "./mock";
import type { CatalogService } from "./types";

export const catalogService: CatalogService = env.useMocks ? createMockCatalogService() : httpCatalogService;
export const isMockMode = env.useMocks;

export const catalogKeys = {
  all: ["catalog"] as const,
  list: (q: ProductQuery) => ["catalog", "list", q] as const,
  product: (slug: string) => ["catalog", "product", slug] as const,
  byIds: (ids: string[]) => ["catalog", "byIds", [...ids].sort()] as const,
  related: (id: string) => ["catalog", "related", id] as const,
  brands: ["catalog", "brands"] as const,
  campaigns: ["catalog", "campaigns"] as const,
};

export const productListQuery = (q: ProductQuery) =>
  queryOptions({
    queryKey: catalogKeys.list(q),
    queryFn: ({ signal }) => catalogService.listProducts(q, signal),
    staleTime: 60_000,
  });

export const productQuery = (slug: string) =>
  queryOptions({
    queryKey: catalogKeys.product(slug),
    queryFn: ({ signal }) => catalogService.getProduct(slug, signal),
    staleTime: 60_000,
  });

export const productsByIdsQuery = (ids: string[]) =>
  queryOptions({
    queryKey: catalogKeys.byIds(ids),
    queryFn: ({ signal }) => catalogService.getProductsByIds(ids, signal),
    enabled: ids.length > 0,
  });

export const relatedQuery = (id: string) =>
  queryOptions({
    queryKey: catalogKeys.related(id),
    queryFn: ({ signal }) => catalogService.getRelated(id, signal),
    staleTime: 5 * 60_000,
  });

export const brandsQuery = () =>
  queryOptions({ queryKey: catalogKeys.brands, queryFn: ({ signal }) => catalogService.listBrands(signal), staleTime: 10 * 60_000 });

export const campaignsQuery = () =>
  queryOptions({ queryKey: catalogKeys.campaigns, queryFn: ({ signal }) => catalogService.listCampaigns(signal), staleTime: 5 * 60_000 });
