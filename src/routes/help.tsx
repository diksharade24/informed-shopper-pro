import { createFileRoute } from "@tanstack/react-router";

const SECTIONS = [
  { id: "about", title: "About ShopSmart AI", body: "ShopSmart AI is a shopping platform in development. The catalog shown today is sample data." },
  { id: "support", title: "Customer support", body: "Support channels will be listed here when they go live." },
  { id: "returns", title: "Orders & returns", body: "Return and cancellation policies will be published here, and on each product, before orders open." },
  { id: "shipping", title: "Shipping information", body: "Delivery areas, timelines and charges will be shown at checkout once shipping partners are connected." },
  { id: "privacy", title: "Privacy policy", body: "Our privacy policy will be published before we collect any account data." },
  { id: "terms", title: "Terms", body: "Terms of use will be published before launch." },
  { id: "contact", title: "Contact", body: "Contact details will be added here." },
];

export const Route = createFileRoute("/help")({
  head: () => ({
    meta: [
      { title: "Help & policies — ShopSmart AI" },
      { name: "description", content: "Support, shipping, returns, privacy and terms for ShopSmart AI." },
      { property: "og:title", content: "Help & policies — ShopSmart AI" },
      { property: "og:description", content: "Support, shipping, returns and policies." },
    ],
  }),
  component: () => (
    <div className="container-page max-w-3xl py-12">
      <h1 className="text-4xl font-extrabold">Help & policies</h1>
      <div className="mt-8 space-y-4">
        {SECTIONS.map((s) => (
          <section key={s.id} id={s.id} className="scroll-mt-32 rounded-3xl border bg-card p-6">
            <h2 className="text-xl font-bold">{s.title}</h2>
            <p className="mt-2 text-muted-foreground">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  ),
});
