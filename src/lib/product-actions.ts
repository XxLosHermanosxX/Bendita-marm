import { useProductModalStore } from '@/store/use-product-modal-store';
import { toast } from 'sonner';
import { Product } from '@/types'; // Assuming Product type is available

/**
 * Abre o modal de configuração do produto (ProductModal).
 * @param product O objeto Product a ser configurado.
 */
export const openProductConfigurationModal = (product: Product) => {
  useProductModalStore.getState().openModal(product);
};

/**
 * Abre o modal de configuração do produto pelo ID.
 * @param productId O ID do produto a ser configurado.
 */
export const openProductConfigurationModalById = (productId: string) => {
    // Lookup simulado para o Combo Bendito (c1)
    if (productId === "c1") {
        const product: Product = {
            id: "c1",
            name: "Combo Bendito",
            description: "Marmita do dia + Refrigerante 600ml + Mousse de Brigadeiro.",
            price: 20.00,
            imageUrl: "/images/combo-placeholder.jpg",
            category: "Combos",
        };
        openProductConfigurationModal(product);
    } else {
        toast.error("Produto não encontrado para configuração.");
    }
};