import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface PrefsState {
  recentSearches: string[];
  recentlyViewed: string[];
  pincode: string;
  announcementDismissed: boolean;
  addSearch: (q: string) => void;
  clearSearches: () => void;
  addViewed: (id: string) => void;
  setPincode: (p: string) => void;
  dismissAnnouncement: () => void;
}

export const usePrefs = create<PrefsState>()(
  persist(
    (set, get) => ({
      recentSearches: [],
      recentlyViewed: [],
      pincode: "",
      announcementDismissed: false,
      addSearch: (q) => {
        const t = q.trim();
        if (!t) return;
        set({ recentSearches: [t, ...get().recentSearches.filter((s) => s.toLowerCase() !== t.toLowerCase())].slice(0, 6) });
      },
      clearSearches: () => set({ recentSearches: [] }),
      addViewed: (id) => set({ recentlyViewed: [id, ...get().recentlyViewed.filter((x) => x !== id)].slice(0, 12) }),
      setPincode: (pincode) => set({ pincode }),
      dismissAnnouncement: () => set({ announcementDismissed: true }),
    }),
    { name: "shopsmart-prefs", storage: createJSONStorage(() => localStorage), skipHydration: true },
  ),
);
