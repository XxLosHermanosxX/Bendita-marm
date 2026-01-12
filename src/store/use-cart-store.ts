import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Product, FreeAddon } from '@/types';
import { toast } from 'sonner'; // Keeping toast import, although toasts are currently disabled globally

// Define a more specific type for selectedVariation
interface SelectedVariationDetails {
  name: string; // e.g., "Tamanho", "Sabor"
  option: {
    label: string; // e.g., "Pequeno", "Grande", "Morango"
    price: number; // Additional price for this option
  };
}

interface CartItem {
  product: Product; // Product contains id, name, imageUrl, price
  quantity: number;
  details?: {
    selectedVariation?: SelectedVariationDetails; // Use the specific type
    customItems?: { name: string; count: number }[];
  };
  notes?: string;
  freeAddons?: FreeAddon[]; // Added FreeAddons
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, details?: { selectedVariation?: SelectedVariationDetails, customItems?: { name: string; count: number }[] }, notes?: string, freeAddons?: FreeAddon[]) => void;
  removeItem: (productId: string, details?: { selectedVariation?: SelectedVariationDetails, customItems?: { name: string; count: number }[] }) => void;
  updateItemQuantity: (productId: string, newQuantity: number, details?: { selectedVariation?: SelectedVariationDetails, customItems?: { name: string; count: number }[] }) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity, details, notes, freeAddons) => {
        set((state) => {
          // We need a unique identifier for items that are the same product but have different details/addons
          const itemIdentifier = (item: CartItem) => 
            `${item.product.id}-${JSON.stringify(item.details)}-${JSON.stringify(item.freeAddons)}`;
          
          const newItem: CartItem = { product, quantity, details, notes, freeAddons };

          // Check if an identical item already exists (same product ID, same details, same free addons)
          const existingItemIndex = state.items.findIndex(
            (item) => itemIdentifier(item) === itemIdentifier(newItem)
          );

          if (existingItemIndex > -1) {
            const updatedItems = state.items.map((item, index) =>
              index === existingItemIndex
                ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
                : item
            );
            // toast.success(`Mais ${quantity}x ${product.name} adicionado ao carrinho!`); // Toast disabled
            return { items: updatedItems };
          } else {
            // toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`); // Toast disabled
            return { items: [...state.items, newItem] };
          }
        });
      },
      removeItem: (productId, details) => {
        set((state) => {
          // Note: This removeItem logic is simplified and doesn't account for freeAddons in the details check, 
          // which is fine if we assume removeItem is called from the CartDrawer where the item object is fully known.
          const updatedItems = state.items.filter(
            (item) =>
              !(item.product.id === productId && JSON.stringify(item.details) === JSON.stringify(details))
          );
          // toast.info("Item removido do carrinho."); // Toast disabled
          return { items: updatedItems };
        });
      },
      updateItemQuantity: (productId, newQuantity, details) => { // Renamed from updateQuantity
        set((state) => {
          const updatedItems = state.items.map((item) =>
            item.product.id === productId && JSON.stringify(item.details) === JSON.stringify(details)
              ? { ...item, quantity: newQuantity }
              : item
          );
          return { items: updatedItems };
        });
      },
      clearCart: () => {
        set({ items: [] });
        // toast.info("Carrinho limpo."); // Toast disabled
      },
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => {
        const itemPrice = item.details?.selectedVariation?.option.price || item.product.price;
        return total + itemPrice * item.quantity;
      }, 0),
      getSubtotal: () => get().items.reduce((total, item) => {
        const itemPrice = item.details?.selectedVariation?.option.price || item.product.price;
        return total + itemPrice * item.quantity;
      }, 0), // getSubtotal is the same as getTotalPrice for now
    }),
    {
      name: 'bendita-marmita-cart-storage', // Updated unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);