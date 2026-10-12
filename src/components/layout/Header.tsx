import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Heart, Menu, Search, ShoppingBag, Sparkles, User } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CATEGORIES } from "@/config/categories";
import { SearchBox } from "@/features/search/SearchBox";
import { selectCount, useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { DeliverySelector } from "./DeliverySelector";
import { Logo } from "./Logo";

function IconLink({ to, label, count, children }: { to: "/cart" | "/wishlist" | "/account"; label: string; count?: number; children: React.ReactNode }) {
  return (
    <Link to={to} aria-label={count ? `${label}, ${count} items` : label} className="relative inline-flex size-10 items-center justify-center rounded-full hover:bg-muted">
      {children}
      {!!count && (
        <span aria-hidden className="absolute -right-0.5 -top-0.5 flex min-w-5 items-center justify-center rounded-full bg-primary px-1 text-[11px] font-bold text-primary-foreground">
          {count > 99 ? "99+" : count}
        </span>
      )}
    </Link>
  );
}

export function Header() {
  const cartCount = useCart(selectCount);
  const wishCount = useWishlist((s) => s.ids.length);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b bg-background/95 backdrop-blur-sm">
      <div className="container-page flex h-16 items-center gap-2 sm:gap-4 lg:h-20">
        <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
          <SheetTrigger className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted lg:hidden" aria-label="Open menu">
            <Menu className="size-5" aria-hidden />
          </SheetTrigger>
          <SheetContent side="left" className="w-[85vw] max-w-sm overflow-y-auto bg-background">
            <SheetHeader><SheetTitle className="text-left"><Logo /></SheetTitle></SheetHeader>
            <nav aria-label="Mobile" className="mt-2 flex flex-col gap-1 px-4 pb-6">
              <Link to="/products" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 font-semibold hover:bg-muted">All products</Link>
              <Link to="/assistant" onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-3 font-semibold hover:bg-muted">Shopping finder</Link>
              <p className="mt-3 px-3 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Categories</p>
              {CATEGORIES.map((c) => (
                <Link key={c.slug} to="/products" search={{ category: c.slug }} onClick={() => setMenuOpen(false)} className="rounded-xl px-3 py-2.5 hover:bg-muted">{c.name}</Link>
              ))}
              <div className="mt-3 border-t pt-3"><DeliverySelector /></div>
            </nav>
          </SheetContent>
        </Sheet>

        <Logo />

        <div className="hidden xl:block"><DeliverySelector /></div>

        <div className="mx-2 hidden flex-1 md:block"><SearchBox /></div>

        <div className="ml-auto flex items-center gap-0.5 sm:gap-1 md:ml-0">
          <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className="inline-flex size-10 items-center justify-center rounded-full hover:bg-muted md:hidden">
            <Search className="size-5" aria-hidden />
          </button>
          <Link to="/assistant" className="hidden items-center gap-1.5 rounded-full bg-lavender px-4 py-2 text-sm font-semibold hover:bg-secondary/80 lg:inline-flex">
            <Sparkles className="size-4" aria-hidden /> Finder
          </Link>
          <IconLink to="/account" label="Account"><User className="size-5" aria-hidden /></IconLink>
          <IconLink to="/wishlist" label="Wishlist" count={wishCount}><Heart className="size-5" aria-hidden /></IconLink>
          <IconLink to="/cart" label="Cart" count={cartCount}><ShoppingBag className="size-5" aria-hidden /></IconLink>
        </div>
      </div>

      <nav aria-label="Categories" className="hidden border-t lg:block">
        <ul className="container-page flex items-center gap-1 overflow-x-auto py-2 text-sm">
          <li><Link to="/products" className="rounded-full px-3 py-1.5 font-semibold hover:bg-muted" activeOptions={{ includeSearch: false }}>All</Link></li>
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link to="/products" search={{ category: c.slug }} className="whitespace-nowrap rounded-full px-3 py-1.5 hover:bg-muted">{c.name}</Link>
            </li>
          ))}
        </ul>
      </nav>

      <Dialog open={searchOpen} onOpenChange={setSearchOpen}>
        <DialogContent className="top-4 translate-y-0 rounded-3xl p-4 pt-12 sm:top-[10%]">
          <DialogTitle className="sr-only">Search products</DialogTitle>
          <SearchBox autoFocus onDone={() => setSearchOpen(false)} />
        </DialogContent>
      </Dialog>
    </header>
  );
}
