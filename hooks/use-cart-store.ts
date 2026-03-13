"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "@/types/domain";

type CartState = {
  items: CartItem[];
  addItem: (product: Product) => void;
  increase: (productId: string) => void;
  decrease: (productId: string) => void;
  remove: (productId: string) => void;
  clear: () => void;
  subtotal: () => number;
  totalItems: () => number;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => {
          const existing = state.items.find((item) => item.productId === product.id);

          if (existing) {
            return {
              items: state.items.map((item) =>
                item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item
              )
            };
          }

          return {
            items: [
              ...state.items,
              {
                productId: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                imageUrl: product.main_image_url ?? product.image_url,
                quantity: 1
              }
            ]
          };
        });
      },
      increase: (productId) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.productId === productId ? { ...item, quantity: item.quantity + 1 } : item
          )
        }));
      },
      decrease: (productId) => {
        set((state) => ({
          items: state.items
            .map((item) =>
              item.productId === productId ? { ...item, quantity: Math.max(0, item.quantity - 1) } : item
            )
            .filter((item) => item.quantity > 0)
        }));
      },
      remove: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.productId !== productId)
        }));
      },
      clear: () => {
        set({ items: [] });
      },
      subtotal: () => {
        return get().items.reduce((acc, item) => acc + item.quantity * item.price, 0);
      },
      totalItems: () => {
        return get().items.reduce((acc, item) => acc + item.quantity, 0);
      }
    }),
    {
      name: "cart-storage-v1",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
