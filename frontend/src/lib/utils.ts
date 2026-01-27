import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Taxa de conversão aproximada (1 BRL = ~1400 PYG)
const BRL_TO_PYG_RATE = 1400;

// Preços base são em BRL
export function formatBRL(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatPYG(value: number): string {
  const pygValue = value * BRL_TO_PYG_RATE;
  return new Intl.NumberFormat("es-PY", {
    style: "currency",
    currency: "PYG",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pygValue);
}

// Para uso legado - retorna BRL
export function formatCurrency(value: number): string {
  return formatBRL(value);
}

export function formatPhone(value: string): string {
  const numbers = value.replace(/\D/g, "");
  if (numbers.length <= 4) return numbers;
  if (numbers.length <= 7) return `${numbers.slice(0, 4)} ${numbers.slice(4)}`;
  return `${numbers.slice(0, 4)} ${numbers.slice(4, 7)} ${numbers.slice(7, 10)}`;
}
