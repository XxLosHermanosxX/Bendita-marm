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
        imageUrl: "/images/farofa-placeholder.png",
    },
    {
        id: "a2",
        name: "Maionese Caseira",
        description: "Maionese temperada (Cortesia da casa)",
        imageUrl: "/images/maionese-placeholder.png",
    },
    {
        id: "a3",
        name: "Pimenta Extra",
        description: "Molho de pimenta (Cortesia da casa)",
        imageUrl: "/images/pimenta-placeholder.png",
    },
    {
        id: "a4",
        name: "Talheres Extra",
        description: "Talheres descartáveis (Cortesia da casa)",
        imageUrl: "/images/hashi.png", // Reusing hashi icon as placeholder for cutlery
    },
];

// Paid Addons (Sugestões) - Mandioca, Batata Palha, Carne Adicional
export const paidAddons: Addon[] = [
    {
        id: "p_a1",
        name: "Carne Adicional",
        description: "Porção extra de carne",
        imageUrl: "/images/carne-extra-placeholder.png",
        price: 5.00,
    },
    {
        id: "p_a2",
        name: "Mandioca Frita",
        description: "Porção de mandioca frita",
        imageUrl: "/images/mandioca-placeholder.png",
        price: 8.00,
    },
    {
        id: "p_a3",
        name: "Batata Palha Extra",
        description: "Pacote extra de batata palha",
        imageUrl: "/images/batata-palha-placeholder.png",
        price: 3.00,
    },
];