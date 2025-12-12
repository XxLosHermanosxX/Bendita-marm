export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  ingredients?: string[];
  variations?: {
    name: string;
    options: { label: string; price: number }[];
  }[];
  originalPrice?: number; // For discounted items
  isNew?: boolean; // Adicionado
  isExclusive?: boolean; // Adicionado
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
}

export interface Coupon {
  code: string;
  discount: number; // percentage or fixed amount - Adicionado
  type: "percentage" | "fixed"; // Adicionado
  minOrderValue?: number;
  appliesTo?: "first_purchase" | "all";
}

// Nova interface para o método de pagamento
export interface PaymentMethod {
  type: 'credit_card' | 'money';
  cardBrand?: string; // Para cartão de crédito
  changeNeeded?: boolean; // Para dinheiro
  changeFor?: number; // Para dinheiro
}