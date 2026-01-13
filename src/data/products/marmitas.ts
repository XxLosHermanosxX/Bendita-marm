import { Product } from "@/types";

// Base price for all main marmitas
const MARMITA_PRICE = 17.00;

// Helper to find marmita details by name or ID (simulated since we're defining it in the same file)
// We will manually construct the combo options to ensure they have the correct data

export const marmitaProducts: Product[] = [
  // Destaque do Dia (Strogonoff de Carne)
  {
    id: "m1",
    name: "Strogonoff de Carne ⭐ (Destaque do Dia)",
    description: "Carne macia em cubos, molho cremoso e encorpado, arroz branco soltinho e batata palha crocante. Clássico irresistível!",
    price: MARMITA_PRICE,
    category: "Marmita Destaque do Dia",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/ebflpj7x_Strogonoff_de_Carne.png",
    isExclusive: true,
  },
  
  // Combos - MOVED TO TOP as requested
  {
    id: "c1",
    name: "Combo Bendito",
    description: "Sua marmita favorita + Refrigerante 600ml + Mousse de Brigadeiro. Deixe sua refeição completa!",
    price: 20.00,
    category: "Combos",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/cqsth8y8_Combo_Bendito.png",
    variations: [
        {
            name: "Escolha sua Marmita",
            options: [
                { 
                    label: "Strogonoff de Carne", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/ebflpj7x_Strogonoff_de_Carne.png",
                    description: "Carne suculenta, molho cremoso, arroz branco e batata palha."
                },
                { 
                    label: "Strogonoff de Frango", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/skqxkw0x_Strogonoff_de_Frango.png",
                    description: "Frango macio ao molho cremoso, arroz soltinho e batata palha crocante."
                },
                { 
                    label: "Bife Acebolado", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/gxau2xby_Bife_Acebolado.png",
                    description: "Bife grelhado, suculento, com cebola dourada, arroz branco, feijão e farofa."
                },
                { 
                    label: "Carne de Panela", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/usw765fs_Carne_de_Panela.png",
                    description: "Carne cozida lentamente, bem macia, com molho encorpado, arroz branco e feijão."
                },
                { 
                    label: "Frango Grelhado", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/5x4od10y_Frango_Grelhado.png",
                    description: "Filé de frango temperado e grelhado, arroz, feijão e legumes refogados."
                },
                { 
                    label: "Frango à Milanesa", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/6lps6u70_Frango_a_Milanesa.png",
                    description: "Frango empanado e crocante, arroz branco, feijão e purê de batata."
                },
                { 
                    label: "Linguiça Acebolada", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/rglugpdw_Linguica_Acebolada.png",
                    description: "Linguiça suculenta com cebola, arroz branco, feijão e couve refogada."
                },
                { 
                    label: "Carne Moída Caseira", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/4w69imcl_Carne_Moida_Caseira.png",
                    description: "Carne moída bem temperada, arroz branco, feijão e legumes."
                },
                { 
                    label: "Parmegiana de Frango", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/by7zodro_Parmegiana_de_Frango.png",
                    description: "Frango empanado com molho de tomate e queijo derretido, arroz branco e purê."
                },
                { 
                    label: "Feijoada Simples", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/l1dewkaw_Feijoada_Simples.png",
                    description: "Feijão encorpado com carnes selecionadas, arroz branco e farofa."
                },
            ]
        },
        {
            name: "Escolha seu Refrigerante",
            options: [
                { 
                    label: "Coca-Cola", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/7pvph1jr_Refrigerante_600ml.png",
                    description: "Coca-Cola Original 600ml"
                },
                { 
                    label: "Guaraná", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/7pvph1jr_Refrigerante_600ml.png", // Using same placeholder for now or if user provided specific
                    description: "Guaraná Antarctica 600ml"
                },
                { 
                    label: "Fanta Laranja", 
                    price: 0,
                    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/7pvph1jr_Refrigerante_600ml.png", // Using same placeholder
                    description: "Fanta Laranja 600ml"
                },
            ]
        }
    ]
  },

  // Cardápio Principal (10 opções)
  {
    id: "m2",
    name: "Strogonoff de Carne",
    description: "Carne suculenta, molho cremoso, arroz branco e batata palha.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/ebflpj7x_Strogonoff_de_Carne.png",
  },
  {
    id: "m3",
    name: "Strogonoff de Frango",
    description: "Frango macio ao molho cremoso, arroz soltinho e batata palha crocante.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/skqxkw0x_Strogonoff_de_Frango.png",
  },
  {
    id: "m4",
    name: "Bife Acebolado",
    description: "Bife grelhado, suculento, com cebola dourada, arroz branco, feijão e farofa.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/gxau2xby_Bife_Acebolado.png",
  },
  {
    id: "m5",
    name: "Carne de Panela",
    description: "Carne cozida lentamente, bem macia, com molho encorpado, arroz branco e feijão.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/usw765fs_Carne_de_Panela.png",
  },
  {
    id: "m6",
    name: "Frango Grelhado",
    description: "Filé de frango temperado e grelhado, arroz, feijão e legumes refogados.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/5x4od10y_Frango_Grelhado.png",
  },
  {
    id: "m7",
    name: "Frango à Milanesa",
    description: "Frango empanado e crocante, arroz branco, feijão e purê de batata.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/6lps6u70_Frango_a_Milanesa.png",
  },
  {
    id: "m8",
    name: "Linguiça Acebolada",
    description: "Linguiça suculenta com cebola, arroz branco, feijão e couve refogada.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/rglugpdw_Linguica_Acebolada.png",
  },
  {
    id: "m9",
    name: "Carne Moída Caseira",
    description: "Carne moída bem temperada, arroz branco, feijão e legumes.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/4w69imcl_Carne_Moida_Caseira.png",
  },
  {
    id: "m10",
    name: "Parmegiana de Frango",
    description: "Frango empanado com molho de tomate e queijo derretido, arroz branco e purê.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/by7zodro_Parmegiana_de_Frango.png",
  },
  {
    id: "m11",
    name: "Feijoada Simples",
    description: "Feijão encorpado com carnes selecionadas, arroz branco e farofa.",
    price: MARMITA_PRICE,
    category: "Cardápio Principal",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/l1dewkaw_Feijoada_Simples.png",
  },
  
  // Sobremesas
  {
    id: "d1",
    name: "Mousse de Brigadeiro",
    description: "Cremoso, geladinho e com aquele gostinho de chocolate que fecha a refeição com chave de ouro.",
    price: 5.00,
    category: "Sobremesas",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/lqs74zk8_48964560-f06b-11f0-9dc5-d9bf6d168bd4.png",
  },
  
  // Bebidas (Refrigerante 600ml)
  {
    id: "b1",
    name: "Refrigerante 600ml",
    description: "Coca-Cola, Guaraná, Fanta.",
    price: 5.00,
    category: "Bebidas",
    imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/7pvph1jr_Refrigerante_600ml.png",
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
