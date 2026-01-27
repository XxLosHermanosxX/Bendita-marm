import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// --- Lógica de Simulação ---

// Função para gerar uma distância aleatória entre 1.6 e 3.8 km
function generateSimulatedDistance(): string {
    const min = 1.6;
    const max = 3.8;
    const distance = Math.random() * (max - min) + min;
    return distance.toFixed(1) + ' km';
}

// Função para calcular o tempo de entrega dinâmico e a cor
function getDynamicDeliveryTime(): { time: string, color: 'green' | 'yellow' | 'red', animation: boolean } {
    const now = new Date();
    const hour = now.getHours();

    // Horário de pico: 18h00 a 20h00
    const isPeakTime = hour >= 18 && hour < 20;

    if (isPeakTime) {
        // Horário de pico: 45-60 minutos (Amarelo/Vermelho)
        const minutes = Math.floor(Math.random() * (15)) + 45; // 45 a 59 minutos
        const color = minutes >= 55 ? 'red' : 'yellow';
        return { time: `45-${minutes} min`, color, animation: false };
    } else {
        // Horário normal: 25-30 minutos (Verde, piscando lentamente)
        return { time: '25-30 min', color: 'green', animation: true };
    }
}

// Função para simular a detecção de IP (usada apenas para valores iniciais)
export function simulateIpDetection() {
    return {
        detectedCity: "Curitiba",
        detectedState: "PR",
        detectedDeliveryTime: getDynamicDeliveryTime().time,
        detectedDistance: generateSimulatedDistance(),
    };
}

// --- Store ---

interface LocationState {
  city: string | null;
  state: string | null;
  deliveryTime: string | null;
  distance: string | null;
  isLocationConfirmed: boolean;
  
  // Ação para atualizar o tempo de entrega (chamada periodicamente)
  updateDeliveryTime: () => void;
  
  setConfirmedLocation: (city: string, state: string, deliveryTime: string, distance: string) => void;
  clearLocation: () => void;
}

export const useLocationStore = create<LocationState>()(
  persist(
    (set, get) => ({
      city: null,
      state: null,
      deliveryTime: null,
      distance: null,
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
      
      updateDeliveryTime: () => {
        if (get().isLocationConfirmed) {
            const { time } = getDynamicDeliveryTime();
            set({ deliveryTime: time });
        }
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
      name: 'bendita-marmita-location-storage', // Updated storage key
      storage: createJSONStorage(() => localStorage),
      // Garante que a distância seja gerada apenas na primeira vez que o store é inicializado
      onRehydrateStorage: (state) => {
        if (!state.distance) {
            state.distance = generateSimulatedDistance();
        }
      },
    }
  )
);

// Exporta a função de tempo dinâmico para uso no componente de UI
export { getDynamicDeliveryTime };