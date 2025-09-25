import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// Função para combinar classes CSS (muito útil com Tailwind)
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Função para formatar tempo em minutos para horas:minutos
export function formatarTempo(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const min = minutos % 60;
  
  if (horas > 0) {
    return `${horas}h ${min}min`;
  }
  return `${min}min`;
}

// Função para formatar valores em Real
export function formatarReal(valor: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(valor);
}

// Função para formatar datas
export function formatarData(data: Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(data);
}

// Função para gerar código único para WhatsApp
export function gerarCodigoWhatsapp(): string {
  return Math.random().toString(36).substr(2, 9).toUpperCase();
}