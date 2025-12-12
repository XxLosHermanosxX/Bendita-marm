import { Product } from "@/types";

export const beverageProducts: Product[] = [
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
    imageUrl: "/images/Imagem2.webp",
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
];