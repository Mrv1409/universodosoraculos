export interface PacoteCredito {
    id: string;
    nome: string;
    creditos: number; // em minutos
    preco: number; // em centavos (R$ 29,90 = 2990)
    precoFormatado: string;
    popular?: boolean;
    descricao: string;
    beneficios: string[];
    stripeProductId?: string; // ID do produto no Stripe
    stripePriceId?: string; // ID do preço no Stripe
  }
  
  export const pacotesCreditos: PacoteCredito[] = [
    {
      id: 'basico',
      nome: 'Pacote de 3 perguntas de Sim ou Não + Conselho',
      creditos: 45,
      preco: 4490, // R$ 44,90
      precoFormatado: 'R$ 44,90',
      descricao: 'Perfeito para uma consulta rápida e direta',
      beneficios: [
        '3 perguntas de Sim ou Não',
        'Conselho',
        'Atendimento via WhatsApp', 
        'Tarólogo especializado',
        'Válido por 30 dias'
      ]
    },
    {
      id: 'intermediario',
      nome: 'Mandala do Amor',
      creditos: 60,
      preco: 7190, // R$ 71,90
      precoFormatado: 'R$ 71,90',
      popular: true,
      descricao: 'situação atual, influências, desfecho da relação',
      beneficios: [
        'Atendimento via WhatsApp',
        'Tarólogo especializado', 
        'Análise detalhada',
        'Válido por 60 dias'
      ]
    },
    {
      id: 'premium',
      nome: 'Mandala Astrológica',
      creditos: 90,
      preco: 10990, // R$ 109,90
      precoFormatado: 'R$ 109,90',
      descricao: 'financeiro, familiar, trabalho, amizades e amoroso',
      beneficios: [
        'Atendimento via WhatsApp',
        'Tarólogo master especializado',
        'Análise completa e detalhada',
        'Relatório por escrito',
        'Válido por 90 dias'
      ]
    },
    {

        id: 'Plus',
        nome: 'Mandala do Ano',
        creditos: 120,
        preco: 12990, // R$ 129,90
        precoFormatado: 'R$ 129,90',
        descricao: 'energia disponível para cada mês',
        beneficios: [
          'Atendimento via WhatsApp',
          'Tarólogo master especializado',
          'Análise completa e detalhada',
          'Relatório por escrito',
          'Válido por 90 dias'
        ]
    }
  ];