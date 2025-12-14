import { toast } from 'sonner';
import { useProductModalStore } from '@/store/use-product-modal-store';
import { Product } from '@/types';

/**
 * Abre o modal de configuração do produto (ProductModal).
 * @param product O produto a ser configurado.
 */
export const openProductConfigurationModal = (product: Product) => {
  const { openModal } = useProductModalStore.getState();
  openModal(product);
};