import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Template, CartItem } from "@/core/api/templates/types";

interface CartState {
  items: CartItem[];
  isOpen: boolean;

  // Actions
  addItem: (template: Template) => void;
  removeItem: (templateId: number) => void;
  updateQuantity: (templateId: number, quantity: number) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;

  // Computed values (as functions)
  getSubtotal: () => number;
  getItemCount: () => number;
  isInCart: (templateId: number) => boolean;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (template: Template) => {
        const { items } = get();
        const existingItem = items.find((item) => item.template.id === template.id);

        if (existingItem) {
          // Already in cart, don't add duplicates for digital products
          return;
        }

        set({
          items: [...items, { template, quantity: 1 }],
        });
      },

      removeItem: (templateId: number) => {
        const { items } = get();
        set({
          items: items.filter((item) => item.template.id !== templateId),
        });
      },

      updateQuantity: (templateId: number, quantity: number) => {
        const { items } = get();
        if (quantity <= 0) {
          set({
            items: items.filter((item) => item.template.id !== templateId),
          });
        } else {
          set({
            items: items.map((item) =>
              item.template.id === templateId ? { ...item, quantity } : item
            ),
          });
        }
      },

      clearCart: () => {
        set({ items: [] });
      },

      toggleCart: () => {
        set((state) => ({ isOpen: !state.isOpen }));
      },

      openCart: () => {
        set({ isOpen: true });
      },

      closeCart: () => {
        set({ isOpen: false });
      },

      getSubtotal: () => {
        const { items } = get();
        return items.reduce(
          (total, item) => total + parseFloat(item.template.price) * item.quantity,
          0
        );
      },

      getItemCount: () => {
        const { items } = get();
        return items.reduce((count, item) => count + item.quantity, 0);
      },

      isInCart: (templateId: number) => {
        const { items } = get();
        return items.some((item) => item.template.id === templateId);
      },
    }),
    {
      name: "photoboothx-cart",
      partialize: (state) => ({ items: state.items }), // Only persist items, not UI state
    }
  )
);
