export type Category =
  | "Exclusivos do App"
  | "Prato do Dia"
  | "Pokes"
  | "Pratos Quentes"
  | "Niguiri"
  | "Temaki"
  | "Yakisoba"
  | "Vegetarianos"
  | "Especiais"
  | "Novidades"
  | "Soda" // Added based on images
  | "Combinados" // Added based on images
  | "Hossomaki" // Added based on images
  | "Uramaki" // Added based on images
  | "Sashimi" // Added based on images
  | "Hot Sushis" // Added based on images
  | "Tilápia Sushiaki" // Added based on images
  | "Street Food"; // Added based on images


export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // For discounted items
  category: Category;
  imageUrl: string;
  rating?: number;
  reviews?: number;
  isNew?: boolean;
  isExclusive?: boolean;
  variations?: {
    name: string;
    options: { label: string; price: number }[];
  }[];
  ingredients?: string[];
}

export interface CartItem extends Product {
  quantity: number;
  selectedVariation?: {
    name: string;
    option: { label: string; price: number };
  };
  notes?: string;
}

export interface Address {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface UserData {
  name: string;
  email: string;
  phone: string;
  cpf?: string;
}

export interface Coupon {
  code: string;
  discount: number; // percentage or fixed amount
  type: "percentage" | "fixed";
  minOrderValue?: number;
  appliesTo?: "first_purchase" | "all";
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "paid" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  address: Address;
  customer: UserData;
  paymentMethod: "PIX";
  pixDetails?: {
    qrCode: string;
    pixKey: string;
    transactionId: string;
    expiresAt: string;
  };
}