import { Product } from "@/types";

export const exclusiveProducts: Product[] = [
  // 1. PROMOÇÃO PRINCIPAL: 80 PEÇAS
  {
    id: "p30",
    name: "Combinado Exclusivo 80 Peças",
    description: "O maior combinado da casa por um preço imbatível. Escolha seus 80 sushis favoritos!",
    price: 49.90,
    category: "Exclusivos do App",
    imageUrl: "/images/combinado-80-pecas.png", // ATUALIZADO
    isExclusive: true,
    isNew: true,
    // Adicionando variações para permitir a escolha dos 80 itens (simplificado)
    variations: [
      {
        name: "Itens (80 peças)",
        options: [
          { label: "Sashimi Salmão (Max 10)", price: 0 },
          { label: "Niguiri Salmão (Max 10)", price: 0 },
          { label: "Uramaki Filadélfia (Max 20)", price: 0 },
          { label: "Hot Filadélfia (Max 20)", price: 0 },
          { label: "Hossomaki Salmão (Max 20)", price: 0 },
        ],
      },
    ],
  },
  // 2. PROMOÇÃO TEMAKI DUPLO
  {
    id: "p110", 
    name: "Temaki Duplo (2 Unidades)",
    description: "1 Temaki Salmão Grelhado + 1 Temaki Salmão Skin. Compre 1, Leve 2!",
    price: 24.90,
    category: "Exclusivos do App",
    imageUrl: "/images/temaki-duplo.png", // ATUALIZADO
    isExclusive: true,
  },
  // 3. PROMOÇÃO HOT ROLL LOVERS (Novo produto)
  {
    id: "p111", 
    name: "Hot Roll Lovers (16 Peças)",
    description: "16 peças de Hot Roll crocante por um preço especial.",
    price: 19.90,
    category: "Exclusivos do App",
    imageUrl: "/images/hot-roll-lovers.png", // NOVO
    isExclusive: true,
  },
  // Outros exclusivos (reordenados)
  {
    id: "p1",
    name: "COMBINADO EXCLUSIVO 38",
    description: "Promoção assim só no app do Sushiaki <3 3 Sashimi salmão, 3 niguiri salmão, 3 niguiri atum, 8 uramaki filadélfia...",
    price: 105.90,
    originalPrice: 119.50,
    category: "Exclusivos do App",
    imageUrl: "/images/AF-APP-PROMO-EXCLUSIVA_1.jpg",
    isExclusive: true,
  },
  {
    id: "p2",
    name: "COMBINADO EXCLUSIVO 32",
    description: "Promoção assim só no app do Sushiaki <3 4 Sashimi salmão, 4 gunka salmão, 12 hot filadélfia e 12 uramaki camarão.",
    price: 98.90,
    originalPrice: 104.50,
    category: "Exclusivos do App",
    imageUrl: "/images/AF-APP-PROMO-EXCLUSIVA_2.jpg",
    isExclusive: true,
  },
  {
    id: "p3",
    name: "COMBINADO EXCLUSIVO 24",
    description: "Promoção assim só no app do Sushiaki <3 4 Sashimi salmão, 4 niguiri salmão fresh, 8 hot camarão e 8 filadélfia",
    price: 80.90,
    originalPrice: 90.48,
    category: "Exclusivos do App",
    imageUrl: "/images/AF-APP-PROMO-EXCLUSIVA_3.jpg",
    isExclusive: true,
  },
  {
    id: "p4",
    name: "HAPPY HOUR COMPARTILHAR",
    description: "2 karaguê + 6 harumaki primavera + 10 guioza fritos",
    price: 119.90,
    originalPrice: 134.70,
    category: "Exclusivos do App",
    imageUrl: "/images/AF-APP-PROMO-EXCLUSIVA_4.jpg",
    isExclusive: true,
  },
  {
    id: "p5",
    name: "COMBO FAMILY OR FRIENDS",
    description: "1 temaki filadélfia + 1 yakimeshi M + 1 yakisoba tradicional G",
    price: 108.90,
    originalPrice: 114.50,
    category: "Exclusivos do App",
    imageUrl: "/images/AF-APP-PROMO-EXCLUSIVA_5.jpg",
    isExclusive: true,
  },
  {
    id: "p6",
    name: "CAMARÃO LOVERS CASAL",
    description: "2 poke de camarão + 2 temaki camarão.",
    price: 134.90,
    originalPrice: 142.80,
    category: "Exclusivos do App",
    imageUrl: "/images/AF-APP-PROMO-EXCLUSIVA_6.jpg",
    isExclusive: true,
  },
];