'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Usuario } from '@/types';
import { 
  formatarTempo, 
  formatarReal, 
  calcularValorConsulta, 
  validarTempoConsulta,
  TEMPO_MINIMO_CONSULTA,
  VALOR_POR_MINUTO 
} from '@/lib/utils';
import { getPlanosEspecificos, getPlanosGerais, getPacotePorId } from '@/data/pacotes-creditos';

interface ConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario;
  profissionalPreSelecionado?: string;
  onSucesso?: () => void;
}

// Tempos para consultas gerais
const temposConsultaGeral = [
  { valor: 20, label: '20min', popular: true, valorReal: 52.00 },
  { valor: 30, label: '30min', popular: false, valorReal: 78.00 },
  { valor: 45, label: '45min', popular: false, valorReal: 117.00 },
  { valor: 60, label: '60min', popular: false, valorReal: 156.00 }
];

// Temas disponíveis para consulta
const temasConsulta = [
  { id: 'amor', nome: 'Amor e Relacionamentos', icone: '💕' },
  { id: 'carreira', nome: 'Carreira e Projetos', icone: '💼' },
  { id: 'espiritualidade', nome: 'Espiritualidade e Karmas', icone: '🔮' },
  { id: 'dinheiro', nome: 'Dinheiro e Prosperidade', icone: '💰' },
  { id: 'vida', nome: 'Vida Pessoal', icone: '🌟' },
  { id: 'geral', nome: 'Consulta Geral', icone: '✨' }
];

// Dados dos profissionais
const profissionais = [
  { id: 'aurora', nome: 'Cigana Aurora', especialidade: 'Tarot Cigano', icone: '💕', online: true },
  { id: 'mary', nome: 'Cigana Mary', especialidade: 'Baralho Cigano', icone: '🚀', online: true },
  { id: 'jade', nome: 'Cigana Jade', especialidade: 'Cristalomancia', icone: '🌙', online: true },
  { id: 'mel', nome: 'Cigana Mel', especialidade: 'Numerologia', icone: '✨', online: true }
];

