'use client';

import { useState, useEffect } from 'react';
import { cartasTarot } from '@/data/tarot-cards';
import { CartaTarot } from '@/types';

type Tema = 'amor' | 'projetos' | 'karmas' | 'dinheiro' | 'vida';

export default function Home() {
  const [etapa, setEtapa] = useState<'tema' | 'embaralhando' | 'escolhendo' | 'revelando'>('tema');
  const [temaSelecionado, setTemaSelecionado] = useState<Tema | null>(null);
  const [cartasEscolhidas, setCartasEscolhidas] = useState<CartaTarot[]>([]);
  const [cartasEmbaralhadas, setCartasEmbaralhadas] = useState<CartaTarot[]>([]);
  const [cartasSelecionadasIndices, setCartasSelecionadasIndices] = useState<number[]>([]);

  const temas = [
    { id: 'amor' as Tema, nome: '❤️ Amor e Relacionamentos', cor: 'from-pink-500 to-rose-600', icon: '💕' },
    { id: 'projetos' as Tema, nome: '💼 Projetos e Carreira', cor: 'from-blue-500 to-indigo-600', icon: '🚀' },
    { id: 'karmas' as Tema, nome: '🔮 Karmas e Espiritualidade', cor: 'from-purple-500 to-violet-600', icon: '✨' },
    { id: 'dinheiro' as Tema, nome: '💰 Dinheiro e Prosperidade', cor: 'from-green-500 to-emerald-600', icon: '💎' },
    { id: 'vida' as Tema, nome: '🌟 Vida Pessoal', cor: 'from-yellow-500 to-orange-600', icon: '🌙' }
  ];

  const selecionarTema = (tema: Tema) => {
    setTemaSelecionado(tema);
    setEtapa('embaralhando');
    
    // Simular embaralhamento
    setTimeout(() => {
      const embaralhadas = [...cartasTarot].sort(() => Math.random() - 0.5);
      setCartasEmbaralhadas(embaralhadas);
      setEtapa('escolhendo');
    }, 2000);
  };

  const escolherCarta = (index: number) => {
    if (cartasSelecionadasIndices.includes(index) || cartasSelecionadasIndices.length >= 3) return;
    
    const novosIndices = [...cartasSelecionadasIndices, index];
    setCartasSelecionadasIndices(novosIndices);
    
    const novasCartasEscolhidas = [...cartasEscolhidas, cartasEmbaralhadas[index]];
    setCartasEscolhidas(novasCartasEscolhidas);
    
    if (novosIndices.length === 3) {
      setTimeout(() => {
        setEtapa('revelando');
      }, 500);
    }
  };

  const reiniciar = () => {
    setEtapa('tema');
    setTemaSelecionado(null);
    setCartasEscolhidas([]);
    setCartasEmbaralhadas([]);
    setCartasSelecionadasIndices([]);
  };

  // Partículas flutuantes
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      particle.style.cssText = `
        position: fixed;
        width: 4px;
        height: 4px;
        background: rgba(173, 216, 230, 0.6);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        left: ${Math.random() * 100}vw;
        animation: float ${5 + Math.random() * 10}s linear infinite;
      `;
      document.body.appendChild(particle);
      
      setTimeout(() => {
        particle.remove();
      }, 15000);
    };

    const interval = setInterval(createParticle, 200);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* CSS para animações */}
      <style jsx global>{`
        @keyframes float {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(138, 43, 226, 0.5);
          }
          50% {
            box-shadow: 0 0 40px rgba(138, 43, 226, 0.8), 0 0 60px rgba(138, 43, 226, 0.4);
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
        
        @keyframes cardFloat {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-10px) rotate(2deg);
          }
        }

        .card-hover {
          transition: all 0.3s ease;
        }
        
        .card-hover:hover {
          animation: cardFloat 2s ease-in-out infinite;
          box-shadow: 0 20px 40px rgba(138, 43, 226, 0.4);
        }
        
        .gradient-text {
          background: linear-gradient(45deg, #8A2BE2, #9370DB, #BA55D3, #DDA0DD);
          background-size: 300% 300%;
          animation: shimmer 5s ease-in-out infinite;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .magical-border {
          position: relative;
          overflow: hidden;
        }
        
        .magical-border::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #8A2BE2, #9370DB, #BA55D3, #DDA0DD);
          background-size: 400% 400%;
          border-radius: inherit;
          z-index: -1;
          animation: shimmer 5s ease infinite;
        }
      `}</style>

      {/* Background Impactante */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-900 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-purple-900/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,43,226,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,112,219,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(186,85,211,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(221,160,221,0.2),transparent_50%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-8 min-h-screen">
        {/* Hero Section Impactante */}
        <div className="text-center mb-16 relative">
          {/* Aura mágica */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
              <span className="text-8xl block mb-4 animate-bounce">🔮</span>
            </div>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-6 gradient-text">
              Universo dos Oráculos
            </h1>
            
            <p className="text-xl md:text-2xl text-purple-200 mb-8 font-light max-w-3xl mx-auto leading-relaxed">
              Conecte-se com as energias místicas e desvende os segredos do seu destino através das cartas sagradas
            </p>
            
            <div className="flex justify-center space-x-8 text-purple-300">
              {['✨', '🌙', '⭐', '🔯', '💫'].map((symbol, i) => (
                <span key={i} className="text-3xl animate-pulse" style={{animationDelay: `${i * 0.5}s`}}>
                  {symbol}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Leitura Gratuita - Design Mágico */}
        <div className="max-w-6xl mx-auto magical-border bg-black/30 backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-500/30 shadow-2xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              ✨ Leitura Gratuita de 3 Cartas ✨
            </h2>
            <p className="text-purple-200 text-lg">
              Descubra o que o universo tem a revelar sobre seu futuro
            </p>
          </div>

          {/* Etapa 1: Seleção de Tema */}
          {etapa === 'tema' && (
            <div className="text-center">
              <h3 className="text-3xl text-white mb-8 font-semibold">
                Escolha o tema para sua consulta mística:
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {temas.map((tema) => (
                  <button
                    key={tema.id}
                    onClick={() => selecionarTema(tema.id)}
                    className={`card-hover group relative bg-gradient-to-br ${tema.cor} text-white font-semibold py-6 px-6 rounded-2xl transition-all transform hover:scale-110 hover:-translate-y-2 shadow-lg hover:shadow-2xl border border-white/20`}
                  >
                    <div className="absolute inset-0 bg-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-4xl mb-3">{tema.icon}</div>
                      <div className="text-lg font-bold">{tema.nome}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Etapa 2: Embaralhamento */}
          {etapa === 'embaralhando' && (
            <div className="text-center">
              <h3 className="text-3xl text-white mb-8 font-semibold">
                As cartas estão dançando no cosmos... 🌌
              </h3>
              <div className="flex justify-center space-x-4 mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-20 h-32 bg-gradient-to-br from-purple-600 to-indigo-700 rounded-xl shadow-lg transform transition-all duration-500 card-hover border border-purple-400/30"
                    style={{ 
                      animationDelay: `${i * 0.2}s`,
                      transform: `rotate(${Math.sin(Date.now() / 1000 + i) * 10}deg) translateY(${Math.sin(Date.now() / 800 + i) * 5}px)`
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-yellow-400/20 to-transparent rounded-xl flex items-center justify-center text-2xl">
                      🂠
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-black/40 rounded-2xl p-6 max-w-md mx-auto border border-purple-500/30">
                <p className="text-purple-200 text-lg">
                  Concentre-se profundamente em sua pergunta sobre{' '}
                  <span className="text-yellow-300 font-bold text-xl">
                    {temas.find(t => t.id === temaSelecionado)?.nome}
                  </span>
                </p>
                <p className="text-purple-300 text-sm mt-3">
                  As energias estão se alinhando...
                </p>
              </div>
            </div>
          )}

          {/* Etapa 3: Escolha das Cartas */}
          {etapa === 'escolhendo' && (
            <div className="text-center">
              <h3 className="text-2xl text-text mb-6">
                Escolha 3 cartas ({cartasSelecionadasIndices.length}/3)
              </h3>
    
              {/* Layout em leque sobrepostas */}
              <div className="relative max-w-4xl mx-auto mb-6 h-32 flex items-center justify-center">
                {cartasEmbaralhadas.slice(0, 22).map((carta, index) => (
                  <button
                    key={index}
                    onClick={() => escolherCarta(index)}
                    disabled={cartasSelecionadasIndices.includes(index)}
                    className={`absolute w-16 h-24 rounded-lg transition-all transform hover:scale-110 hover:z-10 ${
                    cartasSelecionadasIndices.includes(index)
                      ? 'bg-accent scale-110 z-20 shadow-lg shadow-accent/50'
                      : 'bg-purple-700 hover:bg-yellow-600 shadow-md'
                    }`}
                    style={{
                      left: `${10 + index * 4.0}%`,
                      transform: `translateX(-50%) rotate(${(index - 10) * 2}deg)`,
                      zIndex: cartasSelecionadasIndices.includes(index) ? 22 : 10 - Math.abs(index - 10)
                    }}
                  >
                    <div className="text-lg">
                      {cartasSelecionadasIndices.includes(index) ? '✨' : '🂠'}
                    </div>
                  </button>
                ))}
              </div>
    
              <p className="text-text/60 text-sm">
                Concentre-se em sua pergunta e escolha 3 cartas que mais chamam sua atenção
              </p>
            </div>
    
          )}
    
              
      

          {/* Etapa 4: Revelação Mágica */}
          {etapa === 'revelando' && cartasEscolhidas.length === 3 && (
            <div className="text-center">
              <h3 className="text-4xl text-white mb-8 font-bold gradient-text">
                O Universo Revelou Seus Segredos! 🌟
              </h3>
              
              {/* Cartas Reveladas com Visual Mágico */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
                {cartasEscolhidas.map((carta, index) => (
                  <div 
                    key={carta.id} 
                    className="magical-border bg-black/50 backdrop-blur-xl rounded-2xl p-6 transform hover:scale-105 transition-all duration-500 card-hover border border-purple-400/30"
                    style={{animationDelay: `${index * 0.2}s`}}
                  >
                    <div className="text-6xl mb-6 transform hover:scale-110 transition-transform duration-300">
                      {carta.imagemUrl}
                    </div>
                    <h4 className="text-2xl font-bold text-yellow-300 mb-4">{carta.nome}</h4>
                    <p className="text-purple-200 text-base mb-6 italic">{carta.descricao}</p>
                    <div className="bg-gradient-to-br from-purple-900/80 to-indigo-900/80 rounded-xl p-6 border border-purple-400/30">
                      <h5 className="text-yellow-300 font-semibold mb-3 text-lg">
                        Mensagem do Oráculo:
                      </h5>
                      <p className="text-white leading-relaxed text-base">
                        {carta.interpretacoes[temaSelecionado!]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Botões de Ação Mágicos */}
              <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                <button
                  onClick={reiniciar}
                  className="group px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border border-purple-400/30"
                >
                  <span className="flex items-center">
                    🔄 <span className="ml-2">Nova Consulta Gratuita</span>
                  </span>
                </button>
                
                <button className="group px-8 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl border border-yellow-400/50">
                  <span className="flex items-center">
                    💫 <span className="ml-2">Consulta Completa com Especialista</span>
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Call to Action Final */}
        {etapa === 'tema' && (
          <div className="mt-20 text-center">
            <div className="max-w-4xl mx-auto bg-gradient-to-br from-purple-900/50 to-indigo-900/50 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30">
              <h2 className="text-4xl font-bold gradient-text mb-6">
                Pronto para uma Experiência Única?
              </h2>
              <p className="text-xl text-purple-200 mb-8 leading-relaxed">
                Nossos especialistas estão aguardando para oferecer consultas personalizadas via WhatsApp. 
                Descoberta, clareza e orientação espiritual ao seu alcance.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-400/30 card-hover">
                  <div className="text-4xl mb-4">🔮</div>
                  <h3 className="text-xl font-bold text-yellow-300 mb-3">Consulta Personalizada</h3>
                  <p className="text-purple-200">
                    Atendimento individual com tarólogo especializado via WhatsApp
                  </p>
                </div>
                
                <div className="bg-black/30 rounded-2xl p-6 border border-purple-400/30 card-hover">
                  <div className="text-4xl mb-4">⏰</div>
                  <h3 className="text-xl font-bold text-yellow-300 mb-3">Flexibilidade Total</h3>
                  <p className="text-purple-200">
                    Sistema de créditos por tempo. Pague apenas pelo que usar.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}