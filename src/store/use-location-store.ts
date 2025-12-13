import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface LocationState {
  city: string | null;
  state: string | null;
  deliveryTime: string | null;
  isLocationConfirmed: boolean;
  setConfirmedLocation: (city: string, state: string, deliveryTime: string) => void;
  clearLocation: () => void;
}

// Default location for simulation
const DEFAULT_CITY = "Curitiba";
const DEFAULT_STATE = "PR";
const DEFAULT_DELIVERY_TIME = "35-45 min";

export const useLocationStore = create<LocationState>()(
  persist(
    (set) => ({
      city: null,
      state: null,
      deliveryTime: null,
      isLocationConfirmed: false,

      setConfirmedLocation: (city, state, deliveryTime) => {
        set({
          city,
          state,
          deliveryTime,
          isLocationConfirmed: true,
        });
      },

      clearLocation: () => {
        set({
          city: null,
          state: null,
          deliveryTime: null,
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

// Function to simulate IP detection (since we can't do real IP lookup)
export function simulateIpDetection() {
    // In a real application, this would be an API call to a service like ip-api.com
    // For now, we return the default location based on the image.
    return {
        detectedCity: DEFAULT_CITY,
        detectedState: DEFAULT_STATE,
        detectedDeliveryTime: DEFAULT_DELIVERY_TIME,
    };
}