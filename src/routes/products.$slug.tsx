import { createFileRoute, Link, notFound, useNavigate, useRouter } from "@tanstack/react-router";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { ChevronRight, Minus, Plus, Truck, Zap } from "lucide-react";
import { productQuery, relatedQuery } from "@/services/catalog";
import { getCategory } from "@/config/categories";
import { ProductImage } from "@/components/products/ProductImage";
import { PriceDisplay, RatingDisplay, StockBadge } from "@/components/products/PriceRating";
import { VariantPicker } from "@/components/products/VariantPicker";
import { ProductRail } from "@/components/products/ProductGrid";
import { ProductGridSkeleton } from "@/components/feedback/States";
import { RecentlyViewed } from "@/features/catalog/RecentlyViewed";
import { WishlistButton } from "@/features/wishlist/WishlistButton";
import { useAddToCart } from "@/features/cart/useAddToCart";
import { usePrefs } from "@/store/preferences";
import { Button } from "@/components/ui/button";
import { MAX_QTY_PER_LINE } from "@/store/cart";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/products/$slug")({
  loader: async ({ context, params }) => {
    const p = await context.queryClient.ensureQueryData(productQuery(params.slug));
    if (!p) throw notFound();
    return { name: p.name, description: p.description, image: p.images[0] };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.name} — ShopSmart AI` },
            { name: "description", content: loaderData.description },
            { property: "og:title", content: loaderData.name },
            { property: "og:description", content: loaderData.description },
            { property: "og:type", content: "product" },
            ...(loaderData.image ? [{ property: "og:image", content: loaderData.image }, { name: "twitter:image", content: loaderData.image }] : []),
          ],
        }
      : { meta: [{ title: "Product not found — ShopSmart AI" }, { name: "robots", content: "noindex" }] },
  component: ProductPage,
  notFoundComponent: ProductNotFound,
  errorComponent: ProductError,
});

function ProductNotFound() {
  return (
    <div className="container-page py-20 text-center">
      <h1 className="text-3xl font-extrabold">We couldn't find that product</h1>
      <p className="mt-2 text-muted-foreground">It may have been removed or the link is incorrect.</p>
      <Button asChild className="mt-6"><Link to="/products">Browse products</Link></Button>
    </div>
  );
}

function ProductError() {
  const router = useRouter();
  return (
    <div className="container-page py-20 text-center" role="alert">
      <h1 className="text-2xl font-bold">This product didn't load</h1>
      <Button className="mt-6" onClick={() => void router.invalidate()}>Try again</Button>
    </div>
  );
}

function ProductPage() {
  const { slug } = Route.useParams();
  const { data } = useSuspenseQuery(productQuery(slug));
  const product = data;
  const navigate = useNavigate();
  const addToCart = useAddToCart();
  const addViewed = usePrefs((s) => s.addViewed);
  const [imgIdx, setImgIdx] = useState(0);
  const [variantId, setVariantId] = useState<string | undefined>(() => product?.variants?.find((v) => v.stock > 0)?.id);
  const [qty, setQty] = useState(1);
  const related = useQuery({ ...relatedQuery(product?.id ?? ""), enabled: !!product });

  useEffect(() => {
    if (product) addViewed(product.id);
    setImgIdx(0);
    setQty(1);
    setVariantId(product?.variants?.find((v) => v.stock > 0)?.id);
  }, [product, addViewed]);

  if (!product) return <ProductNotFound />;
  const category = getCategory(product.category);
  const variant = product.variants?.find((v) => v.id === variantId);
  const price = variant?.price ?? product.price;
  const stock = variant ? variant.stock : product.stock;
  const maxQty = Math.max(1, Math.min(stock, MAX_QTY_PER_LINE));
  const purchasable = stock > 0;

  return (
    <div className="container-page py-6 sm:py-10">
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1">
          <li><Link to="/" className="hover:text-foreground">Home</Link></li>
          <li aria-hidden><ChevronRight className="size-3.5" /></li>
          {category && (<><li><Link to="/products" search={{ category: category.slug }} className="hover:text-foreground">{category.name}</Link></li><li aria-hidden><ChevronRight className="size-3.5" /></li></>)}
          <li aria-current="page" className="line-clamp-1 text-foreground">{product.name}</li>
        </ol>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2 lg:gap-14">
        <section aria-label="Product images">
          <div className="relative overflow-hidden rounded-3xl bg-muted">
            <ProductImage src={product.images[imgIdx]} alt={product.name} eager className="aspect-square w-full" />
            <WishlistButton productId={product.id} name={product.name} className="absolute right-4 top-4" />
          </div>
          {product.images.length > 1 && (
            <div className="mt-3 flex gap-3">
              {product.images.map((src, i) => (
                <button key={src} type="button" onClick={() => setImgIdx(i)} aria-label={`Show image ${i + 1}`} aria-pressed={i === imgIdx}
                  className={cn("overflow-hidden rounded-2xl border-2", i === imgIdx ? "border-primary" : "border-transparent")}>
                  <ProductImage src={src} alt="" className="size-20" width={160} height={160} />
                </button>
              ))}
            </div>
          )}
        </section>

        <section aria-label="Product information" className="flex flex-col gap-5">
          <div>
            <Link to="/products" search={{ brands: product.brand }} className="text-sm font-semibold uppercase tracking-wide text-primary hover:underline">{product.brand}</Link>
            <h1 className="mt-1 text-3xl font-extrabold leading-tight sm:text-4xl">{product.name}</h1>
            <div className="mt-3"><RatingDisplay rating={product.rating} count={product.reviewCount} /></div>
          </div>
          <div>
            <PriceDisplay price={price} originalPrice={variant?.price ? undefined : product.originalPrice} size="lg" />
            <p className="mt-1 text-xs text-muted-foreground">Final price, taxes and shipping are confirmed at checkout.</p>
          </div>
          <StockBadge stock={stock} />
          <VariantPicker product={product} value={variantId} onChange={(id) => { setVariantId(id); setQty(1); }} />

          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold" id="qty-label">Quantity</span>
            <div className="flex items-center rounded-full border bg-card" role="group" aria-labelledby="qty-label">
              <button type="button" aria-label="Decrease quantity" disabled={qty <= 1} onClick={() => setQty((q) => Math.max(1, q - 1))} className="inline-flex size-10 items-center justify-center disabled:opacity-40"><Minus className="size-4" /></button>
              <span className="w-8 text-center font-semibold" aria-live="polite">{qty}</span>
              <button type="button" aria-label="Increase quantity" disabled={!purchasable || qty >= maxQty} onClick={() => setQty((q) => Math.min(maxQty, q + 1))} className="inline-flex size-10 items-center justify-center disabled:opacity-40"><Plus className="size-4" /></button>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button size="lg" className="flex-1" disabled={!purchasable} onClick={() => addToCart(product, { variantId, qty })}>
              {purchasable ? "Add to cart" : "Out of stock"}
            </Button>
            <Button size="lg" variant="plum" className="flex-1" disabled={!purchasable}
              onClick={() => { if (addToCart(product, { variantId, qty })) void navigate({ to: "/cart" }); }}>
              <Zap aria-hidden /> Buy now
            </Button>
          </div>

          <div className="flex gap-3 rounded-2xl bg-mint/60 p-4 text-sm">
            <Truck className="size-5 shrink-0" aria-hidden />
            <p>Delivery dates and charges are shown at checkout once your address is confirmed.</p>
          </div>

          <div>
            <h2 className="text-lg font-bold">About this item</h2>
            <p className="mt-2 text-muted-foreground">{product.description}</p>
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">
              {product.highlights.map((h) => <li key={h}>{h}</li>)}
            </ul>
          </div>
          <div>
            <h2 className="text-lg font-bold">Specifications</h2>
            <dl className="mt-2 divide-y rounded-2xl border bg-card text-sm">
              {Object.entries(product.specs).map(([k, v]) => (
                <div key={k} className="grid grid-cols-2 gap-4 px-4 py-2.5"><dt className="text-muted-foreground">{k}</dt><dd className="font-medium">{v}</dd></div>
              ))}
            </dl>
          </div>
          {product.returnPolicy && (
            <div><h2 className="text-lg font-bold">Returns</h2><p className="mt-1 text-sm text-muted-foreground">{product.returnPolicy}</p></div>
          )}
        </section>
      </div>

      <section className="mt-16" aria-labelledby="reviews-h">
        <h2 id="reviews-h" className="text-2xl font-extrabold">Customer reviews</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Rated {product.rating.toFixed(1)} from {product.reviewCount.toLocaleString("en-IN")} ratings. Written reviews will appear here once the reviews service is connected.
        </p>
      </section>

      <section className="mt-16" aria-labelledby="similar-h">
        <h2 id="similar-h" className="mb-5 text-2xl font-extrabold">More like this</h2>
        {related.isPending ? <ProductGridSkeleton count={4} /> : related.data?.length ? <ProductRail products={related.data} /> : <p className="text-sm text-muted-foreground">No similar products yet.</p>}
      </section>

      <RecentlyViewed excludeId={product.id} />
    </div>
  );
}
