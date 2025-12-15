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

// Função auxiliar para buscar o produto (simulação, pois não temos a API)
const findProductById = (productId: string): Product | undefined => {
    // Hardcoded product details for the promotion (p30) - Must match PROMO_PRODUCT structure
    if (productId === "p30") {
        return {
            id: "p30",
            name: "Combinado Exclusivo 80 Peças",
            description: "Monte seu combinado de 80 peças com as opções mais populares.",
            price: 49.90,
            imageUrl: "/images/combinado-80-pecas.png",
            category: "Exclusivos do App",
            ingredients: [],
            variations: [],
        };
    }
    // Adicione lógica para outros produtos se necessário
    return undefined;
};

/**
 * Abre o modal de configuração do produto pelo ID.
 * @param productId O ID do produto a ser configurado.
 */
export const openProductConfigurationModalById = (productId: string) => {
    const product = findProductById(productId);
    if (product) {
        openProductConfigurationModal(product);
    } else {
        toast.error("Produto não encontrado para configuração.");
    }
};