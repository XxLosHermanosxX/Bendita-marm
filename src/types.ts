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
  discountPercentage: number; // Adicionado
  // Adicione outras propriedades do cupom se necessário
}

// Nova interface para o método de pagamento
export interface PaymentMethod {
  type: 'credit_card' | 'money';
  cardBrand?: string; // Para cartão de crédito
  changeNeeded?: boolean; // Para dinheiro
  changeFor?: number; // Para dinheiro
}