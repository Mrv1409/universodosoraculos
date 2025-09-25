// Tipos de usuário
export interface Usuario {
  uid: string;
  nome: string;
  email: string;
  telefone?: string;
  creditos: number; // minutos disponíveis
  criadoEm: Date;
  atualizadoEm: Date;
}

// Tipos de consulta
export interface Consulta {
  id: string;
  usuarioId: string;
  tipo: 'leitura-gratuita' | 'consulta-paga';
  status: 'pendente' | 'em-andamento' | 'concluida';
  duracao?: number; // minutos
  valor?: number; // valor em reais
  codigoWhatsapp?: string;
  criadaEm: Date;
  concluidaEm?: Date;
}

// TIPOS ATUALIZADOS - Carta de Tarot com interpretações por tema
export interface CartaTarot {
  id: string;
  nome: string;
  descricao: string;
  interpretacoes: {
    amor: string;
    projetos: string;
    karmas: string;
    dinheiro: string;
    vida: string;
  };
  imagemUrl: string;
}

// Tipos de leitura gratuita ATUALIZADO
export interface LeituraGratuita {
  tema: 'amor' | 'projetos' | 'karmas' | 'dinheiro' | 'vida';
  cartas: {
    primeira: CartaTarot;
    segunda: CartaTarot;
    terceira: CartaTarot;
  };
  interpretacaoGeral: string;
  criadaEm: Date;
}

// Tipos de pagamento
export interface Pagamento {
  id: string;
  usuarioId: string;
  valor: number;
  status: 'pendente' | 'concluido' | 'falhado';
  stripePaymentId?: string;
  creditosAdicionados: number; // minutos
  criadoEm: Date;
}