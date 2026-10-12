import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Product } from "@/types/catalog";

/**
 * Guest cart (client state). Prices here are display snapshots only —
 * the backend recalculates prices, stock and totals at checkout.
 */
export interface CartLine {
  key: string;
  productId: string;
  slug: string;
  variantId?: string;
  variantLabel?: string;
  name: string;
  brand: string;
  image: string;
  unitPrice: number;
  maxQty: number;
  qty: number;
}

export const MAX_QTY_PER_LINE = 10;

export const lineKey = (productId: string, variantId?: string) => `${productId}::${variantId ?? "default"}`;

interface CartState {
  lines: CartLine[];
  add: (p: Product, opts?: { variantId?: string; qty?: number }) => { ok: boolean; reason?: string };
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  /** Apply server-verified price / stock to a line. */
  reconcile: (key: string, patch: { unitPrice?: number; maxQty?: number }) => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      add: (p, opts = {}) => {
        const variant = p.variants?.find((v) => v.id === opts.variantId);
        if (p.variants?.length && !variant) return { ok: false, reason: "Please choose an option first." };
        const stock = variant ? variant.stock : p.stock;
        if (stock <= 0) return { ok: false, reason: "This item is out of stock." };
        const maxQty = Math.min(stock, MAX_QTY_PER_LINE);
        const key = lineKey(p.id, variant?.id);
        const qty = opts.qty ?? 1;
        const existing = get().lines.find((l) => l.key === key);
        if (existing) {
          if (existing.qty >= maxQty) return { ok: false, reason: `You can add up to ${maxQty} of this item.` };
          set({ lines: get().lines.map((l) => (l.key === key ? { ...l, qty: Math.min(maxQty, l.qty + qty), maxQty } : l)) });
          return { ok: true };
        }
        set({
          lines: [
            ...get().lines,
            {
              key, productId: p.id, slug: p.slug, variantId: variant?.id, variantLabel: variant?.label,
              name: p.name, brand: p.brand, image: p.images[0] ?? "", unitPrice: variant?.price ?? p.price,
              maxQty, qty: Math.min(qty, maxQty),
            },
          ],
        });
        return { ok: true };
      },
      setQty: (key, qty) =>
        set({
          lines: get()
            .lines.map((l) => (l.key === key ? { ...l, qty: Math.max(0, Math.min(l.maxQty, Math.floor(qty))) } : l))
            .filter((l) => l.qty > 0),
        }),
      remove: (key) => set({ lines: get().lines.filter((l) => l.key !== key) }),
      clear: () => set({ lines: [] }),
      reconcile: (key, patch) => set({ lines: get().lines.map((l) => (l.key === key ? { ...l, ...patch, qty: Math.min(l.qty, patch.maxQty ?? l.maxQty) } : l)) }),
    }),
    { name: "shopsmart-cart", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);

export const selectCount = (s: CartState) => s.lines.reduce((n, l) => n + l.qty, 0);
export const selectSubtotal = (s: CartState) => s.lines.reduce((n, l) => n + l.qty * l.unitPrice, 0);
