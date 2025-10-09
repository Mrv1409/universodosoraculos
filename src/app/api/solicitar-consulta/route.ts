import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  addDoc,
  increment, 
  serverTimestamp,
  runTransaction, 
  Timestamp
} from 'firebase/firestore';
import { getPacotePorId, isPacoteEspecifico } from '@/data/pacotes-creditos';

// Interface para os dados da requisição
interface SolicitacaoConsultaRequest {
  userId: string;
  profissionalId: string;
  tempoSolicitado?: number; // Opcional para planos específicos
  planId?: string; // ID do plano específico (se aplicável)
  tema?: string;
  observacoes?: string;
}

//eslint-disable-next-line
interface RegistroAtendimento {
  id: string;
  codigoAtendimento: string;
  usuarioId: string;
  usuarioNome: string;
  usuarioEmail: string;
  profissionalId: string;
  profissionalNome: string;
  
  // Dados da consulta
  tipoConsulta: 'geral' | 'especifico';
  tempoSolicitado?: number; // Apenas para consultas gerais
  planId?: string; // ID do plano específico
  planNome?: string; // Nome do plano específico
  tema: string | null;
  observacoes: string | null;
  
  // Dados financeiros
  valorPorMinuto?: number; // Apenas para consultas gerais
  valorTotal: number;
  creditosUtilizados: number; // 0 para planos específicos
  
  // Comissões (60% profissional / 40% plataforma)
  comissaoProfissional: number;
  comissaoPlataforma: number;
  
  // Status e controle
  status: 'agendado' | 'em_andamento' | 'concluido' | 'cancelado';
  codigoWhatsapp: string;
  linkWhatsapp: string;
  
  // Timestamps
  criadoEm: Timestamp;
  atualizadoEm: Timestamp;
  iniciadoEm: Timestamp | null;
  concluidoEm: Timestamp | null;
}

// Configurações do sistema
const VALOR_POR_MINUTO = 2.60;
const COMISSAO_PROFISSIONAL = 0.60; // 60%
const COMISSAO_PLATAFORMA = 0.40;   // 40%

// Dados mockados dos profissionais
const profissionaisData = {
  'aurora': { nome: 'Cigana Aurora' },
  'mary': { nome: 'Cigana Mary' },
  'jade': { nome: 'Cigana Jade' },
  'mel': { nome: 'Cigana Mel' }
};

// Função para gerar código único do atendimento
function gerarCodigoAtendimento(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substr(2, 5).toUpperCase();
  return `ATD-${timestamp}-${random}`;
}

// Função para gerar código WhatsApp simples
function gerarCodigoWhatsapp(): string {
  return Math.random().toString(36).substr(2, 8).toUpperCase();
}

// Função para gerar link do WhatsApp
function gerarLinkWhatsapp(
  profissionalId: string, 
  codigoAtendimento: string, 
  usuarioNome: string, 
  usuarioTelefone: string, 
  tipoConsulta: 'geral' | 'especifico',
  tema?: string, 
  tempoSolicitado?: number,
  planNome?: string
): string {
  const numeroWhatsapp = '5574988173413';
  const profissionalNome = profissionaisData[profissionalId as keyof typeof profissionaisData]?.nome || 'Profissional';
  
  let mensagem = `🔮 *NOVA CONSULTA - UNIVERSO DOS ORÁCULOS*\n\n` +
                 `*Código:* ${codigoAtendimento}\n` +
                 `*Cliente:* ${usuarioNome}\n` +
                 `*Telefone:* ${usuarioTelefone}\n` +
                 `*Email:* Disponível no sistema\n` +
                 `*Profissional Solicitada:* ${profissionalNome}\n`;

  if (tipoConsulta === 'especifico') {
    mensagem += `*Tipo:* ${planNome || 'Plano Específico'}\n` +
                 `*Modalidade:* TEMPO ILIMITADO\n`;
  } else {
    mensagem += `*Tipo:* Consulta Geral\n` +
                 `*Tempo:* ${tempoSolicitado}min\n`;
  }

  mensagem += `*Tema:* ${tema || 'Não especificado'}\n\n` +
              `📋 *Cliente confirmado e pronto para atendimento!*\n` +
              `✨ *Entrar em contato IMEDIATAMENTE no número acima!*`;
  
  return `https://wa.me/${numeroWhatsapp}?text=${encodeURIComponent(mensagem)}`;
}

