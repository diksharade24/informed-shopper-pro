import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Heart } from "lucide-react";
import { productsByIdsQuery } from "@/services/catalog";
import { friendlyError } from "@/services/api-client";
import { useWishlist } from "@/store/wishlist";
import { Button } from "@/components/ui/button";
import { EmptyState, ErrorState, ProductGridSkeleton } from "@/components/feedback/States";
import { ProductGrid } from "@/components/products/ProductGrid";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Your wishlist — ShopSmart AI" },
      { name: "description", content: "Products you've saved for later on ShopSmart AI." },
      { property: "og:title", content: "Your wishlist — ShopSmart AI" },
      { property: "og:description", content: "Products you've saved for later." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const { data, isPending, isError, error, refetch } = useQuery(productsByIdsQuery(ids));
  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Your wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">Saved on this device. Sign-in sync arrives with accounts.</p>
      <div className="mt-8">
        {!ids.length ? (
          <EmptyState icon={<Heart className="size-7" />} title="Nothing saved yet" body="Tap the heart on any product to keep it here." action={<Button asChild><Link to="/products">Find something you love</Link></Button>} />
        ) : isPending ? <ProductGridSkeleton count={4} /> : isError ? <ErrorState message={friendlyError(error)} onRetry={() => void refetch()} /> : <ProductGrid products={data} />}
      </div>
    </div>
  );
}
