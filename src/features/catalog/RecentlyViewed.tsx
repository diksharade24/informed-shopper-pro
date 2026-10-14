import { useQuery } from "@tanstack/react-query";
import { productsByIdsQuery } from "@/services/catalog";
import { usePrefs } from "@/store/preferences";
import { ProductRail } from "@/components/products/ProductGrid";

export function RecentlyViewed({ excludeId }: { excludeId?: string  | undefined}) {
  const ids = usePrefs((s) => s.recentlyViewed).filter((id) => id !== excludeId);
  const { data } = useQuery(productsByIdsQuery(ids));
  if (!ids.length || !data?.length) return null;
  const ordered = ids.map((id) => data.find((p) => p.id === id)).filter((p) => p !== undefined);
  return (
    <section className="mt-16" aria-labelledby="recent-h">
      <h2 id="recent-h" className="mb-5 text-2xl font-extrabold">Recently viewed</h2>
      <ProductRail products={ordered} />
    </section>
  );
}
