import { Usuario } from '@/types';

// Números de WhatsApp dos profissionais (ALTERE AQUI)
export const numerosWhatsApp = {
  prof1: '5511999999991', // Marina Celestial
  prof2: '5511999999992', // Gabriel Místico  
  prof3: '5511999999993', // Luna Esotérica
  prof4: '5511999999994'  // Ricardo Vidente
};

// Dados dos profissionais para mensagens
export const profissionaisWhatsApp = {
  prof1: { nome: 'Marina Celestial', especialidade: 'Amor e Relacionamentos' },
  prof2: { nome: 'Gabriel Místico', especialidade: 'Carreira e Projetos' },
  prof3: { nome: 'Luna Esotérica', especialidade: 'Espiritualidade e Karmas' },
  prof4: { nome: 'Ricardo Vidente', especialidade: 'Consultas Gerais' }
};

export interface SolicitacaoConsulta {
  profissionalId: string;
  tempoSolicitado: number; // em minutos
  tema?: string;
  observacoes?: string;
}

// Função principal para gerar link do WhatsApp
export function gerarLinkWhatsApp({
  usuario,
  solicitacao
}: {
  usuario: Usuario;
  solicitacao: SolicitacaoConsulta;
}): string {
  const profissional = profissionaisWhatsApp[solicitacao.profissionalId as keyof typeof profissionaisWhatsApp];
  const numeroWhatsApp = numerosWhatsApp[solicitacao.profissionalId as keyof typeof numerosWhatsApp];
  
  if (!profissional || !numeroWhatsApp) {
    throw new Error('Profissional não encontrado');
  }

  // Criar mensagem personalizada
  const mensagem = criarMensagemConsulta({
    nomeCliente: usuario.nome,
    emailCliente: usuario.email,
    nomeProfissional: profissional.nome,
    especialidade: profissional.especialidade,
    tempoSolicitado: solicitacao.tempoSolicitado,
    tema: solicitacao.tema,
    observacoes: solicitacao.observacoes
  });

  // Gerar link do WhatsApp
  const linkWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensagem)}`;
  
  return linkWhatsApp;
}

// Função para criar mensagem personalizada
function criarMensagemConsulta({
  nomeCliente,
  emailCliente,
  nomeProfissional,
  especialidade,
  tempoSolicitado,
  tema,
  observacoes
}: {
  nomeCliente: string;
  emailCliente: string;
  nomeProfissional: string;
  especialidade: string;
  tempoSolicitado: number;
  tema?: string;
  observacoes?: string;
}): string {
  let mensagem = `🔮 *NOVA CONSULTA - UNIVERSO DOS ORÁCULOS*\n\n`;
  
  mensagem += `👋 Olá ${nomeProfissional}!\n\n`;
  
  mensagem += `📋 *DADOS DO CLIENTE:*\n`;
  mensagem += `• Nome: ${nomeCliente}\n`;
  mensagem += `• Email: ${emailCliente}\n\n`;
  
  mensagem += `🔮 *CONSULTA SOLICITADA:*\n`;
  mensagem += `• Especialidade: ${especialidade}\n`;
  mensagem += `• Tempo: ${tempoSolicitado} minutos\n`;
  
  if (tema) {
    mensagem += `• Tema: ${tema}\n`;
  }
  
  if (observacoes) {
    mensagem += `• Observações: ${observacoes}\n`;
  }
  
  mensagem += `\n✨ *Cliente com créditos confirmados e pronto para consulta!*\n\n`;
  
  mensagem += `Por favor, confirme sua disponibilidade para iniciarmos a sessão. 🙏`;
  
  return mensagem;
}

// Função para validar se cliente tem créditos suficientes
export function validarCreditos(creditosDisponiveis: number, tempoSolicitado: number): {
  suficiente: boolean;
  mensagem: string;
} {
  if (creditosDisponiveis >= tempoSolicitado) {
    return {
      suficiente: true,
      mensagem: 'Créditos suficientes'
    };
  }
  
  const creditosFaltando = tempoSolicitado - creditosDisponiveis;
  
  return {
    suficiente: false,
    mensagem: `Você precisa de mais ${creditosFaltando} minutos de crédito. Compre créditos adicionais para continuar.`
  };
}

// Função para formatar tempo em texto legível
export function formatarTempoConsulta(minutos: number): string {
  if (minutos < 60) {
    return `${minutos} minutos`;
  }
  
  const horas = Math.floor(minutos / 60);
  const minutosRestantes = minutos % 60;
  
  if (minutosRestantes === 0) {
    return `${horas} hora${horas > 1 ? 's' : ''}`;
  }
  
  return `${horas}h${minutosRestantes}min`;
}

// Opções de tempo pré-definidas para consultas
export const temposConsulta = [
  { valor: 15, label: '15 minutos', popular: false },
  { valor: 30, label: '30 minutos', popular: true },
  { valor: 45, label: '45 minutos', popular: false },
  { valor: 60, label: '1 hora', popular: false },
  { valor: 90, label: '1h 30min', popular: false }
];

// Temas disponíveis para consulta
export const temasConsulta = [
  { id: 'amor', nome: 'Amor e Relacionamentos', icone: '💕' },
  { id: 'carreira', nome: 'Carreira e Projetos', icone: '💼' },
  { id: 'espiritualidade', nome: 'Espiritualidade e Karmas', icone: '🔮' },
  { id: 'dinheiro', nome: 'Dinheiro e Prosperidade', icone: '💰' },
  { id: 'vida', nome: 'Vida Pessoal', icone: '🌟' },
  { id: 'geral', nome: 'Consulta Geral', icone: '✨' }
];