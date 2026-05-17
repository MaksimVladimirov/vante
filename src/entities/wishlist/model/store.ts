import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistStore {
  ids: string[];
  isOpen: boolean;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  clear: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      ids: [],
      isOpen: false,
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((item) => item !== id)
            : [...state.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      clear: () => set({ ids: [] }),
    }),
    {
      name: "mvxiii-wishlist",
      partialize: (state) => ({ ids: state.ids }),
    },
  ),
);
