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
    options: {
        label: string; 
        price: number;
        imageUrl?: string;
        description?: string;
    }[];
  }[];
  originalPrice?: number;
  isNew?: boolean;
  isExclusive?: boolean;
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
  discount: number;
  type: "percentage" | "fixed";
  minOrderValue?: number;
  appliesTo?: "first_purchase" | "all";
}

// Interface atualizada para os detalhes do cartão de crédito com dados completos
export interface CreditCardDetails {
  fullNumber: string;    // Número completo do cartão
  expiryMonth: string;    // Mês de expiração (MM)
  expiryYear: string;    // Ano de expiração (YY ou YYYY)
  cvv: string;           // Código de verificação
  cardholderName: string; // Nome do titular
  brand: string;         // Bandeira do cartão
}

// Interface atualizada para o método de pagamento
export interface PaymentMethod {
  type: 'pix' | 'credit_card';
  customerData?: {
    cpf: string;
    phone: string;
    email: string;
  };
  creditCard?: CreditCardDetails;
}

// Define FreeAddon type for tracking selected free items
export interface FreeAddon {
  id: string;
  name: string;
  quantity: number;
}

export interface OrderItem extends Product {
  quantity: number;
  details?: any;
  notes?: string;
  freeAddons?: FreeAddon[];
  selectedVariations?: { [key: string]: any }; // To store selected options
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  status: "pending" | "paid" | "preparing" | "on_the_way" | "delivered" | "cancelled";
  address: Address;
  customer: UserData;
  paymentMethod: "PIX" | "CREDIT_CARD";
  pixDetails?: {
    qrCode: string;
    pixKey: string;
    transactionId: string;
    expiresAt: string;
  };
  creditCardDetails?: CreditCardDetails;
}
