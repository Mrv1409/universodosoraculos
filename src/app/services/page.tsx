/* eslint-disable @typescript-eslint/no-unused-vars */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getPlanosEspecificos, getPlanosGerais } from '@/data/pacotes-creditos';

export default function ServicesPage() {
  // Partículas flutuantes (mesmo padrão das outras páginas)
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: fixed;
        width: 3px;
        height: 3px;
        background: rgba(147, 112, 219, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}vw;
        animation: float ${8 + Math.random() * 10}s linear infinite;
      `;
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 18000);
    };

    const interval = setInterval(createParticle, 300);
    return () => clearInterval(interval);
  }, []);

  // Dados atualizados dos profissionais (4 reais + 1 fake)
  const profissionaisDestaque = [
    { nome: 'Cigana Aurora', especialidade: 'Tarot Cigano', icone: '💕', destaque: 'Especialista em Amor' },
    { nome: 'Cigana Mary', especialidade: 'Baralho Cigano', icone: '🚀', destaque: 'Expert em Carreira' },
    { nome: 'Cigana Jade', especialidade: 'Cristalomancia', icone: '🌙', destaque: 'Mestra Espiritual' },
    { nome: 'Cigana Mel', especialidade: 'Numerologia', icone: '✨', destaque: 'Vidente Premium' },
    { nome: 'Cigana Esperança', especialidade: 'Runas & Tarô', icone: '🔮', destaque: 'Consultora Top' }
  ];

  const modalidadesConsulta = [
    {
      id: 'whatsapp',
      titulo: 'Consulta via WhatsApp',
      descricao: 'Atendimento personalizado direto no seu celular',
      icone: '📱',
      detalhes: [
        'Conversa privada com especialista',
        'Respostas em tempo real',
        'Conforto da sua casa',
        'Horários flexíveis'
      ]
    },
    {
      id: 'especifica',
      titulo: 'Planos Específicos',
      descricao: 'Consultas temáticas com tempo ilimitado',
      icone: '🔮',
      detalhes: [
        'Tempo ilimitado',
        'Análise especializada',
        'Relatório detalhado',
        'Preço fixo por tema'
      ]
    },
    {
      id: 'geral',
      titulo: 'Consulta Geral',
      descricao: 'Flexibilidade total por minutagem',
      icone: '⏱️',
      detalhes: [
        'Qualquer tema',
        'Pague só o que usar',
        'Tempo flexível',
        'R$ 2,60 por minuto'
      ]
    }
  ];

  const processoSteps = [
    {
      numero: '1',
      titulo: 'Escolha seu Plano',
      descricao: 'Selecione entre planos específicos ou créditos gerais',
      icone: '💰'
    },
    {
      numero: '2', 
      titulo: 'Selecione o Especialista',
      descricao: 'Escolha entre nossos 4 profissionais qualificados',
      icone: '👥'
    },
    {
      numero: '3',
      titulo: 'Inicie sua Consulta',
      descricao: 'Conecte-se via WhatsApp e receba orientação',
      icone: '🔮'
    }
  ];

  // Carregar planos atualizados
  const planosEspecificos = getPlanosEspecificos();
  const planosGerais = getPlanosGerais();

  return (
    <>
      {/* CSS Global (mesmo padrão das outras páginas) */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.8;
          }
          90% {
            opacity: 0.8;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% 0;
          }
          100% {
            background-position: 200% 0;
          }
        }

        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          animation: cardFloat 3s ease-in-out infinite;
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #8A2BE2, #9370DB, #6A5ACD, #483D8B);
          background-size: 300% 300%;
          animation: shimmer 8s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        @media (max-width: 768px) {
          .mobile-optimized {
            padding: 1rem;
          }
          
          .mobile-text {
            font-size: 1.5rem;
          }
          
          .mobile-grid {
            grid-template-columns: 1fr;
            gap: 1rem;
          }
        }
      `}</style>

      {/* Background Refinado */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-purple-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,112,219,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(106,90,205,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-6 md:py-12 min-h-screen mobile-optimized">
        
        {/* Hero Section Refinada */}
        <div className="text-center mb-12 md:mb-20 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
              <span className="text-6xl md:text-8xl block mb-4 animate-bounce">🌟</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 gradient-text mobile-text">
              Nossos Serviços
            </h1>
            
            <p className="text-lg md:text-xl text-purple-200/90 mb-6 md:mb-8 font-light max-w-3xl mx-auto leading-relaxed">
              Conecte-se com a sabedoria ancestral através de consultas personalizadas
            </p>
            
            <div className="flex justify-center space-x-4 md:space-x-8 text-purple-300">
              {['✨', '🌙', '⭐', '🔯'].map((symbol, i) => (
                <span key={i} className="text-2xl md:text-3xl animate-pulse" style={{animationDelay: `${i * 0.5}s`}}>
                  {symbol}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tipos de Planos Atualizados */}
        <div className="max-w-6xl mx-auto mb-12 md:mb-20">
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
            <h2 className="text-2xl md:text-4xl font-bold text-center gradient-text mb-8 md:mb-12">
              Tipos de Consulta
            </h2>
            
            {/* Planos Específicos */}
            <div className="mb-12">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-3xl mr-3">🔮</span>
                Planos Específicos (Tempo Ilimitado)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {planosEspecificos.map((plano, index) => (
                  <div
                    key={plano.id}
                    className="card-hover bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-white text-base md:text-lg">{plano.nome}</h4>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-lg">{plano.precoFormatado}</div>
                        <div className="text-green-400 text-xs font-medium">ILIMITADO</div>
                      </div>
                    </div>
                    <p className="text-purple-200/80 text-sm leading-relaxed">{plano.descricao}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Planos Gerais */}
            <div>
              <h3 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center">
                <span className="text-3xl mr-3">⏱️</span>
                Consultas Gerais (Por Minutagem)
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {planosGerais.map((plano, index) => (
                  <div
                    key={plano.id}
                    className={`card-hover bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border transition-all duration-300 transform hover:scale-105 ${
                      plano.popular 
                        ? 'border-yellow-400/50 bg-gradient-to-br from-yellow-500/10 to-amber-500/10' 
                        : 'border-blue-500/30 hover:border-blue-400/50'
                    }`}
                  >
                    {plano.popular && (
                      <div className="text-center mb-3">
                        <span className="bg-yellow-500 text-black text-xs px-3 py-1 rounded-full font-bold">
                          MAIS POPULAR
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-white text-base md:text-lg">{plano.nome}</h4>
                      <div className="text-right">
                        <div className="text-yellow-400 font-bold text-lg">{plano.precoFormatado}</div>
                        <div className="text-blue-400 text-xs font-medium">{plano.creditos} minutos</div>
                      </div>
                    </div>
                    <p className="text-purple-200/80 text-sm leading-relaxed">{plano.descricao}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Modalidades de Atendimento */}
        <div className="max-w-6xl mx-auto mb-12 md:mb-20">
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
            <h2 className="text-2xl md:text-4xl font-bold text-center gradient-text mb-8 md:mb-12">
              Como Atendemos Você
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {modalidadesConsulta.map((modalidade) => (
                <div
                  key={modalidade.id}
                  className="card-hover bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105"
                >
                  <div className="text-center mb-6">
                    <div className="text-5xl md:text-6xl mb-4">{modalidade.icone}</div>
                    <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{modalidade.titulo}</h3>
                    <p className="text-purple-200/80 text-base md:text-lg">{modalidade.descricao}</p>
                  </div>

                  <div className="space-y-3">
                    {modalidade.detalhes.map((detalhe, index) => (
                      <div key={index} className="flex items-center text-purple-300">
                        <span className="text-green-400 mr-3 text-lg">✓</span>
                        <span className="text-sm md:text-base">{detalhe}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Como Funciona */}
        <div className="max-w-6xl mx-auto mb-12 md:mb-20">
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
            <h2 className="text-2xl md:text-4xl font-bold text-center gradient-text mb-8 md:mb-12">
              Como Funciona
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {processoSteps.map((step, index) => (
                <div key={step.numero} className="text-center relative">
                  {/* Linha conectora */}
                  {index < processoSteps.length - 1 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent transform translate-x-8 z-0"></div>
                  )}
                  
                  <div className="relative z-10 card-hover bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold text-white mx-auto mb-4 md:mb-6">
                      {step.numero}
                    </div>
                    
                    <div className="text-4xl md:text-5xl mb-4">{step.icone}</div>
                    <h3 className="text-lg md:text-xl font-bold text-white mb-4">{step.titulo}</h3>
                    <p className="text-purple-200/80 text-sm md:text-base">{step.descricao}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* TOP 5 Profissionais Destaque */}
        <div className="max-w-6xl mx-auto mb-12 md:mb-20">
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
            <div className="text-center mb-8 md:mb-12">
              <div className="flex justify-center items-center mb-4">
                <span className="text-4xl md:text-5xl mr-3">🏆</span>
                <h2 className="text-2xl md:text-4xl font-bold gradient-text">TOP 5 do Mês</h2>
                <span className="text-4xl md:text-5xl ml-3">🏆</span>
              </div>
              <p className="text-lg md:text-xl text-purple-200/90">
                Nossos tarólogos mais procurados e bem avaliados
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6 mb-8 md:mb-12">
              {profissionaisDestaque.map((prof, index) => (
                <div key={index} className="text-center relative">
                  <div className="card-hover bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 transform hover:scale-105">
                    {/* Badge de posição */}
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-black font-bold text-sm">
                      {index + 1}
                    </div>
                    
                    <div className="text-3xl md:text-4xl mb-3">{prof.icone}</div>
                    <h4 className="font-bold text-white mb-2 text-sm md:text-base">{prof.nome}</h4>
                    <p className="text-purple-300 text-xs md:text-sm mb-2">{prof.especialidade}</p>
                    <div className="text-yellow-400 text-xs font-medium">{prof.destaque}</div>
                    
                    {/* Estrelas de avaliação */}
                    <div className="flex justify-center mt-2 text-yellow-400">
                      {'⭐'.repeat(5)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/profissionais"
                className="card-hover inline-flex items-center px-6 md:px-8 py-3 md:py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                <span className="text-xl mr-2">👥</span>
                Ver Todos os Profissionais
              </Link>
            </div>
          </div>
        </div>

        {/* Call-to-Action Final */}
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-8 md:p-12 border border-purple-500/30 shadow-xl">
            <h2 className="text-2xl md:text-4xl font-bold gradient-text mb-4 md:mb-6">
              Pronto para Descobrir seu Destino?
            </h2>
            <p className="text-base md:text-xl text-purple-200/90 mb-6 md:mb-8 leading-relaxed">
              Nossos especialistas estão aguardando para oferecer orientação personalizada. 
              Escolha entre planos específicos ou créditos gerais.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
              <Link
                href="/creditos"
                className="card-hover w-full sm:w-auto inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-lg md:text-xl rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="mr-2">💰</span>
                Ver Todos os Planos
              </Link>
              
              <Link
                href="/dashboard"
                className="card-hover w-full sm:w-auto inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg md:text-xl rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-purple-400/30"
              >
                <span className="mr-2">🔮</span>
                Solicitar Consulta
              </Link>
            </div>
            
            <p className="text-purple-300 text-sm md:text-base">
              Pagamento seguro via cartão ou PIX
            </p>
          </div>
        </div>
      </div>
    </>
  );
}