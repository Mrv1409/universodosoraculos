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

// === NOVAS FUNÇÕES ESPECÍFICAS PARA O PROJETO ===

// VALOR POR MINUTO: R$ 2,60
export const VALOR_POR_MINUTO = 2.60;
export const TEMPO_MINIMO_CONSULTA = 20; // minutos

// Calcular valor da consulta baseado nos minutos
export function calcularValorConsulta(minutos: number): number {
  if (minutos < TEMPO_MINIMO_CONSULTA) {
    throw new Error(`Tempo mínimo da consulta é ${TEMPO_MINIMO_CONSULTA} minutos`);
  }
  return minutos * VALOR_POR_MINUTO;
}

// Calcular quantos minutos podem ser comprados com um valor
export function calcularMinutosPorValor(valor: number): number {
  return Math.floor(valor / VALOR_POR_MINUTO);
}

// Validar se o tempo solicitado é válido
export function validarTempoConsulta(tempoSolicitado: number, creditosDisponiveis: number): {
  valido: boolean;
  mensagem: string;
} {
  if (tempoSolicitado < TEMPO_MINIMO_CONSULTA) {
    return {
      valido: false,
      mensagem: `Tempo mínimo da consulta é ${TEMPO_MINIMO_CONSULTA} minutos`
    };
  }
  
  if (tempoSolicitado > creditosDisponiveis) {
    const faltam = tempoSolicitado - creditosDisponiveis;
    return {
      valido: false,
      mensagem: `Faltam ${faltam} minutos de crédito (${formatarReal(faltam * VALOR_POR_MINUTO)})`
    };
  }
  
  return {
    valido: true,
    mensagem: 'Tempo válido para consulta'
  };
}

// Formatar tempo e valor juntos (ex: "30min - R$ 78,00")
export function formatarTempoEValor(minutos: number): string {
  return `${formatarTempo(minutos)} - ${formatarReal(calcularValorConsulta(minutos))}`;
}