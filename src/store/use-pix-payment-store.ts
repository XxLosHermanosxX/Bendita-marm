import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Order } from '@/types';

interface PixTransactionState {
  transactionId: string | null;
  pixKey: string | null;
  amount: number | null;
  orderData: Order | null;
  status: 'pending' | 'approved' | 'declined' | 'expired' | 'error';
  secondsRemaining: number;
  
  setTransaction: (
    transactionId: string, 
    pixKey: string, 
    amount: number, 
    orderData: Order, 
    secondsRemaining: number
  ) => void;
  
  updateStatus: (status: PixTransactionState['status']) => void;
  updateSecondsRemaining: (seconds: number) => void;
  clearTransaction: () => void;
}

export const usePixPaymentStore = create<PixTransactionState>()(
  persist(
    (set) => ({
      transactionId: null,
      pixKey: null,
      amount: null,
      orderData: null,
      status: 'pending',
      secondsRemaining: 0,

      setTransaction: (transactionId, pixKey, amount, orderData, secondsRemaining) => {
        set({
          transactionId,
          pixKey,
          amount,
          orderData,
          secondsRemaining,
          status: 'pending',
        });
      },
      
      updateStatus: (status) => set({ status }),
      
      updateSecondsRemaining: (seconds) => set({ secondsRemaining: seconds }),

      clearTransaction: () => {
        set({
          transactionId: null,
          pixKey: null,
          amount: null,
          orderData: null,
          status: 'pending',
          secondsRemaining: 0,
        });
      },
    }),
    {
      name: 'sushiaki-pix-payment-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);