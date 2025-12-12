import { Product } from "@/types";

export const products: Product[] = [
  // Exclusivos do App
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

  // Prato do Dia
  {
    id: "p7",
    name: "QUI - HOT BOX TILÁPIA",
    description: "Hot Box Tilápia",
    price: 31.90,
    category: "Prato do Dia",
    imageUrl: "/images/NEEMO-PRATO-DO-DIA-QUI.webp", // Atualizado
  },

  // Pokes
  {
    id: "p8",
    name: "Poke Ceviche",
    description: "Arroz oriental, ceviche (corte de salmão, atum, peixe branco, kani e cebola roxa, marinados), manga, pepino, cebolinha e...",
    price: 49.50,
    category: "Pokes",
    imageUrl: "/images/POKE_CEVICHE_2_app.webp", // Atualizado
  },
  {
    id: "p9",
    name: "Poke Camarão",
    description: "Camarão pequeno na panko, crispy de batata doce e couve, kani, edamame e cebolinha com arroz gohan temperado e...",
    price: 52.50,
    category: "Pokes",
    imageUrl: "/images/POKE_CAMRAO.jpg", // Atualizado
  },
  {
    id: "p10",
    name: "Poke Salmão",
    description: "Arroz oriental, salmão, cebola roxa, sunomono, kani, manga, nori em tiras, gergelim e chips de harumaki.",
    price: 54.50,
    category: "Pokes",
    imageUrl: "/images/poke_salmao-01.jpg", // Atualizado
  },
  {
    id: "p11",
    name: "Poke Chicken",
    description: "Arroz oriental, frango crispy com molho chilli sauce, pepino japonês, manga, gergelim e batata doce.",
    price: 43.50,
    category: "Pokes",
    imageUrl: "/images/poke_chicken.jpg", // Atualizado
  },
  {
    id: "p12",
    name: "Poke Atum",
    description: "Atum em cubos, sunomono, kani, gergelim, edamame cebola roxa e crispy de batata doce.",
    price: 52.50,
    category: "Pokes",
    imageUrl: "/images/poketuna.jpg", // Atualizado
  },
  // Novo Poke Vegetariano
  {
    id: "p99",
    name: "Poke Vegetariano",
    description: "Arroz, tofu, edamame, pepino, cenoura, tomate cereja e alga nori.",
    price: 40.90,
    category: "Pokes",
    imageUrl: "/images/2022_SAK_POKE_VEGETARINO____2_.jpg", // Novo
  },

  // Pratos Quentes
  {
    id: "p13",
    name: "Donburi Gyu Don",
    description: "Carne com cebola na manteiga com molho shoyu, crispy de batata doce, ovo, nori, cebolinha sobre arroz gohan.",
    price: 40.90,
    category: "Pratos Quentes",
    imageUrl: "/images/gyu_domburi.jpg", // Atualizado
  },
  {
    id: "p14",
    name: "Donburi Carne com Legumes",
    description: "Arroz yakimeshi com carne, legumes refogados ao molho oriental.",
    price: 40.90,
    category: "Pratos Quentes",
    imageUrl: "/images/donburi-carne-legumes.png", // Mantido
  },
  {
    id: "p15",
    name: "Donburi Frango Teriyaki",
    description: "Arroz yakimeshi com sobrecoxa de frango ao molho teriyaki.",
    price: 36.50,
    category: "Pratos Quentes",
    imageUrl: "/images/donburi_frango_teriyaki.jpg", // Atualizado
  },
  {
    id: "p16",
    name: "Donburi Frango Mandarim",
    description: "Macarrão yakisoba com sobrecoxa de frango ao molho mandarim.",
    price: 36.50,
    category: "Pratos Quentes",
    imageUrl: "/images/donburi_frango_mandarim.jpg", // Atualizado
  },

  // Niguiri
  {
    id: "p17",
    name: "Niguiri Camarão",
    description: "Arroz com fatia de camarão.",
    price: 21.90,
    category: "Niguiri",
    imageUrl: "/images/photo1736443068.jpeg.webp", // Atualizado
  },
  {
    id: "p18",
    name: "Niguiri Skin",
    description: "Arroz com fatia de skin.",
    price: 17.20,
    category: "Niguiri",
    imageUrl: "/images/photo1736442607.jpeg.webp", // Atualizado
  },
  {
    id: "p19",
    name: "Niguiri Kani",
    description: "Arroz com fatia de kani.",
    price: 17.20,
    category: "Niguiri",
    imageUrl: "/images/photo1736442485.jpeg.webp", // Atualizado
  },
  {
    id: "p20",
    name: "Niguiri Atum",
    description: "Arroz com fatia de atum.",
    price: 20.50,
    category: "Niguiri",
    imageUrl: "/images/niguiri_atum_Easy-Resize.com.jpg", // Atualizado
  },
  {
    id: "p62",
    name: "Niguiri Salmão",
    description: "Arroz com fatia de salmão.",
    price: 20.50,
    category: "Niguiri",
    imageUrl: "/images/niguiri_salmao_Easy-Resize.com.jpg", // Atualizado
  },
  {
    id: "p63",
    name: "Niguiri Salmão Fresh",
    description: "Arroz com fatia de salmão fresh.",
    price: 21.90,
    category: "Niguiri",
    imageUrl: "/images/niguiri_salmao_fresh_Easy-Resize.com.jpg", // Atualizado
  },
  {
    id: "p64",
    name: "Niguiri Salmão Filadélfia",
    description: "Selado no maçarico, acompanha cream cheese, cebolinha e molho tarê (8 unidades).",
    price: 21.90,
    category: "Niguiri",
    imageUrl: "/images/niguiri_salmao_filadelfia_Easy-Resize.com.jpg", // Atualizado
  },

  // Temaki
  {
    id: "p21",
    name: "Temaki Salmão",
    description: "Cortes de salmão e arroz.",
    price: 31.90,
    category: "Temaki",
    imageUrl: "/images/temaki_salmao.jpg", // Atualizado
  },
  {
    id: "p70",
    name: "Temaki Hot Furai",
    description: "Salmão e cream cheese no recheio com casquinha crocante na Panko.",
    price: 32.50,
    category: "Temaki",
    imageUrl: "/images/TEMAKI_HOT_FURAI.jpg", // Atualizado
  },
  {
    id: "p71",
    name: "Temaki Tarê Skin",
    description: "Salmão skin e cream cheese ao molho tarê.",
    price: 30.90,
    category: "Temaki",
    imageUrl: "/images/temaki_skin2.jpg", // Atualizado
  },
  {
    id: "p72",
    name: "Temaki Salmão Sunomono",
    description: "Ceviche (cortes de salmão, atum, cebola roxa, pimenta e kani ao suco de limão) com arroz.",
    price: 30.90,
    category: "Temaki",
    imageUrl: "/images/temaki_sunomono.jpg", // Atualizado
  },
  {
    id: "p73",
    name: "Temaki Ceviche",
    description: "Ceviche (cortes de salmão, atum, cebola roxa, pimenta e kani ao suco de limão) com arroz.",
    price: 30.90,
    category: "Temaki",
    imageUrl: "/images/temaki_ceviche.jpg", // Atualizado
  },
  {
    id: "p74",
    name: "Temaki Hot Filadélfia",
    description: "Temaki recheado com o famoso sushi hot filadélfia e molho tarê.",
    price: 30.90,
    category: "Temaki",
    imageUrl: "/images/temaki_hot_filadelfia.jpg", // Atualizado
  },
  {
    id: "p75",
    name: "Temaki Salmão Panko",
    description: "Salmão empanado e cream cheese ao molho tonkatsu.",
    price: 30.90,
    category: "Temaki",
    imageUrl: "/images/temaki_salmao_panko.jpg", // Atualizado
  },
  {
    id: "p97",
    name: "Temaki Atum",
    description: "Cortes de atum e arroz.",
    price: 31.90,
    category: "Temaki",
    imageUrl: "/images/temaki_atum.jpg", // Atualizado
  },
  {
    id: "p98",
    name: "Temaki Filadélfia",
    description: "Salmão, cream cheese e arroz.",
    price: 32.90,
    category: "Temaki",
    imageUrl: "/images/temaki_filadelfia.jpg", // Atualizado
  },

  // Yakisoba
  {
    id: "p22",
    name: "Yakisoba Tradicional G",
    description: "Macarrão, carne, frango e legumes.",
    price: 59.90,
    category: "Yakisoba",
    imageUrl: "/images/yakisoba_tradicional.jpg", // Atualizado
  },
  {
    id: "p23",
    name: "Yakisoba Especial G",
    description: "Macarrão, carne, frango, camarão e legumes.",
    price: 65.50,
    category: "Yakisoba",
    imageUrl: "/images/yakisoba_especial.jpg", // Atualizado
  },
  {
    id: "p76",
    name: "Yakisoba Salmão G",
    description: "Macarrão, salmão e legumes.",
    price: 65.50,
    category: "Yakisoba",
    imageUrl: "/images/yakisoba-salmao-g.png", // Mantido
  },
  {
    id: "p77",
    name: "Yakisoba Salmão M",
    description: "Macarrão, salmão e legumes.",
    price: 43.90,
    category: "Yakisoba",
    imageUrl: "/images/yakisoba-salmao-m.png", // Mantido
  },
  {
    id: "p78",
    name: "Yakisoba Especial M",
    description: "Macarrão, carne, frango, camarão e legumes.",
    price: 43.90,
    category: "Yakisoba",
    imageUrl: "/images/yakisoba_especial_m.webp", // Atualizado
  },
  {
    id: "p79",
    name: "Yakisoba Tradicional M",
    description: "Macarrão, carne, frango e legumes.",
    price: 39.90,
    category: "Yakisoba",
    imageUrl: "/images/yakisoba_tradicional_m.webp", // Atualizado
  },

  // Vegetarianos
  {
    id: "p24",
    name: "Banana Croc",
    description: "Banana croc com canela e amendoim",
    price: 9.50,
    category: "Vegetarianos",
    imageUrl: "/images/2022_SAK_BANANA_CROC___3_.jpg", // Atualizado
  },
  {
    id: "p25",
    name: "Hossomaki de pepino",
    description: "Sushi fino enrolado",
    price: 18.90,
    category: "Vegetarianos",
    imageUrl: "/images/HOSSOMAKI_PEPINO.jpg", // Atualizado
  },
  {
    id: "p26",
    name: "Sunomono",
    description: "Saladinha de pepino molho agridoce e gergelim",
    price: 13.50,
    category: "Vegetarianos",
    imageUrl: "/images/sunomono.jpg", // Atualizado
  },
  {
    id: "p80",
    name: "Harumaki Vegetariano",
    description: "Massa crocante com recheio de repolho e cenoura com molho agridoce",
    price: 9.90,
    category: "Vegetarianos",
    imageUrl: "/images/harumaki-vegetariano.png",
  },
  {
    id: "p81",
    name: "Tempurá de legumes 3un",
    description: "Tradicional legumes empanados",
    price: 9.90,
    category: "Vegetarianos",
    imageUrl: "/images/tempura_legumes.jpg", // Atualizado
  },
  {
    id: "p82",
    name: "Hot Pot Vegetariano",
    description: "Couve flor empanada e molho teriyaki japonês com gohan",
    price: 31.50,
    category: "Vegetarianos",
    imageUrl: "/images/2022_SAK_HOT_POT_VEGETARIANO.jpg", // Atualizado
  },
  {
    id: "p83",
    name: "Yakisoba Vegetariano",
    description: "Macarrão com legumes ao molho oriental",
    price: 31.50,
    category: "Vegetarianos",
    imageUrl: "/images/2022__SAK_YAKISOBA_VEG_IMG_1758-2__4_.jpg", // Atualizado
  },

  // Especiais
  {
    id: "p27",
    name: "2 Hot Temaki de Salmão Grelhado",
    description: "2 Hot Temaki de Salmão Grelhado com Cream Cheese e Molho Tarê.",
    price: 55.20,
    category: "Especiais",
    imageUrl: "/images/2-hot-temaki-salmao-grelhado.png",
  },
  {
    id: "p28",
    name: "Salmão Baterá",
    description: "Sushi de salmão no maçarico prensado coberto com chilli sauce, crispy de couve e raspas de limão. (8 unidades)",
    price: 45.30,
    category: "Especiais",
    imageUrl: "/images/salmao_batera.jpg",
  },
  {
    id: "p29",
    name: "Flor de Salmão",
    description: "Sashimi no maçarico com geleia de pimenta chilli e crispy de couve. (8 unidades)",
    price: 46.50,
    category: "Especiais",
    imageUrl: "/images/flor_salmao.jpg",
  },
  {
    id: "p92",
    name: "Gunka Salmão",
    description: "Salmão picado com cebolinha envolto em sashimi. (4 unidades ou 8 unidades)",
    price: 25.80,
    category: "Especiais",
    imageUrl: "/images/gunka_samao.jpg",
  },
  {
    id: "p93",
    name: "Ceviche Sushiaki",
    description: "Cones de salmão, atum, cebola roxa, pimenta e kani ao suco de limão.",
    price: 46.50,
    category: "Especiais",
    imageUrl: "/images/ceviche.jpg",
  },
  {
    id: "p94",
    name: "Guioza Grelhado (5 unidades)",
    description: "Pastel oriental de carne suína moída temperada com gergelim, alho, óleo de gergelim e repolho. Acompanha molho típico.",
    price: 26.90,
    category: "Especiais",
    imageUrl: "/images/guioza-grelhado.png",
  },

  // Novos/Exclusivos
  {
    id: "p30",
    name: "Barca com 80 peças",
    description: "Barca com 80 peças de sushi variado.",
    price: 49.90,
    category: "Novidades",
    imageUrl: "/images/barca-80-pecas.png",
    isNew: true,
    isExclusive: true,
  },
  
  // BEBIDAS
  {
    id: "p95",
    name: "Refrigerante Lata (Vários Sabores)",
    description: "Coca-Cola, Coca-Cola Zero, Fanta Laranja, Guaraná Kuat, Sprite.",
    price: 7.90,
    category: "Bebidas",
    imageUrl: "/images/refrigerantes-lata.jpg",
    variations: [
        {
            name: "Sabor",
            options: [
                { label: "Coca-Cola Classic", price: 7.90 },
                { label: "Coca-Cola Zero", price: 7.90 },
                { label: "Fanta Laranja", price: 7.90 },
                { label: "Guaraná Kuat", price: 7.90 },
                { label: "Sprite", price: 7.90 },
            ]
        }
    ]
  },
  {
    id: "p100",
    name: "Refrigerante 2L (Vários Sabores)",
    description: "Coca-Cola, Coca-Cola Zero, Guaraná Kuat.",
    price: 15.90,
    category: "Bebidas",
    imageUrl: "/images/Imagem2.webp", // Novo
    variations: [
        {
            name: "Sabor",
            options: [
                { label: "Coca-Cola Classic 2L", price: 15.90 },
                { label: "Coca-Cola Zero 2L", price: 15.90 },
                { label: "Guaraná Kuat 2L", price: 15.90 },
            ]
        }
    ]
  },
  {
    id: "p101",
    name: "Suco Del Valle Lata",
    description: "Sabores: Goiaba, Uva, Maracujá, Pêssego.",
    price: 8.90,
    category: "Bebidas",
    imageUrl: "/images/dell.jpg", // Novo
    variations: [
        {
            name: "Sabor",
            options: [
                { label: "Goiaba", price: 8.90 },
                { label: "Uva", price: 8.90 },
                { label: "Maracujá", price: 8.90 },
                { label: "Pêssego", price: 8.90 },
            ]
        }
    ]
  },
  {
    id: "p102",
    name: "Cerveja Eisenbahn Pilsen 355ml",
    description: "Cerveja puro malte.",
    price: 12.90,
    category: "Bebidas",
    imageUrl: "/images/cerveja-eisenbahn.png", // Novo (assumindo que a imagem DYAD_ATTACHMENT_67 é a cerveja)
  },
  {
    id: "p96",
    name: "Água Mineral Crystal 500ml",
    description: "Água mineral sem gás.",
    price: 4.50,
    category: "Bebidas",
    imageUrl: "/images/agua__1_.jpg",
  },
  {
    id: "p31",
    name: "Soda Ichigo",
    description: "Morango e limão siciliano.",
    price: 13.50,
    category: "Bebidas",
    imageUrl: "/images/soda-ichigo.png",
  },
  {
    id: "p32",
    name: "Soda Pink Lemonade",
    description: "Cranberry, morango e limão.",
    price: 13.50,
    category: "Bebidas",
    imageUrl: "/images/soda-pink-lemonade.png",
  },
  {
    id: "p33",
    name: "Akai Soda",
    description: "Melancia com limão.",
    price: 13.50,
    category: "Bebidas",
    imageUrl: "/images/soda_akai.jpg",
  },
  {
    id: "p34",
    name: "Midori Soda",
    description: "Maçã verde com limão siciliano.",
    price: 13.50,
    category: "Bebidas",
    imageUrl: "/images/soda_midori.jpg",
  },

  // Pratos Quentes (Continuando a lista original)
  {
    id: "p35",
    name: "Tempura Udon",
    description: "Macarrão especial, tempura de legumes, ovo, nori, cebolinha e caldo udon.",
    price: 40.90,
    category: "Pratos Quentes",
    imageUrl: "/images/tempura-udon.png",
  },
  {
    id: "p36",
    name: "LAMEN",
    description: "MACARRÃO DE LÁMEN, FILÉ SUÍNO, OVO, KANI, ALGA NORI E CEBOLINHA",
    price: 49.90,
    category: "Pratos Quentes",
    imageUrl: "/images/Design_sem_nome.webp", // Atualizado
  },
  {
    id: "p37",
    name: "Donburi Carne com Legumes",
    description: "Arroz yakimeshi com carne, legumes refogados ao molho oriental.",
    price: 40.90,
    category: "Pratos Quentes",
    imageUrl: "/images/donburi-carne-legumes.png",
  },
  {
    id: "p38",
    name: "YAKIBEEF",
    description: "Yakibeef tem sabor tradicional mas com toque diferente. O macarrão tipo yakisoba, carne com cebola, repolho, gengibre...",
    price: 40.90,
    category: "Pratos Quentes",
    imageUrl: "/images/yakbeef.jpg", // Atualizado
  },
  {
    id: "p39",
    name: "GUIOZA UDON SOUP",
    description: "O prato mais vendido Guioza Udon tem macarrão especial, guioza, kani kama, legumes, nori, cebolinha e o delicioso caldo...",
    price: 39.90,
    category: "Pratos Quentes",
    imageUrl: "/images/guioza-udon-soup.png",
  },
  {
    id: "p40",
    name: "Macarrão frango chilli",
    description: "Macarrão yakisoba com frango crispy, repolho, cenoura e damame ao molho sweet chilli.",
    price: 36.50,
    category: "Pratos Quentes",
    imageUrl: "/images/macar.jpg", // Atualizado
  },
  
  // Teppan (Novo)
  {
    id: "p103",
    name: "Teppan Salmão",
    description: "Salmão grelhado com legumes salteados e arroz yakimeshi.",
    price: 59.90,
    category: "Teppan",
    imageUrl: "/images/teppan_salmao2.jpg", // Novo
  },

  // Combinados
  {
    id: "p41",
    name: "Combinado Casal 40un",
    description: "8 niguiri salmão, 8 niguiri skin, 8 uramaki filadélfia, 8 hot filadélfia, 8 shakemaki",
    price: 136.90,
    category: "Combinados",
    imageUrl: "/images/CBO_CASAL_40.webp",
  },
  {
    id: "p42",
    name: "Combinado gourmet 36un",
    description: "6 sashimi de salmão, 4 niguiri de salmão, 2 gunka salmão, 8 uramaki filadélfia, 8 uramaki skin",
    price: 148.90,
    category: "Combinados",
    imageUrl: "/images/CBO_GOURMET_36.jpg",
  },
  {
    id: "p43",
    name: "Combinado hot 36un",
    description: "6 sashimi salmão, 4 niguiri salmão, 4 niguiri skin, 2 niguiri kani, 4 romeu e julieta, 8 hot topping, 8 hot filadelfia",
    price: 123.90,
    category: "Combinados",
    imageUrl: "/images/CBO_HOT_36.jpg", // Atualizado
  },
  {
    id: "p44",
    name: "Combinado gourmet 24un",
    description: "3 sashimi salmão, 2 niguiri camarão, 2 niguiri salmão, 1 niguiri kani, 8 hot topping, 8 hot filadelfia",
    price: 93.90,
    category: "Combinados",
    imageUrl: "/images/CBO_GOURMET_24.jpg",
  },
  {
    id: "p45",
    name: "Combinado hot 24un",
    description: "4 niguiri salmão, 4 niguiri skin, 4 filadelfia, 4 hot filadelfia, 8 shakemaki",
    price: 86.90,
    category: "Combinados",
    imageUrl: "/images/CBO_HOT_24.jpg", // Atualizado
  },
  {
    id: "p46",
    name: "Combinado simples 24un",
    description: "8 niguiri de salmão, 4 hossomaki de salmão, 4 hossomaki de atum, 4 uramaki california e 4 uramaki filadelfia",
    price: 89.90,
    category: "Combinados",
    imageUrl: "/images/CBO_SIMPLES_24.jpg",
  },
  {
    id: "p47",
    name: "Combinado gourmet 16un",
    description: "4 sashimi salmão, 2 niguiri salmão, 2 uramaki uramaki skin, 2 uramaki filadelfia especial, 4 hot furai.",
    price: 89.90,
    category: "Combinados",
    imageUrl: "/images/CBO_GOURMET_16.jpg",
  },
  {
    id: "p48",
    name: "Combinado hot 16un",
    description: "2 niguiri salmão, 2 niguiri skin, 2 tarê skin, 2 shakemaki, 4 hot filadelfia",
    price: 54.50,
    category: "Combinados",
    imageUrl: "/images/CBO_HOT_16.jpg", // Atualizado
  },
  {
    id: "p49",
    name: "Combinado simples 16un",
    description: "4 uramaki filadelfia, 4 uramaki california, 4 tarê skin, 4 shakemaki",
    price: 45.50,
    category: "Combinados",
    imageUrl: "/images/CBO_SIMPLES_16.jpg",
  },
  {
    id: "p50",
    name: "Combinado simples 12un",
    description: "4 sashimi de salmão, 2 niguiri salmão, 2 hossomaki salmão",
    price: 47.80,
    category: "Combinados",
    imageUrl: "/images/CBO_SIMPLES_12.jpg",
  },
  {
    id: "p51",
    name: "COMBINADO ESPECIAL SUSHIAKI",
    description: "Aproveite o combinado especial flor de salmão: 8 hossomaki de pepino: 8...",
    price: 119.90,
    originalPrice: 159.90,
    category: "Combinados",
    imageUrl: "/images/af-ARTES-IFOOD-03-ESP-40P_S_Easy-Resize.com.jpg",
  },
  {
    id: "p52",
    name: "Combo temaki 10",
    description: "1 temaki salmão, 2 gunka salmão, 2 uramaki filadelfia, 2 niguiri salmão, 2 niguiri skin",
    price: 67.50,
    category: "Combinados",
    imageUrl: "/images/combinado10-temakiapp.jpg", // Atualizado
  },
  {
    id: "p53",
    name: "Combo temaki 14",
    description: "1 temaki salmão, 2 gunka salmão, 2 uramaki filadelfia especial, 4 sashimi salmão, 2 uramaki filadelfia, 2 niguiri salmão",
    price: 81.90,
    category: "Combinados",
    imageUrl: "/images/combinado14-temakiapp.jpg", // Atualizado
  },
  {
    id: "p54",
    name: "Combinado Nami",
    description: "Hot com salmão, sashimi maçaricado, kani picado e maionese, uramaki gergelim com atum ao molho chilli e gunka pepino com...",
    price: 67.50,
    category: "Combinados",
    imageUrl: "/images/combinado_NAMI2.jpg",
  },
  // Novos Combinados (Bento Mix)
  {
    id: "p104",
    name: "Bento Mix 1",
    description: "Salmão grelhado, gohan, sunomono, tempurá de legumes e salada.",
    price: 45.90,
    category: "Combinados",
    imageUrl: "/images/BENTOMIX_1__1_.jpg",
  },
  {
    id: "p105",
    name: "Bento Mix 2",
    description: "Frango teriyaki, gohan, sunomono, tempurá de legumes e salada.",
    price: 42.90,
    category: "Combinados",
    imageUrl: "/images/bentomix2_-_Easy-Resize.com__1_.jpg",
  },
  {
    id: "p106",
    name: "Bento Mix Hot",
    description: "Hot Filadélfia, gohan, sunomono, tempurá de legumes e salada.",
    price: 48.90,
    category: "Combinados",
    imageUrl: "/images/BENTOMIX_HOT.jpg",
  },
  
  // Hossomaki
  {
    id: "p55",
    name: "Hossomaki Skin",
    description: "Alga enrolada com recheio de arroz e skin.",
    price: 11.30,
    category: "Hossomaki",
    imageUrl: "/images/hossomaki-skin.png",
  },
  {
    id: "p56",
    name: "Hossomaki Kani",
    description: "Alga enrolada com recheio de arroz e kani.",
    price: 11.30,
    category: "Hossomaki",
    imageUrl: "/images/HOSSO_KANI-550x650.jpg", // Atualizado
  },
  {
    id: "p107",
    name: "Hossomaki Salmão",
    description: "Alga enrolada com recheio de arroz e salmão.",
    price: 13.90,
    category: "Hossomaki",
    imageUrl: "/images/teka_maki-550x650.jpg", // Novo
  },
  
  // Uramaki
  {
    id: "p57",
    name: "Filadélfia Especial",
    description: "Salmão, cream cheese e gergelim.",
    price: 22.60,
    category: "Uramaki",
    imageUrl: "/images/filadelfia-especial.png",
  },
  {
    id: "p58",
    name: "Uramaki California",
    description: "Manga, kani, pepino e gergelim.",
    price: 16.10,
    category: "Uramaki",
    imageUrl: "/images/uramaki_california.jpg", // Atualizado
  },
  {
    id: "p59",
    name: "Uramaki Tarê Skin",
    description: "Salmão skin picado, molho tarê, pepino e gergelim.",
    price: 16.10,
    category: "Uramaki",
    imageUrl: "/images/38981200_10_87212106_3610_Easy-Resize.com.jpg", // Atualizado
  },
  {
    id: "p60",
    name: "Uramaki Romeu e Julieta",
    description: "Morango, goiabada, cream cheese e gergelim.",
    price: 13.90,
    category: "Uramaki",
    imageUrl: "/images/uramaki_romeu_julieta.jpg", // Atualizado
  },
  {
    id: "p61",
    name: "Uramaki Filadélfia",
    description: "Salmão, cream cheese e gergelim.",
    price: 16.10,
    category: "Uramaki",
    imageUrl: "/images/uramaki_filadelfia.jpg", // Atualizado
  },
  
  // Sashimi
  {
    id: "p65",
    name: "Sashimi Atum",
    description: "Fatias de atum",
    price: 39.40,
    category: "Sashimi",
    imageUrl: "/images/SASHIMI_ATUM.jpg", // Atualizado
  },
  {
    id: "p66",
    name: "Sashimi Salmão",
    description: "Fatias de salmão",
    price: 42.00,
    category: "Sashimi",
    imageUrl: "/images/sashimi.jpg", // Atualizado
  },
  
  // Hot Sushis
  {
    id: "p67",
    name: "Hot Roll",
    description: "Salmão, kani, cream cheese, molho tarê e cebolinha.",
    price: 25.50,
    category: "Hot Sushis",
    imageUrl: "/images/AF-IFOOD2-25.webp", // Atualizado
  },
  {
    id: "p68",
    name: "Filadélfia Furai",
    description: "Hot filadélfia com crispy",
    price: 25.50,
    category: "Hot Sushis",
    imageUrl: "/images/hot_furai_Easy-Resize.com.jpg", // Atualizado
  },
  {
    id: "p69",
    name: "Hot Filadélfia",
    description: "Salmão, cream cheese e molho tarê.",
    price: 25.50,
    category: "Hot Sushis",
    imageUrl: "/images/hot_filadelfia_Easy-Resize.com.jpg", // Atualizado
  },
  {
    id: "p108",
    name: "Hot Morango",
    description: "Hot roll doce recheado com morango e chocolate.",
    price: 22.90,
    category: "Hot Sushis",
    imageUrl: "/images/hot_morango_Easy-Resize.com.jpg", // Novo
  },
  
  // Tilápia Sushiaki
  {
    id: "p87",
    name: "CEVICHE TILÁPIA",
    description: "Cubos de peixe cru, cebola, milho, molho azeite e limão.",
    price: 34.50,
    category: "Tilápia Sushiaki",
    imageUrl: "/images/CEVICHE_TILAPIA.jpg",
  },
  {
    id: "p88",
    name: "URAMAKI FRY BUN",
    description: "Tilápia panko, maionese, cream cheese e cebolinha.",
    price: 22.50,
    category: "Tilápia Sushiaki",
    imageUrl: "/images/URAMAKI_FRY.jpg",
  },
  {
    id: "p89",
    name: "PEIXE CRISPY APERITIVO",
    description: "Iscas de tilápia na panko, acompanha molho de maionese com pimenta.",
    price: 34.50,
    category: "Tilápia Sushiaki",
    imageUrl: "/images/PEIXE_CRISPY_APERITIVO.jpg", // Atualizado
  },
  {
    id: "p90",
    name: "POKE PEIXE CRISPY",
    description: "Cubos de peixe empanado, sunomono, manga, gengibre, kani, crispy couve e gergelim sobre arroz de sushi.",
    price: 40.90,
    category: "Tilápia Sushiaki",
    imageUrl: "/images/POKE_PEIXE_CRISPY.jpg", // Atualizado
  },
  {
    id: "p91",
    name: "HOT POT PEIXE CRISPY",
    description: "Cubinhos de tilápia na panko e gergelim torrado, arroz yakimeshi e crispy couve.",
    price: 34.50,
    category: "Tilápia Sushiaki",
    imageUrl: "/images/HOT_POT_PEIXE_CRISPY.jpg", // Atualizado
  },
  
  // Produtos que não foram atualizados acima (mantendo os caminhos antigos se não houver novos)
  {
    id: "p109",
    name: "Salada Sashimi",
    description: "Salmão, kani, manga, pepino e mix de folhas.",
    price: 48.90,
    category: "Pokes", // Assumindo Pokes ou Pratos Quentes
    imageUrl: "/images/salada_sashimi.jpg", // Novo
  },
  
  // Mantendo o restante da lista original (com IDs p1 a p6 e p30)
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
  {
    id: "p30",
    name: "Barca com 80 peças",
    description: "Barca com 80 peças de sushi variado.",
    price: 49.90,
    category: "Novidades",
    imageUrl: "/images/barca-80-pecas.png",
    isNew: true,
    isExclusive: true,
  },
  {
    id: "p84",
    name: "KARAGUÊ CUP",
    description: "Cubos de frango frito na panko. Ótimo para aperitivar!",
    price: 31.10,
    category: "Street Food",
    imageUrl: "/images/APP_1_AF_POSTS_STREET-FOOD-IFOOD-1080X990_1_KARAGUE.jpg",
  },
  {
    id: "p85",
    name: "SAPPORO CUP",
    description: "Saboroso macarrão temperado no tacho com toque cítrico, cubos de frango na panko, gengibre em conserva, gergelim e...",
    price: 26.90,
    category: "Street Food",
    imageUrl: "/images/APP_3_AF_POSTS_STREET-FOOD-IFOOD-1080X990_3_SAPPORO.jpg",
  },
  {
    id: "p86",
    name: "HOKKAIDO CUP",
    description: "Macarrão temperado no tacho com toque cítrico, cubos de frango na panko, gengibre em conserva, gergelim e...",
    price: 26.90,
    category: "Street Food",
    imageUrl: "/images/APP_2_AF_POSTS_STREET-FOOD-IFOOD-1080X990_2_HOKKAIDO.jpg",
  },
];

export const categories = [
  "Exclusivos do App",
  "Prato do Dia",
  "Pokes",
  "Pratos Quentes",
  "Teppan", // Adicionado
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