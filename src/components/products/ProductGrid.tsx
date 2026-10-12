import type { Product } from "@/types/catalog";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.id} className="flex">
          <div className="w-full"><ProductCard product={p} /></div>
        </li>
      ))}
    </ul>
  );
}

/** Horizontally scrollable row for homepage shelves. */
export function ProductRail({ products }: { products: Product[] }) {
  return (
    <ul className="-mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
      {products.map((p) => (
        <li key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[30%] lg:w-[23%]">
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  );
}
