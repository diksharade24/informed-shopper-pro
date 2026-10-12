import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Eye, ShoppingBag } from "lucide-react";
import type { Product } from "@/types/catalog";
import { Button } from "@/components/ui/button";
import { ProductImage } from "./ProductImage";
import { PriceDisplay, RatingDisplay, StockBadge } from "./PriceRating";
import { WishlistButton } from "@/features/wishlist/WishlistButton";
import { QuickViewDialog } from "./QuickViewDialog";
import { useAddToCart } from "@/features/cart/useAddToCart";

export function ProductCard({ product }: { product: Product }) {
  const [quickOpen, setQuickOpen] = useState(false);
  const addToCart = useAddToCart();
  const out = product.stock <= 0;
  const needsVariant = (product.variants?.length ?? 0) > 0;

  return (
    <article className="group relative flex flex-col rounded-3xl border bg-card p-2.5 transition-shadow hover:shadow-lift sm:p-3">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <Link to="/products/$slug" params={{ slug: product.slug }} aria-label={product.name}>
          <ProductImage src={product.images[0]} alt="" className="aspect-square w-full transition-transform duration-300 group-hover:scale-[1.03]" width={400} height={400} />
        </Link>
        <div className="absolute right-2 top-2 flex flex-col gap-2">
          <WishlistButton productId={product.id} name={product.name} />
          <button
            type="button"
            onClick={() => setQuickOpen(true)}
            aria-label={`Quick view ${product.name}`}
            className="inline-flex size-10 items-center justify-center rounded-full bg-card/95 shadow-soft hover:bg-lavender"
          >
            <Eye className="size-5" aria-hidden />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{product.brand}</p>
        <h3 className="mt-0.5 line-clamp-2 font-sans text-sm font-semibold leading-snug sm:text-base">
          <Link to="/products/$slug" params={{ slug: product.slug }} className="hover:text-primary">
            {product.name}
          </Link>
        </h3>
        <div className="mt-1.5"><RatingDisplay rating={product.rating} count={product.reviewCount} /></div>
        <div className="mt-2"><PriceDisplay price={product.price} originalPrice={product.originalPrice} /></div>
        <div className="mt-1"><StockBadge stock={product.stock} /></div>
        <div className="mt-auto pt-3">
          <Button
            className="w-full"
            size="sm"
            variant={out ? "outline" : "default"}
            disabled={out}
            onClick={() => (needsVariant ? setQuickOpen(true) : addToCart(product))}
          >
            <ShoppingBag aria-hidden />
            {out ? "Sold out" : needsVariant ? "Choose options" : "Add to cart"}
          </Button>
        </div>
      </div>
      {quickOpen && <QuickViewDialog product={product} open={quickOpen} onOpenChange={setQuickOpen} />}
    </article>
  );
}
