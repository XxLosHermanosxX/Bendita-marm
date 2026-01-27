import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CartItem, Product, DeliveryAddress, CustomerInfo } from "@/types";

interface StoreState {
  // Location
  location: { lat: number; lng: number } | null;
  locationStatus: "idle" | "loading" | "success" | "error" | "denied";
  locationError: string;
  
  // Delivery
  deliveryAddress: DeliveryAddress | null;
  isDeliveryAvailable: boolean;
  
  // Cart
  items: CartItem[];
  
  // Customer
  customer: CustomerInfo | null;
  
  // Actions - Location
  requestLocation: () => Promise<void>;
  setLocationStatus: (status: "idle" | "loading" | "success" | "error" | "denied") => void;
  
  // Actions - Delivery
  setDeliveryAddress: (address: DeliveryAddress | null) => void;
  setDeliveryAvailable: (available: boolean) => void;
  
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

const FREE_DELIVERY_THRESHOLD = 80; // R$ 80
const DELIVERY_FEE = 8.90; // R$ 8,90

// Ciudad del Este coordinates bounds
const CIUDAD_DEL_ESTE_BOUNDS = {
  north: -25.45,
  south: -25.55,
  east: -54.55,
  west: -54.70,
};

const isInCiudadDelEste = (lat: number, lng: number): boolean => {
  return (
    lat >= CIUDAD_DEL_ESTE_BOUNDS.south &&
    lat <= CIUDAD_DEL_ESTE_BOUNDS.north &&
    lng >= CIUDAD_DEL_ESTE_BOUNDS.west &&
    lng <= CIUDAD_DEL_ESTE_BOUNDS.east
  );
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      location: null,
      locationStatus: "idle",
      locationError: "",
      deliveryAddress: null,
      isDeliveryAvailable: false,
      items: [],
      customer: null,
      
      // Location Actions
      requestLocation: async () => {
        set({ locationStatus: "loading", locationError: "" });
        
        if (!navigator.geolocation) {
          set({ 
            locationStatus: "error", 
            locationError: "Geolocalização não suportada pelo navegador" 
          });
          return;
        }
        
        try {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 0,
            });
          });
          
          const { latitude, longitude } = position.coords;
          const inDeliveryArea = isInCiudadDelEste(latitude, longitude);
          
          set({
            location: { lat: latitude, lng: longitude },
            locationStatus: "success",
            isDeliveryAvailable: inDeliveryArea,
          });
          
          // Get address from coordinates (reverse geocoding)
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
            );
            const data = await response.json();
            
            if (data.address) {
              set({
                deliveryAddress: {
                  cep: data.address.postcode || "",
                  street: data.address.road || data.address.street || "",
                  number: data.address.house_number || "",
                  neighborhood: data.address.suburb || data.address.neighbourhood || "",
                  city: data.address.city || data.address.town || "Ciudad del Este",
                  state: data.address.state || "Alto Paraná",
                },
              });
            }
          } catch {
            // If reverse geocoding fails, still allow delivery if in area
            set({
              deliveryAddress: {
                cep: "",
                street: "",
                number: "",
                neighborhood: "",
                city: "Ciudad del Este",
                state: "Alto Paraná",
              },
            });
          }
          
          if (!inDeliveryArea) {
            set({ 
              locationError: "Infelizmente não atendemos sua região ainda" 
            });
          }
          
        } catch (error) {
          const geoError = error as GeolocationPositionError;
          
          if (geoError.code === 1) {
            set({ 
              locationStatus: "denied", 
              locationError: "Permissão de localização negada" 
            });
          } else if (geoError.code === 2) {
            set({ 
              locationStatus: "error", 
              locationError: "Localização não disponível" 
            });
          } else {
            set({ 
              locationStatus: "error", 
              locationError: "Erro ao obter localização" 
            });
          }
        }
      },
      
      setLocationStatus: (status) => set({ locationStatus: status }),
      
      // Delivery Actions
      setDeliveryAddress: (address) => set({ deliveryAddress: address }),
      setDeliveryAvailable: (available) => set({ isDeliveryAvailable: available }),
      
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
