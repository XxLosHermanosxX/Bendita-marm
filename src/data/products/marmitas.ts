import { Product } from "@/types";

// Base price for all main marmitas
const MARMITA_PRICE = 17.00;

export const marmitaProducts: Product[] = [
  // Destaque do Dia (Strogonoff de Carne)
  {
    id: "m1",
    name: "Strogonoff de Carne ⭐ (Destaque do Dia)",
    description: "Carne macia em cubos, molho cremoso e encorpado, arroz branco soltinho e batata palha crocante. Clássico irresistível!",
    price: MARMITA_PRICE,
    category: "Marmita Destaque do Dia",
    imageUrl: "/images/marmita-placeholder-1.jpg",
    isExclusive: true,
  },
  
  // Cardápio Principal (10 opções)
  {
    id: "m2",
    name: "Strogonoff de Carne",
    description: "Carne suculenta, molho cremoso, arroz branco e batata palha.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-2.jpg",
  },
  {
    id: "m3",
    name: "Strogonoff de Frango",
    description: "Frango macio ao molho cremoso, arroz soltinho e batata palha crocante.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-3.jpg",
  },
  {
    id: "m4",
    name: "Bife Acebolado",
    description: "Bife grelhado, suculento, com cebola dourada, arroz branco, feijão e farofa.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-4.jpg",
  },
  {
    id: "m5",
    name: "Carne de Panela",
    description: "Carne cozida lentamente, bem macia, com molho encorpado, arroz branco e feijão.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-5.jpg",
  },
  {
    id: "m6",
    name: "Frango Grelhado",
    description: "Filé de frango temperado e grelhado, arroz, feijão e legumes refogados.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-6.jpg",
  },
  {
    id: "m7",
    name: "Frango à Milanesa",
    description: "Frango empanado e crocante, arroz branco, feijão e purê de batata.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-7.jpg",
  },
  {
    id: "m8",
    name: "Linguiça Acebolada",
    description: "Linguiça suculenta com cebola, arroz branco, feijão e couve refogada.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-8.jpg",
  },
  {
    id: "m9",
    name: "Carne Moída Caseira",
    description: "Carne moída bem temperada, arroz branco, feijão e legumes.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-9.jpg",
  },
  {
    id: "m10",
    name: "Parmegiana de Frango",
    description: "Frango empanado com molho de tomate e queijo derretido, arroz branco e purê.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-10.jpg",
  },
  {
    id: "m11",
    name: "Feijoada Simples",
    description: "Feijão encorpado com carnes selecionadas, arroz branco e farofa.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "/images/marmita-placeholder-11.jpg",
  },
  
  // Combos
  {
    id: "c1",
    name: "Combo Bendito",
    description: "Marmita do dia + Refrigerante 600ml + Mousse de Brigadeiro. Deixe sua refeição completa!",
    price: 20.00,
    category: "Combos",
    imageUrl: "/images/combo-placeholder.jpg",
  },
  
  // Sobremesas
  {
    id: "d1",
    name: "Mousse de Brigadeiro",
    description: "Cremoso, geladinho e com aquele gostinho de chocolate que fecha a refeição com chave de ouro.",
    price: 5.00,
    category: "Sobremesas",
    imageUrl: "/images/mousse-placeholder.jpg",
  },
  
  // Bebidas (Refrigerante 600ml)
  {
    id: "b1",
    name: "Refrigerante 600ml",
    description: "Coca-Cola, Guaraná, Fanta.",
    price: 5.00,
    category: "Bebidas",
    imageUrl: "/images/refri-placeholder.jpg",
    variations: [
        {
            name: "Sabor",
            options: [
                { label: "Coca-Cola", price: 5.00 },
                { label: "Guaraná", price: 5.00 },
                { label: "Fanta Laranja", price: 5.00 },
            ]
        }
    ]
  },
];