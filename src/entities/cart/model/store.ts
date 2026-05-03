import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem } from './types';

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  addItem: (item: Omit<CartItem, 'id'>) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (payload) =>
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.productId === payload.productId &&
              i.color === payload.color &&
              i.size === payload.size
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id ? { ...i, quantity: i.quantity + payload.quantity } : i
              ),
              isOpen: true,
            };
          }
          return {
            items: [...state.items, { ...payload, id: `${Date.now()}-${Math.random()}` }],
            isOpen: true,
          };
        }),

      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'vante-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);

export function useCartTotals() {
  const items = useCartStore((s) => s.items);
  const itemCount = items.reduce((acc, i) => acc + i.quantity, 0);
  const subtotal = items.reduce((acc, i) => acc + i.price * i.quantity, 0);
  const shipping = 0;
  const total = subtotal + shipping;
  return { itemCount, subtotal, shipping, total };
}
