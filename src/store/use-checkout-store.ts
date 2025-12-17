import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Address, UserData, PaymentMethod } from '@/types';

interface CheckoutState {
  address: Address | null;
  userData: UserData | null;
  paymentMethod: PaymentMethod | null;
  currentStep: number; // Persist the current step

  setAddress: (address: Address) => void;
  setUserData: (userData: UserData) => void;
  setPaymentMethod: (paymentMethod: PaymentMethod) => void;
  setCurrentStep: (step: number) => void;
  clearCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      address: null,
      userData: null,
      paymentMethod: null,
      currentStep: 1,

      setAddress: (address) => set({ address, currentStep: 2 }),
      setUserData: (userData) => set({ userData, currentStep: 3 }),
      setPaymentMethod: (paymentMethod) => set({ paymentMethod, currentStep: 4 }),
      setCurrentStep: (step) => set({ currentStep: step }),
      
      clearCheckout: () => set({
        address: null,
        userData: null,
        paymentMethod: null,
        currentStep: 1,
      }),
    }),
    {
      name: 'sushiaki-checkout-storage', // unique name for localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist necessary fields
      partialize: (state) => ({
        address: state.address,
        userData: state.userData,
        paymentMethod: state.paymentMethod,
        currentStep: state.currentStep,
      }),
    }
  )
);