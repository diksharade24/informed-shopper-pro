import { Heart } from "lucide-react";
import { toast } from "sonner";
import { useWishlist } from "@/store/wishlist";
import { cn } from "@/lib/utils";

export function WishlistButton({ productId, name, className }: { productId: string; name: string; className?: string }) {
  const saved = useWishlist((s) => s.ids.includes(productId));
  const toggle = useWishlist((s) => s.toggle);
  return (
    <button
      type="button"
      aria-pressed={saved}
      aria-label={saved ? `Remove ${name} from wishlist` : `Save ${name} to wishlist`}
      onClick={() => {
        const added = toggle(productId);
        toast(added ? "Saved to wishlist" : "Removed from wishlist");
      }}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full bg-card/95 shadow-soft transition-colors hover:bg-peach",
        className,
      )}
    >
      <Heart className={cn("size-5", saved && "fill-primary text-primary")} aria-hidden />
    </button>
  );
}
