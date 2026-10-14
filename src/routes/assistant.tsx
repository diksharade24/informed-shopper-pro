import { createFileRoute } from "@tanstack/react-router";
import { DiscoveryBox } from "@/features/recommendations/DiscoveryBox";

export const Route = createFileRoute("/assistant")({
  head: () => ({
    meta: [
      { title: "Shopping finder — ShopSmart AI" },
      { name: "description", content: "Describe what you need in plain words and get matching products." },
      { property: "og:title", content: "Shopping finder — ShopSmart AI" },
      { property: "og:description", content: "Describe what you need and get matching products." },
    ],
  }),
  component: () => (
    <div className="container-page py-10">
      <div className="rounded-[2rem] bg-lavender p-6 sm:p-12">
        <h1 className="text-3xl font-extrabold sm:text-5xl">Discover your picks</h1>
        <p className="mb-8 mt-3 max-w-xl text-foreground/75">Tell us your budget, what it's for, and anything it must have.</p>
        <DiscoveryBox placeholder="I need a backpack under ₹1,500 for college that fits a 15-inch laptop." />
      </div>
    </div>
  ),
});
