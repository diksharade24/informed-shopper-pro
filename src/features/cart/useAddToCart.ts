import { toast } from "sonner";
import { useCart } from "@/store/cart";
import type { Product } from "@/types/catalog";

export function useAddToCart() {
  const add = useCart((s) => s.add);
  return (p: Product, opts?: { variantId?: string; qty?: number }) => {
    const res = add(p, opts);
    if (res.ok) toast.success("Added to cart", { description: p.name });
    else toast.error(res.reason ?? "Couldn't add this item.");
    return res.ok;
  };
}
