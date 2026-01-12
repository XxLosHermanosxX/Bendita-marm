import { Product } from "@/types";
import { marmitaProducts } from "./products/marmitas";

export const products: Product[] = [
  ...marmitaProducts,
];

export const categories = [
  "Marmita Destaque do Dia",
  "Cardápio Principal",
  "Combos",
  "Sobremesas",
  "Bebidas",
];