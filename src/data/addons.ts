import { Product } from "@/types";

export interface Addon {
    id: string;
    name: string;
    description: string;
    imageUrl: string;
}

export const freeAddons: Addon[] = [
    {
        id: "a1",
        name: "Wasabi Extra",
        description: "Wasabi Extra (Cortesia da casa)",
        imageUrl: "/images/add_wasabi.png",
    },
    {
        id: "a2",
        name: "Gengibre Extra",
        description: "Gengibre (Gari) Extra (Cortesia da casa)",
        imageUrl: "/images/gengibre.png",
    },
    {
        id: "a3",
        name: "Tarê Extra",
        description: "Molho Tarê Extra (Cortesia da casa)",
        imageUrl: "/images/tare.png",
    },
    {
        id: "a4",
        name: "Hashi Extra",
        description: "Hashi Extra (Par) (Cortesia da casa)",
        imageUrl: "/images/hashi.png",
    },
    {
        id: "a5",
        name: "Cream Cheese Extra",
        description: "Cream Cheese Extra (Cortesia da casa)",
        imageUrl: "/images/creamcheese.png",
    },
];