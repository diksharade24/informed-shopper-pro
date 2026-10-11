import type { Category, CategorySlug } from "@/types/catalog";

export const CATEGORIES: Category[] = [
  { slug: "electronics", name: "Electronics", blurb: "Gadgets that spark joy", tone: "lavender" },
  { slug: "fashion", name: "Fashion", blurb: "Fits for every mood", tone: "peach" },
  { slug: "beauty", name: "Beauty", blurb: "Glow, minus the fuss", tone: "mint" },
  { slug: "home-living", name: "Home & Living", blurb: "Make it cozy", tone: "butter" },
  { slug: "grocery", name: "Grocery", blurb: "Pantry heroes", tone: "mint" },
  { slug: "sports-fitness", name: "Sports & Fitness", blurb: "Move your way", tone: "peach" },
  { slug: "books-stationery", name: "Books & Stationery", blurb: "Read, write, doodle", tone: "butter" },
  { slug: "accessories", name: "Accessories", blurb: "Little extras", tone: "lavender" },
];

export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug);

export function getCategory(slug: string | undefined): Category | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

export function isCategorySlug(v: unknown): v is CategorySlug {
  return typeof v === "string" && (CATEGORY_SLUGS as string[]).includes(v);
}

export const TONE_BG: Record<Category["tone"], string> = {
  lavender: "bg-lavender",
  peach: "bg-peach",
  butter: "bg-butter",
  mint: "bg-mint",
};
