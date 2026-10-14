import { beforeEach, describe, expect, it } from "vitest";
import { queryProducts } from "@/services/catalog/mock";
import { SAMPLE_PRODUCTS } from "@/mocks/products";
import { selectCount, useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { discountPercent } from "@/lib/format";
import { validateCatalogSearch } from "@/features/catalog/search-params";

const byId = (id: string) => SAMPLE_PRODUCTS.find((p) => p.id === id)!;

describe("catalog query", () => {
  it("filters by category and sorts by price ascending", () => {
    const r = queryProducts(SAMPLE_PRODUCTS, { category: "electronics", sort: "price-asc", pageSize: 50 });
    expect(r.items.every((p) => p.category === "electronics")).toBe(true);
    expect(r.items[0].price).toBe(349);
  });
  it("paginates 12 per page", () => {
    const r = queryProducts(SAMPLE_PRODUCTS, { page: 2, pageSize: 12 });
    expect(r.items).toHaveLength(12);
    expect(r.totalPages).toBe(2);
  });
  it("in-stock filter excludes sold-out items", () => {
    const r = queryProducts(SAMPLE_PRODUCTS, { inStock: true, pageSize: 50 });
    expect(r.items.find((p) => p.id === "p4")).toBeUndefined();
  });
  it("drops invalid URL params", () => {
    expect(validateCatalogSearch({ category: "nope", sort: "bad", page: "-1" })).toEqual({});
  });
});

describe("cart", () => {
  beforeEach(() => useCart.setState({ lines: [] }));
  it("refuses out-of-stock products", () => {
    expect(useCart.getState().add(byId("p4")).ok).toBe(false);
  });
  it("requires a variant when the product has options", () => {
    expect(useCart.getState().add(byId("p1")).ok).toBe(false);
    expect(useCart.getState().add(byId("p1"), { variantId: "p1-lilac" }).ok).toBe(true);
  });
  it("merges same item and caps quantity at stock", () => {
    const watch = byId("p3");
    useCart.getState().add(watch, { variantId: "p3-mint", qty: 1 });
    useCart.getState().add(watch, { variantId: "p3-mint", qty: 5 });
    expect(useCart.getState().lines).toHaveLength(1);
    expect(selectCount(useCart.getState())).toBe(2);
  });
  it("uses variant price override", () => {
    useCart.getState().add(byId("p3"), { variantId: "p3-plum" });
    expect(useCart.getState().lines[0].unitPrice).toBe(3699);
  });
});

describe("wishlist & pricing", () => {
  it("toggle prevents duplicates", () => {
    useWishlist.setState({ ids: [] });
    useWishlist.getState().toggle("p1");
    useWishlist.getState().toggle("p1");
    expect(useWishlist.getState().ids).toEqual([]);
  });
  it("only shows discount when original price is higher", () => {
    expect(discountPercent(1899, 2999)).toBe(37);
    expect(discountPercent(500, 400)).toBeNull();
  });
});
