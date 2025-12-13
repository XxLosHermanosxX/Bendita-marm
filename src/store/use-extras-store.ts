import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export type ExtraItem = 'Wasabi Extra' | 'Gengibre (Gari) Extra' | 'Molho Tarê Extra' | 'Hashi Extra (Par)' | 'Cream Cheese Extra';

interface ExtrasState {
  selectedExtras: Record<ExtraItem, number>;
  setExtraQuantity: (item: ExtraItem, quantity: number) => void;
  getExtraQuantity: (item: ExtraItem) => number;
  getExtrasList: () => { name: ExtraItem, quantity: number }[];
  clearExtras: () => void;
}

const initialExtras: Record<ExtraItem, number> = {
  'Wasabi Extra': 0,
  'Gengibre (Gari) Extra': 0,
  'Molho Tarê Extra': 0,
  'Hashi Extra (Par)': 0,
  'Cream Cheese Extra': 0,
};

export const useExtrasStore = create<ExtrasState>()(
  persist(
    (set, get) => ({
      selectedExtras: initialExtras,

      setExtraQuantity: (item, quantity) => {
        set((state) => ({
          selectedExtras: {
            ...state.selectedExtras,
            [item]: Math.max(0, quantity), // Ensure quantity is not negative
          },
        }));
      },

      getExtraQuantity: (item) => {
        return get().selectedExtras[item] || 0;
      },

      getExtrasList: () => {
        return Object.entries(get().selectedExtras)
          .filter(([, quantity]) => quantity > 0)
          .map(([name, quantity]) => ({ name: name as ExtraItem, quantity }));
      },

      clearExtras: () => {
        set({ selectedExtras: initialExtras });
      }
    }),
    {
      name: 'sushiaki-extras-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);