// Função para calcular valores e comissões
function calcularValores(tempoSolicitado: number) {
  const valorTotal = tempoSolicitado * VALOR_POR_MINUTO;
  const comissaoProfissional = valorTotal * COMISSAO_PROFISSIONAL;
  const comissaoPlataforma = valorTotal * COMISSAO_PLATAFORMA;
  
  return {
    valorTotal: Number(valorTotal.toFixed(2)),
    comissaoProfissional: Number(comissaoProfissional.toFixed(2)),
    comissaoPlataforma: Number(comissaoPlataforma.toFixed(2))
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: SolicitacaoConsultaRequest = await request.json();
    
    if (!body.userId) {
      return NextResponse.json(
        { error: 'UID do usuário é obrigatório. Faça login para continuar.' },
        { status: 401 }
      );
    }

    if (!body.profissionalId) {
      return NextResponse.json(
        { error: 'Profissional é obrigatório.' },
        { status: 400 }
      );
    }

    // Determinar tipo de consulta
    let tipoConsulta: 'geral' | 'especifico';
    let pacote = null;
    
    if (body.planId) {
      // Verificar se é um plano específico
      pacote = getPacotePorId(body.planId);
      if (!pacote) {
        return NextResponse.json(
          { error: 'Plano não encontrado.' },
          { status: 400 }
        );
      }
      tipoConsulta = isPacoteEspecifico(body.planId) ? 'especifico' : 'geral';
    } else {
      // Consulta geral tradicional
      tipoConsulta = 'geral';
      if (!body.tempoSolicitado || body.tempoSolicitado < 20) {
        return NextResponse.json(
          { error: 'Para consultas gerais, o tempo mínimo é 20 minutos.' },
          { status: 400 }
        );
      }
    }

    // Buscar dados do usuário pelo UID
    const usuariosRef = collection(db, 'usuarios');
    const userQuery = doc(usuariosRef, body.userId);
    
    // Usar transaction para garantir consistência
    const resultado = await runTransaction(db, async (transaction) => {
      const userDoc = await transaction.get(userQuery);
      
      if (!userDoc.exists()) {
        throw new Error('Usuário não encontrado');
      }
      
      const userData = userDoc.data();
      let valores = { valorTotal: 0, comissaoProfissional: 0, comissaoPlataforma: 0 };
      let creditosUtilizados = 0;
      
      // Validar créditos apenas para consultas gerais
      if (tipoConsulta === 'geral') {
        const tempoNecessario = body.tempoSolicitado || 0;
        const creditosDisponiveis = userData.creditos || 0;
        
        if (creditosDisponiveis < tempoNecessario) {
          throw new Error(`Créditos insuficientes. Disponível: ${creditosDisponiveis}min, Solicitado: ${tempoNecessario}min`);
        }
        
        valores = calcularValores(tempoNecessario);
        creditosUtilizados = tempoNecessario;
      } else {
        // Para planos específicos, usar o preço do pacote
        if (pacote) {
          const precoEmReais = pacote.preco / 100;
          valores = {
            valorTotal: precoEmReais,
            comissaoProfissional: Number((precoEmReais * COMISSAO_PROFISSIONAL).toFixed(2)),
            comissaoPlataforma: Number((precoEmReais * COMISSAO_PLATAFORMA).toFixed(2))
          };
        }
        creditosUtilizados = 0; // Planos específicos não debitam créditos
      }
      
      // Gerar códigos
      const codigoAtendimento = gerarCodigoAtendimento();
      const codigoWhatsapp = gerarCodigoWhatsapp();
      
      // Gerar link WhatsApp
      const linkWhatsapp = gerarLinkWhatsapp(
        body.profissionalId, 
        codigoAtendimento,
        userData.nome || 'Cliente',
        userData.telefone || 'Não informado',
        tipoConsulta,
        body.tema,
        body.tempoSolicitado,
        pacote?.nome
      );
      
      //eslint-disable-next-line
      const atendimentoData: any = {
        codigoAtendimento,
        usuarioId: body.userId,
        usuarioNome: userData.nome || 'Cliente',
        usuarioEmail: userData.email || '',
        profissionalId: body.profissionalId,
        profissionalNome: profissionaisData[body.profissionalId as keyof typeof profissionaisData]?.nome || 'Profissional',
        
        // Dados da consulta
        tipoConsulta,
        tema: body.tema || null,
        observacoes: body.observacoes || null,
        
        // Dados financeiros
        valorTotal: valores.valorTotal,
        creditosUtilizados,
        
        // Comissões
        comissaoProfissional: valores.comissaoProfissional,
        comissaoPlataforma: valores.comissaoPlataforma,
        
        // Status e controle
        status: 'agendado',
        codigoWhatsapp,
        linkWhatsapp,
        
        // Timestamps
        criadoEm: serverTimestamp() as Timestamp,
        atualizadoEm: serverTimestamp() as Timestamp,
        iniciadoEm: null,
        concluidoEm: null
      };

      // Adicionar campos condicionais apenas se não forem undefined
      if (tipoConsulta === 'geral') {
        atendimentoData.tempoSolicitado = body.tempoSolicitado;
        atendimentoData.valorPorMinuto = VALOR_POR_MINUTO;
      }

      if (tipoConsulta === 'especifico') {
        atendimentoData.planId = body.planId;
        atendimentoData.planNome = pacote?.nome;
      }
      
      // Salvar atendimento
      const atendimentosRef = collection(db, 'atendimentos');
      const atendimentoDocRef = await addDoc(atendimentosRef, atendimentoData);
      
      // Debitar créditos apenas para consultas gerais
      if (tipoConsulta === 'geral' && creditosUtilizados > 0) {
        transaction.update(userQuery, {
          creditos: increment(-creditosUtilizados),
          atualizadoEm: serverTimestamp()
        });
      }
      
      // Registrar transação financeira
      const descricaoTransacao = tipoConsulta === 'especifico' 
        ? `${pacote?.nome || 'Plano Específico'} - Tempo Ilimitado`
        : `Consulta Geral com ${atendimentoData.profissionalNome} - ${body.tempoSolicitado}min`;
        
      const transacaoData = {
        tipo: tipoConsulta === 'especifico' ? 'debito_plano_especifico' : 'debito_consulta_geral',
        usuarioId: body.userId,
        atendimentoId: atendimentoDocRef.id, 
        valor: tipoConsulta === 'especifico' ? 0 : -creditosUtilizados,
        valorReal: -valores.valorTotal,
        descricao: descricaoTransacao,
        criadoEm: serverTimestamp()
      };
      
      const transacoesRef = collection(db, 'transacoes');
      await addDoc(transacoesRef, transacaoData);
      
      return {
        success: true,
        atendimentoId: atendimentoDocRef.id,
        codigoAtendimento,
        linkWhatsapp,
        tipoConsulta,
        valores
      };
    });
    
    // Retornar sucesso
    return NextResponse.json({
      success: true,
      message: `${resultado.tipoConsulta === 'especifico' ? 'Plano específico' : 'Consulta geral'} agendada com sucesso!`,
      data: {
        codigoAtendimento: resultado.codigoAtendimento,
        linkWhatsapp: resultado.linkWhatsapp,
        tipoConsulta: resultado.tipoConsulta,
        tempoSolicitado: body.tempoSolicitado,
        planNome: pacote?.nome,
        valorTotal: resultado.valores.valorTotal,
        comissaoProfissional: resultado.valores.comissaoProfissional,
        comissaoPlataforma: resultado.valores.comissaoPlataforma
      }
    });//eslint-disable-next-line
  } catch (error: any) {
    console.error('🚨 ERRO COMPLETO:', error);
    console.error('🚨 MENSAGEM:', error.message);
    console.error('🚨 STACK:', error.stack);
    
    return NextResponse.json(
      { 
        error: error.message || 'Erro interno do servidor',
        success: false
      },
      { status: 500 }
    );
  }
}
//eslint-disable-next-line
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      message: 'Endpoint para histórico de atendimentos'
    });//eslint-disable-next-line
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar atendimentos' },
      { status: 500 }
    );
  }
}