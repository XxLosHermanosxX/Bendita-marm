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
  cpf?: string;
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
  type: 'pix'; // Agora só PIX
  customerData?: {
    cpf: string;
    phone: string;
    email: string;
  };
}

export interface Order {
  id: string;
  date: string;
  items: Array<{
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    category: string;
    quantity: number;
    details?: any;
    notes?: string;
  }>;
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