export default function ConsultaModal({ 
  isOpen, 
  onClose, 
  usuario, 
  profissionalPreSelecionado,
  onSucesso 
}: ConsultaModalProps) {
  const router = useRouter();
  const [etapa, setEtapa] = useState<'tipo' | 'profissional' | 'detalhes' | 'confirmacao' | 'sem-creditos'>('tipo');
  const [tipoConsulta, setTipoConsulta] = useState<'especifico' | 'geral' | null>(null);
  const [planoEspecificoId, setPlanoEspecificoId] = useState('');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(profissionalPreSelecionado || '');
  const [tempoSelecionado, setTempoSelecionado] = useState(20);
  const [temaSelecionado, setTemaSelecionado] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [processando, setProcessando] = useState(false);

  const creditosDisponiveis = usuario.creditos || 0;
  const validacao = validarTempoConsulta(tempoSelecionado, creditosDisponiveis);
  const valorConsulta = calcularValorConsulta(tempoSelecionado);
  
  const planosEspecificos = getPlanosEspecificos();//eslint-disable-next-line
  const planosGerais = getPlanosGerais();
  const planoSelecionado = planoEspecificoId ? getPacotePorId(planoEspecificoId) : null;

  // Inicializar etapa baseada nos créditos
  useEffect(() => {
    if (!isOpen) return;
    
    if (creditosDisponiveis < TEMPO_MINIMO_CONSULTA) {
      setEtapa('sem-creditos');
    } else {
      setEtapa('tipo');
    }
  }, [isOpen, creditosDisponiveis]);

  if (!isOpen) return null;

  const handleContinuar = () => {
    if (etapa === 'tipo' && tipoConsulta) {
      setEtapa('profissional');
    } else if (etapa === 'profissional' && profissionalSelecionado) {
      setEtapa('detalhes');
    } else if (etapa === 'detalhes') {
      setEtapa('confirmacao');
    }
  };

  const handleVoltar = () => {
    if (etapa === 'detalhes') {
      setEtapa('profissional');
    } else if (etapa === 'confirmacao') {
      setEtapa('detalhes');
    } else if (etapa === 'profissional') {
      setEtapa('tipo');
    } else if (etapa === 'sem-creditos') {
      setEtapa('tipo');
    }
  };

  const handleComprarCreditos = () => {
    router.push('/creditos');
    onClose();
  };

  const handleSolicitarConsulta = async () => {
    // Validar se é consulta geral
    if (tipoConsulta === 'geral' && !validacao.valido) {
      alert(validacao.mensagem);
      return;
    }

    // Validar se é consulta específica
    if (tipoConsulta === 'especifico' && !planoEspecificoId) {
      alert('Selecione um plano específico.');
      return;
    }

    setProcessando(true);

    try {//eslint-disable-next-line
      const requestBody: any = {
        userId: usuario.uid,
        profissionalId: profissionalSelecionado,
        tema: temaSelecionado || undefined,
        observacoes: observacoes || undefined
      };

      // Adicionar dados específicos conforme o tipo
      if (tipoConsulta === 'especifico') {
        requestBody.planId = planoEspecificoId;
      } else {
        requestBody.tempoSolicitado = tempoSelecionado;
      }

      const response = await fetch('/api/solicitar-consulta', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Erro ao solicitar consulta');
      }

      if (!data.success) {
        throw new Error(data.message || 'Erro no agendamento');
      }

      // Abrir WhatsApp
      if (data.data?.linkWhatsapp) {
        const linkWhatsapp = data.data.linkWhatsapp;
        
        const whatsappWindow = window.open(linkWhatsapp, '_blank');
        
        if (!whatsappWindow || whatsappWindow.closed) {
          setTimeout(() => {
            window.location.href = linkWhatsapp;
          }, 1000);
        }
        
        setTimeout(() => {
          if (confirm(
            '📱 CONSULTA AGENDADA!\n\n' +
            'Se o WhatsApp não abriu automaticamente, clique OK para abrir manualmente.\n\n' +
            'Código: ' + data.data.codigoAtendimento
          )) {
            window.location.href = linkWhatsapp;
          }
        }, 2000);
      }

      onClose();
      if (onSucesso) onSucesso();
    // eslint-disable-next-line
    } catch (error: any) {
      console.error('🚨 Erro ao solicitar consulta:', error);
      
      let mensagemErro = 'Erro inesperado ao solicitar consulta';
      
      if (error.message.includes('Créditos insuficientes')) {
        mensagemErro = `❌ CRÉDITOS INSUFICIENTES\n\nVocê precisa de ${tempoSelecionado} minutos\nDisponível: ${creditosDisponiveis} minutos`;
      } else if (error.message.includes('Usuário não encontrado')) {
        mensagemErro = '❌ ERRO DE AUTENTICAÇÃO\n\nFaça login novamente para continuar';
      } else if (error.message.includes('Dados incompletos')) {
        mensagemErro = '❌ DADOS INCOMPLETOS\n\nVerifique se todos os campos estão preenchidos';
      } else {
        mensagemErro = `❌ ERRO NO SISTEMA\n\n${error.message}`;
      }
      
      alert(mensagemErro);
    } finally {
      setProcessando(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-black/90 backdrop-blur-xl rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-purple-500/50">
        
        {/* Header */}
        <div className="p-6 border-b border-purple-500/30">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">
              {etapa === 'sem-creditos' ? '💰 Adquirir Créditos' : '🔮 Solicitar Consulta'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors p-2"
            >
              ✕
            </button>
          </div>
          
          {/* Progress Bar */}
          {etapa !== 'sem-creditos' && (
            <div className="mt-4 flex items-center space-x-2">
              {['tipo', 'profissional', 'detalhes', 'confirmacao'].map((step, index) => (
                <div key={step} className="flex-1 h-2 rounded-full bg-gray-700">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      ['tipo', 'profissional', 'detalhes', 'confirmacao'].indexOf(etapa) >= index 
                        ? 'bg-gradient-to-r from-purple-500 to-indigo-500' 
                        : 'bg-gray-700'
                    }`}
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          
          {/* SEM CRÉDITOS */}
          {etapa === 'sem-creditos' && (
            <div className="text-center">
              <div className="text-8xl mb-6">💸</div>
        
              <h3 className="text-2xl font-bold text-white mb-4">
                Créditos Insuficientes
              </h3>
        
              <p className="text-purple-200 text-lg mb-8">
                Para consultas gerais, você precisa de pelo menos {TEMPO_MINIMO_CONSULTA} minutos de crédito.
              </p>

              <div className="bg-blue-900/20 rounded-2xl p-6 border border-blue-500/30 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">💡</span>
                  <span className="text-blue-300 font-semibold">Você ainda pode escolher um plano específico!</span>
                </div>
                <p className="text-blue-200 text-sm">
                  Os planos específicos têm tempo ilimitado e não usam seus créditos.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <button
                  onClick={() => setEtapa('tipo')}
                  className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30 hover:border-purple-400/50 transition-colors"
                >
                  <div className="text-3xl mb-2">🔮</div>
                  <h4 className="font-bold text-white mb-2">Ver Planos Específicos</h4>
                  <p className="text-purple-300 text-sm">Tempo ilimitado</p>
                </button>
                
                <button
                  onClick={handleComprarCreditos}
                  className="bg-yellow-900/20 rounded-xl p-4 border border-yellow-500/30 hover:border-yellow-400/50 transition-colors"
                >
                  <div className="text-3xl mb-2">💳</div>
                  <h4 className="font-bold text-white mb-2">Comprar Créditos</h4>
                  <p className="text-yellow-300 text-sm">Para consultas gerais</p>
                </button>
              </div>
            </div>
          )}

          {/* ESCOLHER TIPO DE CONSULTA */}
          {etapa === 'tipo' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6">
                Escolha o tipo de consulta
              </h3>
              
              <div className="space-y-4 mb-6">
                {/* Planos Específicos */}
                <button
                  onClick={() => setTipoConsulta('especifico')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    tipoConsulta === 'especifico'
                      ? 'border-purple-400 bg-purple-900/30'
                      : 'border-purple-500/30 bg-purple-900/10 hover:border-purple-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">🔮</div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Planos Específicos</h4>
                        <p className="text-purple-300 text-sm">Consultas temáticas com tempo ilimitado</p>
                      </div>
                    </div>
                    <div className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      ILIMITADO
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-purple-200">
                    {planosEspecificos.slice(0, 4).map(plano => (
                      <div key={plano.id}>• {plano.nome}</div>
                    ))}
                  </div>
                </button>

                {/* Consultas Gerais */}
                <button
                  onClick={() => setTipoConsulta('geral')}
                  className={`w-full p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                    tipoConsulta === 'geral'
                      ? 'border-blue-400 bg-blue-900/30'
                      : 'border-blue-500/30 bg-blue-900/10 hover:border-blue-400/50'
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                      <div className="text-4xl">⏱️</div>
                      <div>
                        <h4 className="font-bold text-white text-lg">Consulta Geral</h4>
                        <p className="text-blue-300 text-sm">Qualquer tema, cobrança por minuto</p>
                      </div>
                    </div>
                    <div className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                      {formatarReal(VALOR_POR_MINUTO)}/min
                    </div>
                  </div>
                  <div className="text-xs text-blue-200">
                    Seus créditos: {formatarTempo(creditosDisponiveis)} • Mínimo: {TEMPO_MINIMO_CONSULTA}min
                  </div>
                </button>
              </div>
            </div>
          )}

          {/* ESCOLHER PROFISSIONAL */}
          {etapa === 'profissional' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6">
                Escolha seu Profissional
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                {profissionais.map((prof) => (
                  <button
                    key={prof.id}
                    onClick={() => setProfissionalSelecionado(prof.id)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${
                      profissionalSelecionado === prof.id
                        ? 'border-purple-400 bg-purple-900/30'
                        : 'border-purple-500/30 bg-purple-900/10 hover:border-purple-400/50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{prof.icone}</div>
                      <div className="flex-1">
                        <h4 className="font-bold text-white">{prof.nome}</h4>
                        <p className="text-purple-300 text-sm">{prof.especialidade}</p>
                        <div className="flex items-center mt-1">
                          <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse mr-2"></span>
                          <span className="text-green-400 text-xs">Online</span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DETALHES DA CONSULTA */}
          {etapa === 'detalhes' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6">
                Detalhes da Consulta
              </h3>

              {/* Seleção de Plano Específico */}
              {tipoConsulta === 'especifico' && (
                <div className="mb-6">
                  <label className="block text-purple-300 text-sm font-medium mb-3">
                    Escolha seu plano:
                  </label>
                  <div className="space-y-3">
                    {planosEspecificos.map((plano) => (
                      <button
                        key={plano.id}
                        onClick={() => setPlanoEspecificoId(plano.id)}
                        className={`w-full p-4 rounded-xl border transition-all duration-300 text-left ${
                          planoEspecificoId === plano.id
                            ? 'border-purple-400 bg-purple-900/30'
                            : 'border-purple-500/30 bg-purple-900/10 hover:border-purple-400/50'
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-white">{plano.nome}</h4>
                          <div className="text-right">
                            <div className="text-yellow-400 font-bold">{plano.precoFormatado}</div>
                            <div className="text-green-400 text-xs">ILIMITADO</div>
                          </div>
                        </div>
                        <p className="text-purple-300 text-sm">{plano.descricao}</p>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Seleção de Tempo para Consulta Geral */}
              {tipoConsulta === 'geral' && (
                <div className="mb-6">
                  <label className="block text-purple-300 text-sm font-medium mb-3">
                    Duração da Consulta ({formatarReal(VALOR_POR_MINUTO)}/min):
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {temposConsultaGeral.map((tempo) => {
                      const suficiente = creditosDisponiveis >= tempo.valor;
                      return (
                        <button
                          key={tempo.valor}
                          onClick={() => setTempoSelecionado(tempo.valor)}
                          disabled={!suficiente}
                          className={`p-4 rounded-xl border transition-all duration-300 relative ${
                            tempoSelecionado === tempo.valor
                              ? 'border-purple-400 bg-purple-900/30'
                              : suficiente 
                                ? 'border-purple-500/30 bg-purple-900/10 hover:border-purple-400/50'
                                : 'border-red-500/30 bg-red-900/10 opacity-50 cursor-not-allowed'
                          }`}
                        >
                          {tempo.popular && suficiente && (
                            <span className="absolute -top-2 -right-2 bg-yellow-500 text-black text-xs px-2 py-1 rounded-full font-bold">
                              Popular
                            </span>
                          )}
                          {!suficiente && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                              Sem crédito
                            </span>
                          )}
                          <div className={`font-bold text-lg ${suficiente ? 'text-white' : 'text-red-400'}`}>
                            {tempo.label}
                          </div>
                          <div className={`text-sm ${suficiente ? 'text-purple-300' : 'text-red-300'}`}>
                            {formatarReal(tempo.valorReal)}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                  
                  {tipoConsulta === 'geral' && !validacao.valido && (
                    <div className="mt-4 bg-yellow-900/20 rounded-xl p-4 border border-yellow-500/30">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-yellow-300 font-medium">⚠️ {validacao.mensagem}</p>
                        </div>
                        <button
                          onClick={handleComprarCreditos}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Comprar Créditos
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tema da Consulta */}
              <div className="mb-6">
                <label className="block text-purple-300 text-sm font-medium mb-3">
                  Tema (opcional):
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {temasConsulta.map((tema) => (
                    <button
                      key={tema.id}
                      onClick={() => setTemaSelecionado(tema.id === temaSelecionado ? '' : tema.id)}
                      className={`p-3 rounded-xl border transition-all duration-300 ${
                        temaSelecionado === tema.id
                          ? 'border-purple-400 bg-purple-900/30'
                          : 'border-purple-500/30 bg-purple-900/10 hover:border-purple-400/50'
                      }`}
                    >
                      <div className="text-xl mb-1">{tema.icone}</div>
                      <div className="text-white text-sm">{tema.nome}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Observações */}
              <div className="mb-6">
                <label className="block text-purple-300 text-sm font-medium mb-3">
                  Observações (opcional):
                </label>
                <textarea
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={3}
                  className="w-full p-3 bg-purple-900/20 border border-purple-500/30 rounded-xl text-white placeholder-purple-400 focus:border-purple-400 focus:outline-none"
                  placeholder="Conte um pouco sobre sua situação ou dúvida..."
                />
              </div>
            </div>
          )}

          {/* CONFIRMAÇÃO */}
          {etapa === 'confirmacao' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6">
                Confirmar Consulta
              </h3>

              <div className="bg-purple-900/20 rounded-2xl p-6 mb-6 border border-purple-500/30">
                <h4 className="font-bold text-purple-300 mb-4">Resumo da Consulta:</h4>
                
                <div className="space-y-3 text-white">
                  <div className="flex justify-between">
                    <span>Profissional:</span>
                    <span className="font-medium">
                      {profissionais.find(p => p.id === profissionalSelecionado)?.nome}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tipo:</span>
                    <span className="font-medium">
                      {tipoConsulta === 'especifico' ? planoSelecionado?.nome : 'Consulta Geral'}
                    </span>
                  </div>
                  {tipoConsulta === 'geral' ? (
                    <>
                      <div className="flex justify-between">
                        <span>Duração:</span>
                        <span className="font-medium">{formatarTempo(tempoSelecionado)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor:</span>
                        <span className="font-medium text-yellow-400">{formatarReal(valorConsulta)}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between">
                        <span>Duração:</span>
                        <span className="font-medium text-green-400">ILIMITADO</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Valor:</span>
                        <span className="font-medium text-yellow-400">{planoSelecionado?.precoFormatado}</span>
                      </div>
                    </>
                  )}
                  {temaSelecionado && (
                    <div className="flex justify-between">
                      <span>Tema:</span>
                      <span className="font-medium">
                        {temasConsulta.find(t => t.id === temaSelecionado)?.nome}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Validação final */}
              <div className={`p-4 rounded-xl mb-6 ${
                (tipoConsulta === 'geral' && validacao.valido) || tipoConsulta === 'especifico'
                  ? 'bg-green-900/20 border border-green-500/30' 
                  : 'bg-red-900/20 border border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    {tipoConsulta === 'especifico' ? (
                      <p className="text-green-300">✅ Plano específico selecionado - Tempo ilimitado</p>
                    ) : (
                      <p className={validacao.valido ? 'text-green-300' : 'text-red-300'}>
                        Seus créditos: {formatarTempo(creditosDisponiveis)} | {validacao.mensagem}
                      </p>
                    )}
                  </div>
                  <div className={`text-2xl ${
                    (tipoConsulta === 'geral' && validacao.valido) || tipoConsulta === 'especifico' 
                      ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {(tipoConsulta === 'geral' && validacao.valido) || tipoConsulta === 'especifico' ? '✅' : '❌'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Saldo de Créditos */}
          {etapa !== 'sem-creditos' && tipoConsulta === 'geral' && (
            <div className="bg-black/40 rounded-xl p-4 mb-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <span className="text-purple-300">Seus créditos:</span>
                <span className="text-yellow-400 font-bold">
                  {formatarTempo(creditosDisponiveis)}
                </span>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-purple-300 text-sm">Valor por minuto:</span>
                <span className="text-green-400 text-sm font-bold">
                  {formatarReal(VALOR_POR_MINUTO)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-500/30">
          <div className="flex gap-4">
            {etapa === 'sem-creditos' ? (
              <>
                <button
                  onClick={handleVoltar}
                  className="flex-1 py-3 px-6 bg-gray-600/50 hover:bg-gray-600/70 text-white font-medium rounded-xl transition-all duration-300"
                >
                  ← Voltar
                </button>
                <button
                  onClick={handleComprarCreditos}
                  className="flex-1 py-3 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-xl transition-all duration-300"
                >
                  💳 Comprar Créditos
                </button>
              </>
            ) : (
              <>
                {etapa !== 'tipo' && (
                  <button
                    onClick={handleVoltar}
                    className="flex-1 py-3 px-6 bg-gray-600/50 hover:bg-gray-600/70 text-white font-medium rounded-xl transition-all duration-300"
                  >
                    ← Voltar
                  </button>
                )}
                
                {etapa !== 'confirmacao' ? (
                  <button
                    onClick={handleContinuar}
                    disabled={
                      (etapa === 'tipo' && !tipoConsulta) ||
                      (etapa === 'profissional' && !profissionalSelecionado) ||
                      (etapa === 'detalhes' && tipoConsulta === 'especifico' && !planoEspecificoId)
                    }
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300"
                  >
                    Continuar →
                  </button>
                ) : (
                  <button
                    onClick={handleSolicitarConsulta}
                    disabled={
                      processando || 
                      (tipoConsulta === 'geral' && !validacao.valido) ||
                      (tipoConsulta === 'especifico' && !planoEspecificoId)
                    }
                    className="flex-1 py-4 px-6 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300"
                  >
                    {processando ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processando...
                      </span>
                    ) : (
                      '📱 Abrir WhatsApp'
                    )}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}