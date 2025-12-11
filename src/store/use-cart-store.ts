import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { CartItem, Product } from '@/types';
import { toast } from 'sonner';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number, selectedVariation?: CartItem['selectedVariation'], notes?: string) => void;
  removeItem: (id: string, variationName?: string, optionLabel?: string) => void;
  updateQuantity: (id: string, quantity: number, variationName?: string, optionLabel?: string) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getSubtotal: () => number;
  getCartItem: (id: string, variationName?: string, optionLabel?: string) => CartItem | undefined;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1, selectedVariation, notes) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex(
            (item) =>
              item.id === product.id &&
              item.selectedVariation?.name === selectedVariation?.name &&
              item.selectedVariation?.option.label === selectedVariation?.option.label
          );

          if (existingItemIndex > -1) {
            const updatedItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
            toast.success(`Mais ${product.name} adicionado ao carrinho!`);
            return { items: updatedItems };
          } else {
            const newItem: CartItem = {
              ...product,
              quantity,
              selectedVariation,
              notes,
            };
            toast.success(`${product.name} adicionado ao carrinho!`);
            return { items: [...state.items, newItem] };
          }
        });
      },
      removeItem: (id, variationName, optionLabel) => {
        set((state) => {
          const updatedItems = state.items.filter(
            (item) =>
              !(
                item.id === id &&
                item.selectedVariation?.name === variationName &&
                item.selectedVariation?.option.label === optionLabel
              )
          );
          toast.info('Item removido do carrinho.');
          return { items: updatedItems };
        });
      },
      updateQuantity: (id, quantity, variationName, optionLabel) => {
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.id === id &&
            item.selectedVariation?.name === variationName &&
            item.selectedVariation?.option.label === optionLabel
              ? { ...item, quantity: Math.max(1, quantity) } // Ensure quantity is at least 1
              : item
          );
          return { items: updatedItems };
        });
      },
      clearCart: () => {
        set({ items: [] });
        toast.info('Carrinho limpo.');
      },
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getSubtotal: () =>
        get().items.reduce(
          (total, item) =>
            total + item.quantity * (item.selectedVariation?.option.price || item.price),
          0
        ),
      getCartItem: (id, variationName, optionLabel) => {
        return get().items.find(
          (item) =>
            item.id === id &&
            item.selectedVariation?.name === variationName &&
            item.selectedVariation?.option.label === optionLabel
        );
      },
    }),
    {
      name: 'sushiaki-cart-storage', // unique name
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);