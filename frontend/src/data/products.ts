import { Product } from "@/types";
import { ASSETS } from "./assets";

export const products: Product[] = [
  // Smash Burgers
  {
    id: "duplo-eletrochoque",
    name: "Duplo Eletro-Choque",
    description: "2 smash de 80g, cheddar, bacon crocante, cebola caramelizada e molho especial.",
    price: 34.90,
    category: "Smash Burgers",
    imageUrl: ASSETS.products.duploEletroChoque,
    ingredients: ["Pão brioche", "2x Smash 80g", "Cheddar", "Bacon", "Cebola caramelizada", "Molho especial"]
  },
  {
    id: "residente",
    name: "Residente",
    description: "Smash clássico de 100g, queijo, alface, tomate e maionese da casa.",
    price: 24.90,
    category: "Smash Burgers",
    imageUrl: ASSETS.products.residente,
    ingredients: ["Pão brioche", "Smash 100g", "Queijo", "Alface", "Tomate", "Maionese"]
  },
  {
    id: "bacon-cardiaco",
    name: "Bacon-Cardíaco",
    description: "Smash 120g, muito bacon, cheddar derretido, cebola crispy e BBQ.",
    price: 32.90,
    category: "Smash Burgers",
    imageUrl: ASSETS.products.baconCardiaco,
    ingredients: ["Pão brioche", "Smash 120g", "Bacon extra", "Cheddar", "Cebola crispy", "BBQ"]
  },
  {
    id: "salada-plantao",
    name: "Salada do Plantão",
    description: "Smash 100g, mix de folhas, tomate seco, queijo cottage e molho verde.",
    price: 28.90,
    category: "Smash Burgers",
    imageUrl: ASSETS.products.saladaPlantao,
    ingredients: ["Pão integral", "Smash 100g", "Mix de folhas", "Tomate seco", "Queijo cottage", "Molho verde"]
  },
  {
    id: "frango-tecnico",
    name: "Frango Técnico",
    description: "Smash de frango grelhado, cream cheese, rúcula e crispy de alho.",
    price: 26.90,
    category: "Smash Burgers",
    imageUrl: ASSETS.products.frangoTecnico,
    ingredients: ["Pão brioche", "Frango grelhado", "Cream cheese", "Rúcula", "Crispy de alho"]
  },
  
  // Boxes
  {
    id: "kit-reanimacao",
    name: "Kit Reanimação",
    description: "2 Duplos Eletro-Choque + 2 Residentes + Fritas Grande + Onion Rings + 4 Refrigerantes.",
    price: 149.90,
    category: "Boxes",
    imageUrl: ASSETS.products.kitReanimacao,
    ingredients: ["2x Duplo Eletro-Choque", "2x Residente", "Fritas Grande", "Onion Rings", "4x Refrigerante"]
  },
  
  // Combos
  {
    id: "combo-plantao",
    name: "Combo Plantão",
    description: "Qualquer Smash + Fritas Médias + Refrigerante 350ml.",
    price: 39.90,
    category: "Combos",
    imageUrl: ASSETS.products.duploEletroChoque,
    ingredients: ["1x Smash à escolha", "Fritas médias", "Refrigerante 350ml"]
  },
  
  // Acompanhamentos
  {
    id: "dose-fritas",
    name: "Dose de Fritas",
    description: "Batatas fritas crocantes com sal e tempero especial.",
    price: 14.90,
    category: "Acompanhamentos",
    imageUrl: ASSETS.products.doseFritas,
  },
  {
    id: "aneis-adrenalina",
    name: "Anéis de Adrenalina",
    description: "Onion rings empanados e ultra crocantes.",
    price: 18.90,
    category: "Acompanhamentos",
    imageUrl: ASSETS.products.aneisAdrenalina,
  },
  
  // Bebidas
  {
    id: "coca-cola",
    name: "Coca-Cola 350ml",
    description: "Refrigerante gelado.",
    price: 7.90,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?w=200&q=80",
  },
  {
    id: "agua",
    name: "Água Mineral 500ml",
    description: "Água mineral sem gás.",
    price: 5.90,
    category: "Bebidas",
    imageUrl: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=200&q=80",
  },
];

export const categories = ["Smash Burgers", "Combos", "Boxes", "Acompanhamentos", "Bebidas"];

export const featuredProducts = [
  products.find(p => p.id === "kit-reanimacao")!,
  products.find(p => p.id === "combo-plantao")!,
  products.find(p => p.id === "bacon-cardiaco")!,
];
