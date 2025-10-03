// src/services/atendimentoService.ts
import { Usuario } from '@/types';

interface SolicitarAtendimentoParams {
  usuario: Usuario;
  profissionalId: string;
  tempoSolicitado: number;
  tema?: string;
  observacoes?: string;
}

interface AtendimentoResponse {
  success: boolean;
  message: string;
  data: {
    codigoAtendimento: string;
    linkWhatsapp: string;
    tempoSolicitado: number;
    valorTotal: number;
    comissaoProfissional: number;
    comissaoPlataforma: number;
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function solicitarAtendimento(
  params: SolicitarAtendimentoParams
): Promise<AtendimentoResponse> {
  try {
    // Validar dados antes de enviar
    if (!params.usuario?.email) {
      throw new Error('Usuário não autenticado');
    }

    if (params.tempoSolicitado < 20) {
      throw new Error('Tempo mínimo é 20 minutos');
    }

    const response = await fetch('/api/atendimentos/solicitar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userEmail: params.usuario.email,
        profissionalId: params.profissionalId,
        tempoSolicitado: params.tempoSolicitado,
        tema: params.tema || '',
        observacoes: params.observacoes || ''
      }),
    });

    const data: AtendimentoResponse | ErrorResponse = await response.json();

    if (!response.ok) {
      throw new Error((data as ErrorResponse).error || 'Erro ao solicitar atendimento');
    }

    return data as AtendimentoResponse;
  } catch (error) {
    console.error('Erro no serviço de atendimento:', error);
    throw error;
  }
}

// Serviço para buscar histórico de atendimentos
export async function buscarHistoricoAtendimentos(userEmail: string) {
  try {
    const response = await fetch(`/api/atendimentos/historico?userEmail=${userEmail}`);
    
    if (!response.ok) {
      throw new Error('Erro ao buscar histórico');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw error;
  }
}

// Serviço para cancelar atendimento
export async function cancelarAtendimento(atendimentoId: string, userEmail: string) {
  try {
    const response = await fetch('/api/atendimentos/cancelar', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        atendimentoId,
        userEmail
      }),
    });

    if (!response.ok) {
      throw new Error('Erro ao cancelar atendimento');
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao cancelar atendimento:', error);
    throw error;
  }
}

// Serviço para verificar créditos do usuário
export async function verificarCreditos(userEmail: string): Promise<number> {
  try {
    // Implementação direta com Firebase se preferir
    // Ou via API se tiver endpoint
    const response = await fetch(`/api/usuarios/creditos?userEmail=${userEmail}`);
    
    if (!response.ok) {
      throw new Error('Erro ao verificar créditos');
    }

    const data = await response.json();
    return data.creditos || 0;
  } catch (error) {
    console.error('Erro ao verificar créditos:', error);
    return 0;
  }
}