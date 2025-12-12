import { create } from 'zustand';
import { Product } from '@/types';
import { toast } from 'sonner';

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
}

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity: number, details?: { selectedVariation?: SelectedVariationDetails, customItems?: { name: string; count: number }[] }, notes?: string) => void;
  removeItem: (productId: string, details?: { selectedVariation?: SelectedVariationDetails, customItems?: { name: string; count: number }[] }) => void;
  updateItemQuantity: (productId: string, newQuantity: number, details?: { selectedVariation?: SelectedVariationDetails, customItems?: { name: string; count: number }[] }) => void; // Renamed from updateQuantity
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getSubtotal: () => number; // Added getSubtotal (same as getTotalPrice for now)
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  addItem: (product, quantity, details, notes) => {
    set((state) => {
      const existingItemIndex = state.items.findIndex(
        (item) =>
          item.product.id === product.id &&
          JSON.stringify(item.details) === JSON.stringify(details)
      );

      if (existingItemIndex > -1) {
        const updatedItems = state.items.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity, notes: notes || item.notes }
            : item
        );
        toast.success(`Mais ${quantity}x ${product.name} adicionado ao carrinho!`);
        return { items: updatedItems };
      } else {
        toast.success(`${quantity}x ${product.name} adicionado ao carrinho!`);
        return { items: [...state.items, { product, quantity, details, notes }] };
      }
    });
  },
  removeItem: (productId, details) => {
    set((state) => {
      const updatedItems = state.items.filter(
        (item) =>
          !(item.product.id === productId && JSON.stringify(item.details) === JSON.stringify(details))
      );
      toast.info("Item removido do carrinho.");
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
    toast.info("Carrinho limpo.");
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
}));