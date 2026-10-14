import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Sparkles } from "lucide-react";
import heroImg from "@/assets/hero-collage.jpg";
import { CATEGORIES, TONE_BG } from "@/config/categories";
import { brandsQuery, campaignsQuery, productListQuery } from "@/services/catalog";
import { friendlyError } from "@/services/api-client";
import { usePrefs } from "@/store/preferences";
import { Button } from "@/components/ui/button";
import { ProductRail } from "@/components/products/ProductGrid";
import { ErrorState, ProductGridSkeleton } from "@/components/feedback/States";
import { RecentlyViewed } from "@/features/catalog/RecentlyViewed";
import { DiscoveryBox } from "@/features/recommendations/DiscoveryBox";
import { NewsletterForm } from "@/components/layout/Footer";
import { cn } from "@/lib/utils";
import type { ProductQuery } from "@/types/catalog";

const TRENDING: ProductQuery = { sort: "relevance", pageSize: 8 };
const NEWEST: ProductQuery = { sort: "newest", pageSize: 8 };

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    void context.queryClient.prefetchQuery(productListQuery(TRENDING));
    void context.queryClient.prefetchQuery(productListQuery(NEWEST));
  },
  head: () => ({
    meta: [
      { title: "ShopSmart AI — Your next favorite thing is here" },
      { name: "description", content: "Good finds, happy prices, and little discoveries worth sharing. Shop electronics, fashion, beauty, home and more." },
      { property: "og:title", content: "ShopSmart AI — Your next favorite thing is here" },
      { property: "og:description", content: "Good finds, happy prices, and little discoveries worth sharing." },
    ],
  }),
  component: Home,
});

function Shelf({ title, subtitle, query, cta }: { title: string; subtitle?: string; query: ProductQuery; cta?: boolean }) {
  const { data, isPending, isError, error, refetch } = useQuery(productListQuery(query));
  return (
    <section className="container-page mt-16" aria-labelledby={title}>
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <h2 id={title} className="text-2xl font-extrabold sm:text-3xl">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {cta && <Link to="/products" search={query.sort === "newest" ? { sort: "newest" } : {}} className="inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline">See all <ArrowRight className="size-4" /></Link>}
      </div>
      {isPending ? <ProductGridSkeleton count={4} /> : isError ? <ErrorState message={friendlyError(error)} onRetry={() => void refetch()} /> : <ProductRail products={data.items} />}
    </section>
  );
}

function PickedForYou() {
  const viewed = usePrefs((s) => s.recentlyViewed);
  // Honest personalization: only "for you" when we have your browsing signal; else popular.
  const { data: seed } = useQuery({ ...productListQuery({ pageSize: 50 }), enabled: viewed.length > 0 });
  const cat = seed?.items.find((p) => p.id === viewed[0])?.category;
  return (
    <Shelf
      title="Picked for your vibe"
      subtitle={cat ? "Based on what you've been browsing on this device." : "Popular right now — browse a few items and we'll tailor this."}
      query={cat ? { category: cat, sort: "rating", pageSize: 8 } : { sort: "rating", pageSize: 8 }}
    />
  );
}

function Home() {
  const campaigns = useQuery(campaignsQuery());
  const brands = useQuery(brandsQuery());

  return (
    <>
      <section className="container-page pt-6 sm:pt-10">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] bg-peach p-6 sm:p-10 lg:grid-cols-2 lg:p-14">
          <div aria-hidden className="blob absolute -left-16 -top-16 size-56 bg-butter opacity-70" />
          <div aria-hidden className="blob absolute -bottom-20 right-1/3 size-64 bg-lavender opacity-60" />
          <div className="relative">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-semibold"><Sparkles className="size-3.5 text-primary" /> Find your vibe. Love your buy.</p>
            <h1 className="mt-5 text-4xl font-extrabold leading-[1.05] sm:text-5xl lg:text-6xl">Your next favorite thing is here.</h1>
            <p className="mt-4 max-w-md text-lg text-foreground/80">Good finds, happy prices, and little discoveries worth sharing.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg"><Link to="/products">Explore products <ArrowRight /></Link></Button>
              <Button asChild size="lg" variant="outline"><Link to="/assistant">Discover your picks</Link></Button>
            </div>
          </div>
          <div className="relative">
            <img src={heroImg} alt="Headphones, sneakers, skincare, a mug and a book on pastel blocks" width={1280} height={1104} className="w-full rounded-3xl shadow-lift" />
          </div>
        </div>
      </section>

      <section className="container-page mt-14" aria-labelledby="cats">
        <h2 id="cats" className="mb-5 text-2xl font-extrabold sm:text-3xl">Shop by category</h2>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to="/products" search={{ category: c.slug }} className={cn("flex h-full flex-col justify-between rounded-3xl p-5 transition-transform hover:-translate-y-0.5", TONE_BG[c.tone])}>
                <span className="font-display text-lg font-bold">{c.name}</span>
                <span className="mt-6 text-sm text-foreground/75">{c.blurb}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Shelf title="Trending now" subtitle="What shoppers are loving" query={TRENDING} cta />
      <PickedForYou />

      {campaigns.data && campaigns.data.length > 0 && (
        <section className="container-page mt-16 grid gap-4 md:grid-cols-2" aria-label="Campaigns">
          {campaigns.data.map((c) => (
            <article key={c.id} className={cn("rounded-3xl p-7", TONE_BG[c.tone])}>
              <h2 className="text-2xl font-extrabold">{c.title}</h2>
              <p className="mt-2 text-foreground/80">{c.description}</p>
              {c.endsAt && <p className="mt-2 text-sm font-semibold">Ends {new Date(c.endsAt).toLocaleDateString("en-IN")}</p>}
              {c.category && <Button asChild variant="plum" className="mt-5"><Link to="/products" search={{ category: c.category }}>Shop the edit</Link></Button>}
              <p className="mt-4 text-xs text-foreground/65">{c.terms}</p>
            </article>
          ))}
        </section>
      )}

      <Shelf title="New arrivals" subtitle="Freshly added to the shelves" query={NEWEST} cta />

      {brands.data && (
        <section className="container-page mt-16" aria-labelledby="brands">
          <h2 id="brands" className="mb-5 text-2xl font-extrabold sm:text-3xl">Popular brands</h2>
          <ul className="flex flex-wrap gap-3">
            {brands.data.map((b) => (
              <li key={b}><Link to="/products" search={{ brands: b }} className="inline-flex h-11 items-center rounded-full border bg-card px-5 font-display font-bold hover:bg-lavender">{b}</Link></li>
            ))}
          </ul>
        </section>
      )}

      <section className="container-page mt-16" aria-labelledby="disc">
        <div className="rounded-[2rem] bg-lavender p-6 sm:p-10">
          <h2 id="disc" className="text-2xl font-extrabold sm:text-3xl">Tell us what you need</h2>
          <p className="mb-6 mt-1 text-foreground/75">Describe it in your own words — budget, use, must-haves.</p>
          <DiscoveryBox />
        </div>
      </section>

      <div className="container-page"><RecentlyViewed /></div>

      <section className="container-page mt-16">
        <div className="flex flex-col items-start gap-6 rounded-[2rem] bg-mint p-6 sm:p-10 md:flex-row md:items-center md:justify-between">
          <div><h2 className="text-2xl font-extrabold">Stay in the loop</h2><p className="mt-1 text-foreground/75">New drops and good deals, no spam.</p></div>
          <NewsletterForm id="home" />
        </div>
      </section>
    </>
  );
}
