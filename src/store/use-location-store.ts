import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LocationState {
  city: string | null;
  state: string | null;
  deliveryTime: string | null;
  distance: string | null; // Novo campo para a distância
  isLocationConfirmed: boolean;
  setConfirmedLocation: (city: string, state: string, deliveryTime: string, distance: string) => void;
  clearLocation: () => void;
}

// Default location for simulation
const DEFAULT_CITY = "Curitiba";
const DEFAULT_STATE = "PR";
const DEFAULT_DELIVERY_TIME = "35-45 min";

// Function to generate a random distance between 1.6 and 3.8 km
function generateSimulatedDistance(): string {
    const min = 1.6;
    const max = 3.8;
    const distance = Math.random() * (max - min) + min;
    return distance.toFixed(1) + ' km';
}

// Function to simulate IP detection (since we can't do real IP lookup)
export function simulateIpDetection() {
    // In a real application, this would be an API call to a service like ip-api.com
    return {
        detectedCity: DEFAULT_CITY,
        detectedState: DEFAULT_STATE,
        detectedDeliveryTime: DEFAULT_DELIVERY_TIME,
        detectedDistance: generateSimulatedDistance(), // Gerando distância
    };
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: null,
      state: null,
      deliveryTime: null,
      distance: null, // Inicializando o novo campo
      isLocationConfirmed: false,

      setConfirmedLocation: (city, state, deliveryTime, distance) => {
        set({
          city,
          state,
          deliveryTime,
          distance,
          isLocationConfirmed: true,
        });
      },

      clearLocation: () => {
        set({
          city: null,
          state: null,
          deliveryTime: null,
          distance: null,
          isLocationConfirmed: false,
        });
      },
    }),
    {
      name: 'sushiaki-location-storage', // name of the item in storage (must be unique)
      storage: createJSONStorage(() => localStorage), // use localStorage
    }
  )
);