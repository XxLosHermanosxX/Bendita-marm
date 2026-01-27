import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, DeliveryAddress, CustomerInfo } from "@/types";

interface StoreState {
  // CEP Verification
  cep: string;
  isDeliveryAvailable: boolean;
  deliveryAddress: DeliveryAddress | null;
  
  // Cart
  items: CartItem[];
  
  // Customer
  customer: CustomerInfo | null;
  
  // Actions - CEP
  setCep: (cep: string) => void;
  setDeliveryAvailable: (available: boolean) => void;
  setDeliveryAddress: (address: DeliveryAddress | null) => void;
  
  // Actions - Cart
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  
  // Actions - Customer
  setCustomer: (customer: CustomerInfo) => void;
  
  // Computed
  getTotalItems: () => number;
  getSubtotal: () => number;
  getDeliveryFee: () => number;
  getTotal: () => number;
  getFreeDeliveryProgress: () => number;
}

const FREE_DELIVERY_THRESHOLD = 80;
const DELIVERY_FEE = 8.90;

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      cep: "",
      isDeliveryAvailable: false,
      deliveryAddress: null,
      items: [],
      customer: null,
      
      // CEP Actions
      setCep: (cep) => set({ cep }),
      setDeliveryAvailable: (available) => set({ isDeliveryAvailable: available }),
      setDeliveryAddress: (address) => set({ deliveryAddress: address }),
      
      // Cart Actions
      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find(item => item.product.id === product.id);
          
          if (existingItem) {
            return {
              items: state.items.map(item =>
                item.product.id === product.id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item
              ),
            };
          }
          
          return {
            items: [...state.items, { product, quantity }],
          };
        });
      },
      
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(item => item.product.id !== productId),
        }));
      },
      
      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }
        
        set((state) => ({
          items: state.items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      // Customer Actions
      setCustomer: (customer) => set({ customer }),
      
      // Computed
      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      
      getSubtotal: () => get().items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      ),
      
      getDeliveryFee: () => {
        const subtotal = get().getSubtotal();
        return subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_FEE;
      },
      
      getTotal: () => get().getSubtotal() + get().getDeliveryFee(),
      
      getFreeDeliveryProgress: () => {
        const subtotal = get().getSubtotal();
        return Math.min((subtotal / FREE_DELIVERY_THRESHOLD) * 100, 100);
      },
    }),
    {
      name: "plantao-smash-store",
    }
  )
);
