import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatCep(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 5) return numbers;
  return `${numbers.slice(0, 5)}-${numbers.slice(5, 8)}`;
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 2) return `(${numbers}`;
  if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
  return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
}

// CEPs atendidos (Foz do Iguaçu e região)
const VALID_CEP_PREFIXES = ["858", "857", "856"];

export async function validateCep(cep: string): Promise<{
  valid: boolean;
  address?: {
    street: string;
    neighborhood: string;
    city: string;
    state: string;
  };
  error?: string;
}> {
  const cleanCep = cep.replace(/\D/g, "");
  
  if (cleanCep.length !== 8) {
    return { valid: false, error: "CEP inválido" };
  }
  
  // Verificar se está na área de entrega
  const prefix = cleanCep.slice(0, 3);
  if (!VALID_CEP_PREFIXES.includes(prefix)) {
    return { valid: false, error: "Infelizmente não atendemos sua região ainda" };
  }
  
  try {
    const response = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`);
    const data = await response.json();
    
    if (data.erro) {
      return { valid: false, error: "CEP não encontrado" };
    }
    
    return {
      valid: true,
      address: {
        street: data.logradouro || "",
        neighborhood: data.bairro || "",
        city: data.localidade || "",
        state: data.uf || "",
      },
    };
  } catch {
    return { valid: false, error: "Erro ao verificar CEP" };
  }
}
