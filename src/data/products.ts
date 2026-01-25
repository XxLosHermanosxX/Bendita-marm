import { Product, Category } from '@/types';

export const categories: Category[] = [
  "Combos de Plantão",
  "Smashes Residentes",
  "Acompanhamentos (Doses)",
  "Bebidas"
];

export const products: Product[] = [
  {
    id: "p1",
    name: "Kit Reanimação (Box)",
    description: "Perfeito para o pós-prova! 2 Duplos Eletro-Choque, 2 Residentes, fritas com cheddar e bacon, anéis de cebola e coxinhas.",
    price: 85.00,
    category: "Combos de Plantão",
    imageUrl: "/images/plantao_kit_reanimacao_box.png",
  },
  {
    id: "p2",
    name: "Combo Plantão Duplo",
    description: "Seu Duplo Eletro-Choque com fritas e refri. A energia que você precisa para o plantão.",
    price: 39.90,
    category: "Combos de Plantão",
    imageUrl: "/images/plantao_duplo_eletrochoque.png",
  },
  {
    id: "p3",
    name: "Bacon-Cardíaco",
    description: "O Especialista do Mês: Blend suculento, muito bacon crocante, queijo derretido e molho especial.",
    price: 42.90,
    category: "Smashes Residentes",
    imageUrl: "/images/plantao_bacon_cardiaco.png",
  },
  {
    id: "p4",
    name: "Smash Residente",
    description: "Pão brioche, carne smash 100g, queijo prato e maionese da casa.",
    price: 24.90,
    category: "Smashes Residentes",
    imageUrl: "/images/plantao_residente.png",
  },
  {
    id: "p5",
    name: "Duplo Eletro-Choque",
    description: "2 carnes smash 100g, dobro de queijo e molho especial.",
    price: 32.90,
    category: "Smashes Residentes",
    imageUrl: "/images/plantao_duplo_eletrochoque.png",
  },
  {
    id: "p6",
    name: "Frango Técnico",
    description: "Burger de frango crocante com alface e maionese.",
    price: 26.90,
    category: "Smashes Residentes",
    imageUrl: "/images/plantao_frango_tecnico.png",
  },
  {
    id: "p7",
    name: "Salada Plantão",
    description: "Smash clássico com alface, tomate e cebola roxa.",
    price: 28.90,
    category: "Smashes Residentes",
    imageUrl: "/images/plantao_salada_plantao.png",
  },
  {
    id: "p8",
    name: "Dose de Fritas",
    description: "Porção de batatas fritas crocantes com sal e páprica.",
    price: 14.90,
    category: "Acompanhamentos (Doses)",
    imageUrl: "/images/plantao_dose_fritas.png",
  },
  {
    id: "p9",
    name: "Anéis de Adrenalina",
    description: "Anéis de cebola empanados e super crocantes.",
    price: 16.90,
    category: "Acompanhamentos (Doses)",
    imageUrl: "/images/plantao_aneis_adrenalina.png",
  }
];