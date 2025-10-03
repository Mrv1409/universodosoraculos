export interface PacoteCredito {
  id: string;
  nome: string;
  creditos: number; // em minutos (0 para planos ilimitados)
  preco: number; // em centavos (R$ 29,90 = 2990)
  precoFormatado: string;
  popular?: boolean;
  descricao: string;
  beneficios: string[];
  tipo: 'especifico' | 'geral'; // Novo campo para diferenciar tipos
  stripeProductId?: string; // ID do produto no Stripe
  stripePriceId?: string; // ID do preço no Stripe
}

// PLANOS ESPECÍFICOS (ILIMITADOS)
export const planosEspecificos: PacoteCredito[] = [
  {
    id: 'sim-nao-conselho',
    nome: '3 Perguntas Sim/Não + Conselho',
    creditos: 0, // Ilimitado
    preco: 4490, // R$ 44,90
    precoFormatado: 'R$ 44,90',
    tipo: 'especifico',
    descricao: 'Consulta específica com 3 perguntas diretas e orientação',
    beneficios: [
      '3 perguntas de Sim ou Não',
      'Conselho personalizado',
      'Tempo ilimitado de atendimento',
      'Atendimento via WhatsApp', 
      'Tarólogo especializado'
    ]
  },
  {
    id: 'mandala-amor',
    nome: 'Mandala do Amor',
    creditos: 0, // Ilimitado
    preco: 7190, // R$ 71,90
    precoFormatado: 'R$ 71,90',
    popular: true,
    tipo: 'especifico',
    descricao: 'Análise completa: situação atual, influências e desfecho da relação',
    beneficios: [
      'Mandala completa do amor',
      'Situação atual detalhada',
      'Análise de influências',
      'Previsão de desfecho',
      'Tempo ilimitado de atendimento',
      'Atendimento via WhatsApp',
      'Tarólogo especializado'
    ]
  },
  {
    id: 'mandala-astrologica',
    nome: 'Mandala Astrológica',
    creditos: 0, // Ilimitado
    preco: 10990, // R$ 109,90
    precoFormatado: 'R$ 109,90',
    tipo: 'especifico',
    descricao: 'Análise astrológica: financeiro, familiar, trabalho, amizades e amoroso',
    beneficios: [
      'Análise astrológica completa',
      'Área financeira detalhada',
      'Relações familiares',
      'Situação profissional',
      'Círculo de amizades',
      'Vida amorosa',
      'Tempo ilimitado de atendimento',
      'Tarólogo master especializado',
      'Relatório por escrito'
    ]
  },
  {
    id: 'mandala-ano',
    nome: 'Mandala do Ano',
    creditos: 0, // Ilimitado
    preco: 12990, // R$ 129,90
    precoFormatado: 'R$ 129,90',
    tipo: 'especifico',
    descricao: 'Previsão anual: energia disponível e orientações para cada mês',
    beneficios: [
      'Previsão completa do ano',
      'Energia de cada mês',
      'Orientações mensais',
      'Melhor período para ações',
      'Ciclos energéticos',
      'Tempo ilimitado de atendimento',
      'Tarólogo master especializado',
      'Relatório detalhado por escrito'
    ]
  }
];

// PLANOS GERAIS (POR MINUTAGEM)
export const planosGerais: PacoteCredito[] = [
  {
    id: 'consulta-express',
    nome: 'Consulta Express',
    creditos: 20, // 20 minutos
    preco: 5200, // R$ 52,00 (20 × R$ 2,60)
    precoFormatado: 'R$ 52,00',
    tipo: 'geral',
    descricao: 'Consulta geral rápida e objetiva para esclarecer dúvidas pontuais',
    beneficios: [
      '20 minutos de consulta',
      'Qualquer tema de sua escolha',
      'Atendimento direto via WhatsApp',
      'Tarólogo especializado',
      'Resposta imediata'
    ]
  },
  {
    id: 'consulta-completa',
    nome: 'Consulta Completa',
    creditos: 30, // 30 minutos
    preco: 7800, // R$ 78,00 (30 × R$ 2,60)
    precoFormatado: 'R$ 78,00',
    popular: true,
    tipo: 'geral',
    descricao: 'Consulta geral com tempo adequado para análise aprofundada',
    beneficios: [
      '30 minutos de consulta',
      'Análise detalhada',
      'Múltiplas perguntas',
      'Orientações personalizadas',
      'Atendimento via WhatsApp',
      'Tarólogo especializado'
    ]
  },
  {
    id: 'consulta-aprofundada',
    nome: 'Consulta Aprofundada',
    creditos: 45, // 45 minutos
    preco: 11700, // R$ 117,00 (45 × R$ 2,60)
    precoFormatado: 'R$ 117,00',
    tipo: 'geral',
    descricao: 'Consulta geral extensiva para questões complexas e múltiplos temas',
    beneficios: [
      '45 minutos de consulta',
      'Análise de múltiplos temas',
      'Questões complexas',
      'Orientações detalhadas',
      'Conselhos práticos',
      'Atendimento via WhatsApp',
      'Tarólogo master especializado'
    ]
  },
  {
    id: 'consulta-premium',
    nome: 'Consulta Premium',
    creditos: 60, // 60 minutos
    preco: 15600, // R$ 156,00 (60 × R$ 2,60)
    precoFormatado: 'R$ 156,00',
    tipo: 'geral',
    descricao: 'Consulta geral completa para análise profunda e transformação pessoal',
    beneficios: [
      '60 minutos de consulta',
      'Análise completa e profunda',
      'Todas as áreas da vida',
      'Plano de ação personalizado',
      'Orientações transformadoras',
      'Atendimento via WhatsApp',
      'Tarólogo master especializado',
      'Resumo por escrito'
    ]
  }
];

// TODOS OS PACOTES UNIDOS (para compatibilidade com código existente)
export const pacotesCreditos: PacoteCredito[] = [
  ...planosEspecificos,
  ...planosGerais
];

// FUNÇÕES AUXILIARES
export const getPlanosEspecificos = (): PacoteCredito[] => planosEspecificos;
export const getPlanosGerais = (): PacoteCredito[] => planosGerais;
export const getPacotePorId = (id: string): PacoteCredito | undefined => 
  pacotesCreditos.find(pacote => pacote.id === id);
export const isPacoteEspecifico = (id: string): boolean => 
  planosEspecificos.some(plano => plano.id === id);
export const isPacoteGeral = (id: string): boolean => 
  planosGerais.some(plano => plano.id === id);