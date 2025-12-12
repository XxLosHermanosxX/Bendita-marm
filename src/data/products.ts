import { Product } from "@/types";
import { exclusiveProducts } from "./products/exclusives";
import { pokeProducts } from "./products/pokes";
import { hotDishes } from "./products/pratos-quentes";
import { teppanProducts } from "./products/teppan";
import { niguiriProducts } from "./products/niguiri";
import { temakiProducts } from "./products/temaki";
import { yakisobaProducts } from "./products/yakisoba";
import { vegetarianProducts } from "./products/vegetarianos";
import { specialProducts } from "./products/specials";
import { beverageProducts } from "./products/bebidas";
import { hossomakiProducts } from "./products/hossomaki";
import { uramakiProducts } from "./products/uramaki";
import { sashimiProducts } from "./products/sashimi";
import { hotSushiProducts } from "./products/hot-sushis";
import { tilapiaProducts } from "./products/tilapia";
import { streetFoodProducts } from "./products/street-food";
import { combinedProducts } from "./products/combinados";


export const products: Product[] = [
  ...exclusiveProducts,
  ...pokeProducts,
  ...hotDishes,
  ...teppanProducts,
  ...niguiriProducts,
  ...temakiProducts,
  ...yakisobaProducts,
  ...vegetarianProducts,
  ...specialProducts,
  ...beverageProducts,
  ...hossomakiProducts,
  ...uramakiProducts,
  ...sashimiProducts,
  ...hotSushiProducts,
  ...tilapiaProducts,
  ...streetFoodProducts,
  ...combinedProducts,
];

export const categories = [
  "Exclusivos do App",
  "Prato do Dia",
  "Pokes",
  "Pratos Quentes",
  "Teppan",
  "Niguiri",
  "Temaki",
  "Yakisoba",
  "Vegetarianos",
  "Especiais",
  "Novidades",
  "Combinados",
  "Hossomaki",
  "Uramaki",
  "Sashimi",
  "Hot Sushis",
  "Tilápia Sushiaki",
  "Street Food",
  "Bebidas",
];