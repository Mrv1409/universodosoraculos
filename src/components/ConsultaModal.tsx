'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Usuario } from '@/types';
import { 
  gerarLinkWhatsApp, 
  validarCreditos, 
  temposConsulta, 
  temasConsulta,
  profissionaisWhatsApp,
  SolicitacaoConsulta 
} from '@/lib/whatsapp';
import { formatarTempo } from '@/lib/utils';
import { doc, updateDoc, increment, setDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ConsultaModalProps {
  isOpen: boolean;
  onClose: () => void;
  usuario: Usuario;
  profissionalPreSelecionado?: string;
  onSucesso?: () => void;
}

export default function ConsultaModal({ 
  isOpen, 
  onClose, 
  usuario, 
  profissionalPreSelecionado,
  onSucesso 
}: ConsultaModalProps) {
  const router = useRouter();
  const [etapa, setEtapa] = useState<'profissional' | 'detalhes' | 'confirmacao' | 'sem-creditos'>('profissional');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState(profissionalPreSelecionado || '');
  const [tempoSelecionado, setTempoSelecionado] = useState(30);
  const [temaSelecionado, setTemaSelecionado] = useState('');
  const [observacoes, setObservacoes] = useState('');
  const [processando, setProcessando] = useState(false);

  if (!isOpen) return null;

  const creditosDisponiveis = usuario.creditos || 0;
  
  //eslint-disable-next-line
  const determinarEtapaInicial = () => {
    if (creditosDisponiveis === 0) {
      return 'sem-creditos';
    }
    return 'profissional';
  };

  // Inicializar etapa baseada nos créditos
  if (etapa === 'profissional' && creditosDisponiveis === 0) {
    setEtapa('sem-creditos');
  }

  const validacao = validarCreditos(creditosDisponiveis, tempoSelecionado);

  const profissionais = [
    { id: 'prof1', nome: 'Marina Celestial', especialidade: 'Amor e Relacionamentos', icone: '💕', online: true },
    { id: 'prof2', nome: 'Gabriel Místico', especialidade: 'Carreira e Projetos', icone: '🚀', online: true },
    { id: 'prof3', nome: 'Luna Esotérica', especialidade: 'Espiritualidade e Karmas', icone: '🌙', online: true },
    { id: 'prof4', nome: 'Ricardo Vidente', especialidade: 'Consultas Gerais', icone: '✨', online: true }
  ];

  const handleContinuar = () => {
    if (etapa === 'profissional' && profissionalSelecionado) {
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
    }
  };

  const handleComprarCreditos = () => {
    router.push('/creditos');
    onClose();
  };

  const handleAjustarTempo = () => {
    // Ajustar para o tempo máximo de créditos disponíveis
    const tempoMaximo = Math.min(creditosDisponiveis, 60); // Max 60 minutos
    setTempoSelecionado(tempoMaximo);
    
    // Se ainda não for suficiente, mostrar opções menores
    if (tempoMaximo < 15) {
      setTempoSelecionado(creditosDisponiveis);
    }
  };

  const handleSolicitarConsulta = async () => {
    if (!validacao.suficiente) {
      alert('Créditos insuficientes!');
      return;
    }

    setProcessando(true);

    try {
      const solicitacao: SolicitacaoConsulta = {
        profissionalId: profissionalSelecionado,
        tempoSolicitado: tempoSelecionado,
        tema: temaSelecionado || undefined,
        observacoes: observacoes || undefined
      };

      // Gerar link do WhatsApp
      const linkWhatsApp = gerarLinkWhatsApp({
        usuario,
        solicitacao
      });

      // Registrar consulta no Firebase
      const consultaRef = doc(collection(db, 'consultas-solicitadas'));
      await setDoc(consultaRef, {
        userId: usuario.uid,
        profissionalId: profissionalSelecionado,
        tempoSolicitado: tempoSelecionado,
        tema: temaSelecionado || null,
        observacoes: observacoes || null,
        status: 'pendente',
        criadoEm: new Date(),
        linkWhatsApp
      });

      // Debitar créditos do usuário
      const userRef = doc(db, 'usuarios', usuario.uid);
      await updateDoc(userRef, {
        creditos: increment(-tempoSelecionado),
        atualizadoEm: new Date()
      });

      // Abrir WhatsApp
      window.open(linkWhatsApp, '_blank');

      // Fechar modal e notificar sucesso
      onClose();
      if (onSucesso) onSucesso();

      alert('Consulta solicitada com sucesso! Você foi redirecionado para o WhatsApp do profissional.');

    } catch (error) {
      console.error('Erro ao solicitar consulta:', error);
      alert('Erro ao solicitar consulta. Tente novamente.');
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
          
          {/* Progress Bar - Só mostra se não for sem-creditos */}
          {etapa !== 'sem-creditos' && (
            <div className="mt-4 flex items-center space-x-2">
              {['profissional', 'detalhes', 'confirmacao'].map((step, index) => (
                <div key={step} className="flex-1 h-2 rounded-full bg-gray-700">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      ['profissional', 'detalhes', 'confirmacao'].indexOf(etapa) >= index 
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
          
          {/* CENÁRIO 1: SEM CRÉDITOS */}
          {etapa === 'sem-creditos' && (
            <div className="text-center">
              <div className="text-8xl mb-6">💸</div>
              
              <h3 className="text-2xl font-bold text-white mb-4">
                Você não possui créditos
              </h3>
              
              <p className="text-purple-200 text-lg mb-8">
                Para solicitar uma consulta com nossos especialistas, você precisa adquirir créditos.
              </p>

              <div className="bg-red-900/20 rounded-2xl p-6 border border-red-500/30 mb-8">
                <div className="flex items-center justify-center mb-4">
                  <span className="text-4xl mr-3">⚠️</span>
                  <span className="text-red-300 font-semibold">Créditos Insuficientes</span>
                </div>
                <p className="text-red-200">
                  Saldo atual: <span className="font-bold">{formatarTempo(creditosDisponiveis)}</span>
                </p>
                <p className="text-red-200 text-sm mt-2">
                  Consulta mínima: 15 minutos
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-bold text-white mb-2">Consulta Rápida</h4>
                  <p className="text-purple-300 text-sm mb-3">15-30 minutos</p>
                  <p className="text-yellow-400 font-bold">A partir de R$ 29,90</p>
                </div>
                
                <div className="bg-purple-900/20 rounded-xl p-4 border border-purple-500/30">
                  <div className="text-3xl mb-2">🔮</div>
                  <h4 className="font-bold text-white mb-2">Consulta Completa</h4>
                  <p className="text-purple-300 text-sm mb-3">30-60 minutos</p>
                  <p className="text-yellow-400 font-bold">A partir de R$ 49,90</p>
                </div>
              </div>

              <button
                onClick={handleComprarCreditos}
                className="w-full py-4 px-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-lg rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg mb-4"
              >
                💳 Comprar Créditos Agora
              </button>

              <p className="text-purple-400 text-sm">
                Pagamento seguro via cartão ou PIX
              </p>
            </div>
          )}

          {/* CENÁRIO 2 E 3: TEM ALGUNS CRÉDITOS - Fluxo normal mas com validação */}
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

          {/* Etapa 2: Detalhes da Consulta */}
          {etapa === 'detalhes' && (
            <div>
              <h3 className="text-xl font-bold text-white mb-6">
                Detalhes da Consulta
              </h3>

              {/* Tempo da Consulta */}
              <div className="mb-6">
                <label className="block text-purple-300 text-sm font-medium mb-3">
                  Duração da Consulta:
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {temposConsulta.map((tempo) => {
                    const suficiente = creditosDisponiveis >= tempo.valor;
                    return (
                      <button
                        key={tempo.valor}
                        onClick={() => setTempoSelecionado(tempo.valor)}
                        disabled={!suficiente}
                        className={`p-3 rounded-xl border transition-all duration-300 relative ${
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
                        <div className={`font-medium ${suficiente ? 'text-white' : 'text-red-400'}`}>
                          {tempo.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                {/* Aviso de créditos insuficientes */}
                {!validacao.suficiente && (
                  <div className="mt-4 bg-yellow-900/20 rounded-xl p-4 border border-yellow-500/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-yellow-300 font-medium">⚠️ Créditos insuficientes</p>
                        <p className="text-yellow-200 text-sm">{validacao.mensagem}</p>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleAjustarTempo}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Ajustar Tempo
                        </button>
                        <button
                          onClick={handleComprarCreditos}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                        >
                          Comprar Créditos
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

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

          {/* Etapa 3: Confirmação */}
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
                      {profissionaisWhatsApp[profissionalSelecionado as keyof typeof profissionaisWhatsApp]?.nome}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duração:</span>
                    <span className="font-medium">{formatarTempo(tempoSelecionado)}</span>
                  </div>
                  {temaSelecionado && (
                    <div className="flex justify-between">
                      <span>Tema:</span>
                      <span className="font-medium">
                        {temasConsulta.find(t => t.id === temaSelecionado)?.nome}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-purple-500/30 pt-3 mt-3">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Custo:</span>
                      <span className="text-yellow-400">{formatarTempo(tempoSelecionado)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Validação de Créditos */}
              <div className={`p-4 rounded-xl mb-6 ${
                validacao.suficiente 
                  ? 'bg-green-900/20 border border-green-500/30' 
                  : 'bg-red-900/20 border border-red-500/30'
              }`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={validacao.suficiente ? 'text-green-300' : 'text-red-300'}>
                      Seus créditos: {formatarTempo(creditosDisponiveis)}
                    </p>
                    <p className="text-sm text-gray-400">
                      {validacao.mensagem}
                    </p>
                  </div>
                  <div className={`text-2xl ${validacao.suficiente ? 'text-green-400' : 'text-red-400'}`}>
                    {validacao.suficiente ? '✅' : '❌'}
                  </div>
                </div>
                
                {!validacao.suficiente && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setEtapa('detalhes')}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Ajustar Consulta
                    </button>
                    <button
                      onClick={handleComprarCreditos}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Comprar Créditos
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Saldo de Créditos - Sempre visível exceto na tela sem créditos */}
          {etapa !== 'sem-creditos' && (
            <div className="bg-black/40 rounded-xl p-4 mb-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <span className="text-purple-300">Seus créditos:</span>
                <span className="text-yellow-400 font-bold">
                  {formatarTempo(creditosDisponiveis)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-purple-500/30">
          <div className="flex gap-4">
            {etapa === 'sem-creditos' ? (
              <button
                onClick={onClose}
                className="w-full py-3 px-6 bg-gray-600/50 hover:bg-gray-600/70 text-white font-medium rounded-xl transition-all duration-300"
              >
                Fechar
              </button>
            ) : (
              <>
                {etapa !== 'profissional' && (
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
                    disabled={etapa === 'profissional' && !profissionalSelecionado}
                    className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-300"
                  >
                    Continuar →
                  </button>
                ) : (
                  <button
                    onClick={handleSolicitarConsulta}
                    disabled={!validacao.suficiente || processando}
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