import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Product } from "@/types/catalog";
import { ProductImage } from "./ProductImage";
import { PriceDisplay, RatingDisplay, StockBadge } from "./PriceRating";
import { VariantPicker } from "./VariantPicker";
import { useAddToCart } from "@/features/cart/useAddToCart";

export function QuickViewDialog({ product, open, onOpenChange }: { product: Product; open: boolean; onOpenChange: (o: boolean) => void }) {
  const firstAvailable = product.variants?.find((v) => v.stock > 0)?.id;
  const [variantId, setVariantId] = useState<string | undefined>(firstAvailable);
  const addToCart = useAddToCart();
  const variant = product.variants?.find((v) => v.id === variantId);
  const price = variant?.price ?? product.price;
  const stock = variant ? variant.stock : product.stock;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-3xl overflow-y-auto rounded-3xl p-0">
        <div className="grid gap-0 sm:grid-cols-2">
          <ProductImage src={product.images[0]} alt={product.name} className="aspect-square w-full sm:rounded-l-3xl" />
          <div className="flex flex-col gap-3 p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{product.brand}</p>
            <DialogTitle className="font-display text-2xl font-bold">{product.name}</DialogTitle>
            <RatingDisplay rating={product.rating} count={product.reviewCount} />
            <PriceDisplay price={price} originalPrice={variant?.price ? undefined : product.originalPrice} />
            <StockBadge stock={stock} />
            <DialogDescription className="text-sm text-muted-foreground">{product.description}</DialogDescription>
            <VariantPicker product={product} value={variantId} onChange={setVariantId} />
            <div className="mt-auto flex flex-col gap-2 pt-2">
              <Button
                disabled={stock <= 0}
                onClick={() => {
                  if (addToCart(product, { variantId })) onOpenChange(false);
                }}
              >
                {stock <= 0 ? "Sold out" : "Add to cart"}
              </Button>
              <Button asChild variant="outline">
                <Link to="/products/$slug" params={{ slug: product.slug }}>See full details</Link>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
