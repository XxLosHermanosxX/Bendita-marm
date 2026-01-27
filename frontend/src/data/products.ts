import { Product } from "@/types";
import { ASSETS } from "./assets";

export const products: Product[] = [
  // Smash Burgers
  {
    id: "duplo-eletrochoque",
    name: "Duplo Eletro-Choque",
    description: "2 smash de 80g, cheddar, bacon crocante, cebolla caramelizada y salsa especial.",
    price: 45000, // PYG
    category: "Smash Burgers",
    imageUrl: ASSETS.products.duploEletroChoque,
    ingredients: ["Pan brioche", "2x Smash 80g", "Cheddar", "Bacon", "Cebolla caramelizada", "Salsa especial"]
  },
  {
    id: "residente",
    name: "El Residente",
    description: "Smash clásico de 100g, queso, lechuga, tomate y mayonesa de la casa.",
    price: 32000,
    category: "Smash Burgers",
    imageUrl: ASSETS.products.residente,
    ingredients: ["Pan brioche", "Smash 100g", "Queso", "Lechuga", "Tomate", "Mayonesa"]
  },
  {
    id: "bacon-cardiaco",
    name: "Bacon-Cardíaco",
    description: "Smash 120g, mucho bacon, cheddar derretido, cebolla crispy y BBQ.",
    price: 42000,
    category: "Smash Burgers",
    imageUrl: ASSETS.products.baconCardiaco,
    ingredients: ["Pan brioche", "Smash 120g", "Bacon extra", "Cheddar", "Cebolla crispy", "BBQ"]
  },
  {
    id: "salada-plantao",
    name: "Ensalada del Turno",
    description: "Smash 100g, mix de hojas, tomate seco, queso cottage y salsa verde.",
    price: 38000,
    category: "Smash Burgers",
    imageUrl: ASSETS.products.saladaPlantao,
    ingredients: ["Pan integral", "Smash 100g", "Mix de hojas", "Tomate seco", "Queso cottage", "Salsa verde"]
  },
  {
    id: "frango-tecnico",
    name: "Pollo Técnico",
    description: "Smash de pollo grillado, cream cheese, rúcula y crispy de ajo.",
    price: 35000,
    category: "Smash Burgers",
    imageUrl: ASSETS.products.frangoTecnico,
    ingredients: ["Pan brioche", "Pollo grillado", "Cream cheese", "Rúcula", "Crispy de ajo"]
  },
  
  // Boxes
  {
    id: "kit-reanimacao",
    name: "Kit Reanimación",
    description: "2 Duplos + 2 Residentes + Papas Grande + Onion Rings + 4 Bebidas. Ideal para grupo de estudio!",
    price: 180000,
    category: "Boxes",
    imageUrl: ASSETS.products.kitReanimacao,
    ingredients: ["2x Duplo Eletro-Choque", "2x Residente", "Papas Grande", "Onion Rings", "4x Bebida"]
  },
  
  // Combos
  {
    id: "combo-plantao",
    name: "Combo Turno",
    description: "Cualquier Smash + Papas Medianas + Bebida 350ml.",
    price: 52000,
    category: "Combos",
    imageUrl: ASSETS.products.duploEletroChoque,
    ingredients: ["1x Smash a elección", "Papas medianas", "Bebida 350ml"]
  },
  
  // Acompañamientos
  {
    id: "dose-fritas",
    name: "Papas Fritas",
    description: "Papas fritas crocantes con sal y condimento especial.",
    price: 18000,
    category: "Extras",
    imageUrl: ASSETS.products.doseFritas,
  },
  {
    id: "aneis-adrenalina",
    name: "Aros de Adrenalina",
    description: "Onion rings empanados y ultra crocantes.",
    price: 22000,
    category: "Extras",
    imageUrl: ASSETS.products.aneisAdrenalina,
  },
  
  // Bebidas
  {
    id: "coca-cola",
    name: "Coca-Cola 350ml",
    description: "Gaseosa bien helada.",
    price: 8000,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&q=80",
  },
  {
    id: "agua",
    name: "Agua Mineral 500ml",
    description: "Agua mineral sin gas.",
    price: 6000,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&q=80",
  },
];

export const categories = ["Smash Burgers", "Combos", "Boxes", "Extras", "Bebidas"];

export const featuredProducts = [
  products.find(p => p.id === "kit-reanimacao")!,
  products.find(p => p.id === "combo-plantao")!,
  products.find(p => p.id === "bacon-cardiaco")!,
];
