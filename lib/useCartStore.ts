import { create } from "zustand";
import { persist } from "zustand/middleware";

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  primary_image_url?: string;
  quantity?: number;
};

type CartState = {
  cartItems: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (id: string) => void;
  increaseQuantity: (id: string) => void;
  decreaseQuantity: (id: string) => void;
  clearCart: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],
      addToCart: (product) => {
        const existingProduct = get().cartItems.find((item) => item.id === product.id);
        if (existingProduct) {
          set({
            cartItems: get().cartItems.map((item) =>
              item.id === product.id
                ? { ...item, quantity: (item.quantity || 1) + 1 }
                : item
            ),
          });
        } else {
          set({ cartItems: [...get().cartItems, { ...product, quantity: 1 }] });
        }
      },
      removeFromCart: (id) =>
        set({
          cartItems: get().cartItems.filter((item) => item.id !== id),
        }),
      increaseQuantity: (id) =>
        set({
          cartItems: get().cartItems.map((item) =>
            item.id === id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
          ),
        }),
      decreaseQuantity: (id) =>
        set({
          cartItems: get().cartItems
            .map((item) =>
              item.id === id ? { ...item, quantity: (item.quantity || 1) - 1 } : item
            )
            .filter((item) => (item.quantity || 1) > 0),
        }),
      clearCart: () => set({ cartItems: [] }),
    }),
    {
      name: "cart-storage",
    }
  )
);
