import { Link } from "@tanstack/react-router";

export function Logo() {
  return (
    <Link to="/" aria-label="ShopSmart AI home" className="flex shrink-0 items-center gap-2">
      <span aria-hidden className="blob flex size-8 sm:size-9 items-center justify-center bg-primary font-display text-lg font-extrabold text-primary-foreground">S</span>
      <span className="font-display text-base font-extrabold tracking-tight sm:text-lg">
        ShopSmart<span className="text-primary"> AI</span>
      </span>
    </Link>
  );
}
