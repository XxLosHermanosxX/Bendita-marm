import { products } from "@/data/products";
import { Product } from "@/types";

export function findProductById(id: string): Product | undefined {
  return products.find(p => p.id === id);
}

// Hardcoded IDs for upsell products
export const UPSELL_PRODUCT_IDS = [
    "p95", // Refrigerante Lata
    "p67", // Hot Roll
    "p26", // Sunomono
    "p98", // Temaki Filadélfia
];

export function getUpsellProducts(): Product[] {
    return UPSELL_PRODUCT_IDS
        .map(id => findProductById(id))
        .filter((p): p is Product => !!p);
}