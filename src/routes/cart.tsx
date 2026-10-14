import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { AlertTriangle, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { productsByIdsQuery } from "@/services/catalog";
import { selectSubtotal, useCart, MAX_QTY_PER_LINE } from "@/store/cart";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/feedback/States";
import { ProductImage } from "@/components/products/ProductImage";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your cart — ShopSmart AI" },
      { name: "description", content: "Review the items in your ShopSmart AI cart." },
      { property: "og:title", content: "Your cart — ShopSmart AI" },
      { property: "og:description", content: "Review the items in your cart." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { lines, setQty, remove, reconcile } = useCart();
  const subtotal = useCart(selectSubtotal);
  const ids = [...new Set(lines.map((l) => l.productId))];
  const fresh = useQuery(productsByIdsQuery(ids));

  // Reconcile against latest catalog data: price & stock changes are flagged, not hidden.
  const issues: Record<string, string> = {};
  for (const l of lines) {
    const p = fresh.data?.find((x) => x.id === l.productId);
    if (!fresh.data) continue;
    if (!p) { issues[l.key] = "No longer available."; continue; }
    const v = p.variants?.find((x) => x.id === l.variantId);
    const price = v?.price ?? p.price;
    const stock = v ? v.stock : p.stock;
    if (stock <= 0) issues[l.key] = "Out of stock now — remove to continue.";
    else if (stock < l.qty) issues[l.key] = `Only ${stock} left — quantity adjusted.`;
    else if (price !== l.unitPrice) issues[l.key] = `Price changed from ${formatPrice(l.unitPrice)} to ${formatPrice(price)}.`;
  }

  useEffect(() => {
    if (!fresh.data) return;
    for (const l of lines) {
      const p = fresh.data.find((x) => x.id === l.productId);
      if (!p) continue;
      const v = p.variants?.find((x) => x.id === l.variantId);
      const price = v?.price ?? p.price;
      const stock = v ? v.stock : p.stock;
      const maxQty = Math.min(Math.max(stock, 0), MAX_QTY_PER_LINE);
      if (price !== l.unitPrice || (stock > 0 && maxQty !== l.maxQty)) reconcile(l.key, { unitPrice: price, maxQty: Math.max(1, maxQty) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fresh.data]);

  if (!lines.length)
    return (
      <div className="container-page py-12">
        <EmptyState icon={<ShoppingBag className="size-7" />} title="Your cart is feeling light" body="Add a few things you love and they'll show up here." action={<Button asChild><Link to="/products">Continue shopping</Link></Button>} />
      </div>
    );

  const blocked = Object.values(issues).some((m) => m.includes("Out of stock") || m.includes("No longer"));

  return (
    <div className="container-page py-8 sm:py-12">
      <h1 className="text-3xl font-extrabold sm:text-4xl">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_360px]">
        <ul className="space-y-4">
          {lines.map((l) => (
            <li key={l.key} className="flex gap-4 rounded-3xl border bg-card p-4">
              <Link to="/products/$slug" params={{ slug: l.slug }} className="shrink-0">
                <ProductImage src={l.image} alt={l.name} className="size-24 rounded-2xl sm:size-28" width={200} height={200} />
              </Link>
              <div className="flex min-w-0 flex-1 flex-col">
                <p className="text-xs font-semibold uppercase text-muted-foreground">{l.brand}</p>
                <Link to="/products/$slug" params={{ slug: l.slug }} className="font-semibold hover:text-primary">{l.name}</Link>
                {l.variantLabel && <p className="text-sm text-muted-foreground">{l.variantLabel}</p>}
                {issues[l.key] && <p role="status" className="mt-1 flex items-center gap-1 text-xs font-medium text-warning"><AlertTriangle className="size-3.5" />{issues[l.key]}</p>}
                <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-3">
                  <div className="flex items-center rounded-full border" role="group" aria-label={`Quantity for ${l.name}`}>
                    <button type="button" aria-label="Decrease quantity" onClick={() => setQty(l.key, l.qty - 1)} className="inline-flex size-9 items-center justify-center"><Minus className="size-4" /></button>
                    <span className="w-8 text-center text-sm font-semibold">{l.qty}</span>
                    <button type="button" aria-label="Increase quantity" disabled={l.qty >= l.maxQty} onClick={() => setQty(l.key, l.qty + 1)} className="inline-flex size-9 items-center justify-center disabled:opacity-40"><Plus className="size-4" /></button>
                  </div>
                  <span className="font-display font-bold">{formatPrice(l.unitPrice * l.qty)}</span>
                  <button type="button" onClick={() => { remove(l.key); toast("Removed from cart"); }} className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive">
                    <Trash2 className="size-4" /> Remove
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="h-fit rounded-3xl bg-card p-6 shadow-soft lg:sticky lg:top-28" aria-label="Order summary">
          <h2 className="text-lg font-bold">Summary</h2>
          <dl className="mt-4 space-y-2 text-sm">
            <div className="flex justify-between"><dt>Subtotal</dt><dd className="font-semibold">{formatPrice(subtotal)}</dd></div>
            <div className="flex justify-between text-muted-foreground"><dt>Shipping & taxes</dt><dd>At checkout</dd></div>
          </dl>
          <div className="mt-4 flex justify-between border-t pt-4 font-display text-lg font-bold"><span>Estimated total</span><span>{formatPrice(subtotal)}</span></div>
          <Button className="mt-6 w-full" size="lg" disabled aria-describedby="checkout-note">Checkout</Button>
          <p id="checkout-note" className="mt-2 text-xs text-muted-foreground">
            {blocked ? "Resolve the flagged items first. " : ""}Checkout opens once secure order & payment services are connected — no orders are placed in sample mode.
          </p>
          <Button asChild variant="outline" className="mt-3 w-full"><Link to="/products">Continue shopping</Link></Button>
        </aside>
      </div>
    </div>
  );
}
