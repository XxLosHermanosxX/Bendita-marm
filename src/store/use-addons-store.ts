import { create } from 'zustand';
import { Product, FreeAddon } from '@/types';

interface ItemDetails {
    product: Product;
    quantity: number;
    details?: {
        selectedVariation?: any;
        customItems?: { name: string; count: number }[];
    };
    notes?: string;
}

interface AddonsStore {
    isOpen: boolean;
    itemToConfigure: ItemDetails | null;
    selectedFreeAddons: FreeAddon[];
    
    openModal: (item: ItemDetails) => void;
    closeModal: () => void;
    updateSelectedFreeAddons: (addons: FreeAddon[]) => void;
    
    // Function to finalize the item configuration and pass it back to the cart store
    finalizeItem: (freeAddons: FreeAddon[]) => void;
}

export const useAddonsStore = create<AddonsStore>((set, get) => ({
    isOpen: false,
    itemToConfigure: null,
    selectedFreeAddons: [],

    openModal: (item) => {
        set({ 
            isOpen: true, 
            itemToConfigure: item,
            selectedFreeAddons: [], // Reset addons when opening for a new item
        });
    },

    closeModal: () => {
        set({ 
            isOpen: false, 
            itemToConfigure: null,
            selectedFreeAddons: [],
        });
    },
    
    updateSelectedFreeAddons: (addons) => {
        set({ selectedFreeAddons: addons });
    },

    // This function will be called by the AddonsModal and needs to interact with the CartStore
    finalizeItem: (freeAddons) => {
        // This function needs to be implemented by the component that uses this store
        // to avoid circular dependency with useCartStore.
        // For now, we just close the modal. The component will handle the cart logic.
        set({ 
            isOpen: false, 
            itemToConfigure: null,
            selectedFreeAddons: [],
        });
    }
}));