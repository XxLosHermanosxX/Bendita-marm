import { Product } from "@/types";

export interface Addon {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
    price?: number; // Added price for potential paid addons
}

// New Addons (Cortesia da Casa)
export const freeAddons: Addon[] = [
    {
        id: "a1",
        name: "Farofa Extra",
        description: "Farofa crocante (Cortesia da casa)",
        imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/02jlqc4w_Farofa_Extra.png",
    },
    {
        id: "a2",
        name: "Maionese Caseira",
        description: "Maionese temperada (Cortesia da casa)",
        imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/1s22g8s8_Maionese_Caseira.png",
    },
    {
        id: "a3",
        name: "Pimenta Extra",
        description: "Molho de pimenta (Cortesia da casa)",
        imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/9lrw8p7m_Pimenta_Extra.png",
    },
    {
        id: "a4",
        name: "Talheres Extra",
        description: "Talheres descartáveis (Cortesia da casa)",
        imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/r25tj4sp_Talheres_Extra.png",
    },
];

// Paid Addons (Sugestões) - Mandioca, Batata Palha, Carne Adicional
export const paidAddons: Addon[] = [
    {
        id: "p_a1",
        name: "Carne Adicional",
        description: "Porção extra de carne",
        imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/vt6ovulh_Carne_Adicional.png",
        price: 5.00,
    },
    {
        id: "p_a2",
        name: "Mandioca Frita",
        description: "Porção de mandioca frita",
        imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/ljkoekri_Mandioca_Frita.png",
        price: 8.00,
    },
    {
        id: "p_a3",
        name: "Batata Palha Extra",
        description: "Pacote extra de batata palha",
        imageUrl: "https://customer-assets.emergentagent.com/job_github-link-2/artifacts/a3pnwah8_Batata_Palha_Extra.png",
        price: 3.00,
    },
];
