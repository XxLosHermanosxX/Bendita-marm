export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  ingredients?: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface DeliveryAddress {
  cep: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
}

export interface CustomerInfo {
  name: string;
  phone: string;
}

export type CheckoutStep = 'address' | 'personal' | 'payment';
