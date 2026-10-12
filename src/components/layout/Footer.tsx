import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Youtube } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Logo } from "./Logo";

const emailSchema = z.string().trim().email("Please enter a valid email address.").max(255);

export function NewsletterForm({ id = "footer" }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        const r = emailSchema.safeParse(email);
        if (!r.success) return setError(r.error.issues[0]?.message ?? "Invalid email");
        setError("");
        // No newsletter service connected yet — be honest about it.
        toast.info("Newsletter sign-up isn't live yet", { description: "We'll open subscriptions once the mailing service is connected." });
      }}
      className="flex w-full max-w-md flex-col gap-2"
    >
      <label htmlFor={`nl-${id}`} className="text-sm font-semibold">Get the good stuff in your inbox</label>
      <div className="flex gap-2">
        <input
          id={`nl-${id}`}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-invalid={!!error}
          aria-describedby={`nl-${id}-err`}
          className="h-11 min-w-0 flex-1 rounded-full border bg-card px-4 text-sm"
        />
        <Button type="submit" className="h-11">Subscribe</Button>
      </div>
      <p id={`nl-${id}-err`} className="min-h-4 text-xs text-destructive">{error}</p>
    </form>
  );
}

const LINKS = [
  { title: "Shop", items: [{ label: "All products", to: "/products" as const }, { label: "Shopping finder", to: "/assistant" as const }, { label: "Wishlist", to: "/wishlist" as const }, { label: "Cart", to: "/cart" as const }] },
  { title: "Help", items: [{ label: "Customer support", hash: "support" }, { label: "Orders & returns", hash: "returns" }, { label: "Shipping information", hash: "shipping" }, { label: "Contact", hash: "contact" }] },
  { title: "Company", items: [{ label: "About", hash: "about" }, { label: "Privacy policy", hash: "privacy" }, { label: "Terms", hash: "terms" }] },
];

export function Footer() {
  return (
    <footer className="mt-20 border-t bg-card">
      <div className="container-page grid gap-10 py-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm text-muted-foreground">Find your vibe. Love your buy.</p>
          <NewsletterForm />
        </div>
        {LINKS.map((g) => (
          <nav key={g.title} aria-label={g.title}>
            <h2 className="mb-3 text-sm font-bold">{g.title}</h2>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {g.items.map((it) => (
                <li key={it.label}>
                  {"to" in it ? (
                    <Link to={it.to} className="hover:text-foreground">{it.label}</Link>
                  ) : (
                    <Link to="/help" hash={it.hash} className="hover:text-foreground">{it.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>
      <div className="border-t">
        <div className="container-page flex flex-col items-center justify-between gap-3 py-5 text-xs text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} ShopSmart AI</p>
          <p className="sr-only">Social links will be added when official accounts exist.</p>
          <div className="flex gap-2" aria-hidden>
            <Instagram className="size-4" /><Twitter className="size-4" /><Youtube className="size-4" />
          </div>
        </div>
      </div>
    </footer>
  );
}
