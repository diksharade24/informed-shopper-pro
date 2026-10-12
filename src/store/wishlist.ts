import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
}

/** Guest wishlist of product IDs; product data is always fetched fresh. */
export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set({ ids: has ? get().ids.filter((x) => x !== id) : [...get().ids, id] });
        return !has;
      },
      remove: (id) => set({ ids: get().ids.filter((x) => x !== id) }),
    }),
    { name: "shopsmart-wishlist", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
