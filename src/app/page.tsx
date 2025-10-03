'use client';

import { useState, useEffect } from 'react';
import { cartasTarot } from '@/data/tarot-cards';
import { CartaTarot } from '@/types';
import { signosData, type Signo } from '@/data/signos-data';
import Link from 'next/link';

type Tema = 'amor' | 'projetos' | 'karmas' | 'dinheiro' | 'vida';

// TIPOS PARA NUMEROLOGIA
type NumeroCaminhoVida = {
  numero: number;
  titulo: string;
  descricao: string;
  caracteristicas: string[];
};

export default function Home() {
  const [etapa, setEtapa] = useState<'tema' | 'embaralhando' | 'escolhendo' | 'revelando'>('tema');
  const [temaSelecionado, setTemaSelecionado] = useState<Tema | null>(null);
  const [cartasEscolhidas, setCartasEscolhidas] = useState<CartaTarot[]>([]);
  const [cartasEmbaralhadas, setCartasEmbaralhadas] = useState<CartaTarot[]>([]);
  const [cartasSelecionadasIndices, setCartasSelecionadasIndices] = useState<number[]>([]);
  
  // ESTADOS PARA NUMEROLOGIA
  const [dataNascimento, setDataNascimento] = useState('');
  const [numeroCalculado, setNumeroCalculado] = useState<NumeroCaminhoVida | null>(null);
  
  // ESTADOS PARA SIGNOS
  const [signoSelecionado, setSignoSelecionado] = useState<Signo | null>(null);
  const [mostrarTodosSignos, setMostrarTodosSignos] = useState(false);

  // PALETA REFINADA - Roxo Azulado Profissional
  const temas = [
    { 
      id: 'amor' as Tema, 
      nome: '❤️ Amor e Relacionamentos', 
      cor: 'from-rose-500/20 to-pink-600/20',
      borda: 'border-rose-400/30',
      icon: '💕' 
    },
    { 
      id: 'projetos' as Tema, 
      nome: '💼 Carreira e Projetos', 
      cor: 'from-blue-500/20 to-indigo-600/20',
      borda: 'border-blue-400/30',
      icon: '🚀' 
    },
    { 
      id: 'karmas' as Tema, 
      nome: '🔮 Espiritualidade', 
      cor: 'from-purple-500/20 to-violet-600/20',
      borda: 'border-purple-400/30',
      icon: '✨' 
    },
    { 
      id: 'dinheiro' as Tema, 
      nome: '💰 Prosperidade', 
      cor: 'from-emerald-500/20 to-green-600/20',
      borda: 'border-emerald-400/30',
      icon: '💎' 
    },
    { 
      id: 'vida' as Tema, 
      nome: '🌟 Vida Pessoal', 
      cor: 'from-amber-500/20 to-orange-600/20',
      borda: 'border-amber-400/30',
      icon: '🌙' 
    }
  ];

  // DADOS DA NUMEROLOGIA
  const numerosCaminhoVida: NumeroCaminhoVida[] = [
    {
      numero: 1,
      titulo: 'O Líder',
      descricao: 'Pioneirismo, independência e criatividade. Sua vida é sobre aprender a liderar e confiar em sua própria iniciativa.',
      caracteristicas: ['Ambição', 'Determinação', 'Inovação']
    },
    {
      numero: 2,
      titulo: 'O Diplomata',
      descricao: 'Cooperação, paz e harmonia. Sua vida é sobre construir pontes e trabalhar em equipe.',
      caracteristicas: ['Sensibilidade', 'Intuição', 'Mediação']
    },
    {
      numero: 3,
      titulo: 'O Comunicador',
      descricao: 'Expressão, alegria e otimismo. Sua vida é sobre espalhar criatividade e se conectar com os outros.',
      caracteristicas: ['Carisma', 'Talento', 'Socialização']
    },
    {
      numero: 4,
      titulo: 'O Construtor',
      descricao: 'Estabilidade, trabalho e ordem. Sua vida é sobre criar bases sólidas e seguras.',
      caracteristicas: ['Praticidade', 'Lealdade', 'Confiabilidade']
    },
    {
      numero: 5,
      titulo: 'O Livre Espírito',
      descricao: 'Liberdade, mudança e aventura. Sua vida é sobre experimentar a variedade do mundo.',
      caracteristicas: ['Curiosidade', 'Versatilidade', 'Adaptabilidade']
    },
    {
      numero: 6,
      titulo: 'O Cuidador',
      descricao: 'Amor, responsabilidade e cura. Sua vida é sobre cuidar da família e comunidade.',
      caracteristicas: ['Compaixão', 'Responsabilidade', 'Aconselhamento']
    },
    {
      numero: 7,
      titulo: 'O Filósofo',
      descricao: 'Introspecção, sabedoria e espiritualidade. Sua vida é uma busca pela verdade.',
      caracteristicas: ['Análise', 'Intuição', 'Sabedoria']
    },
    {
      numero: 8,
      titulo: 'O Executivo',
      descricao: 'Poder, abundância e realização material. Sua vida é sobre usar o poder com sabedoria.',
      caracteristicas: ['Ambição', 'Foco', 'Liderança']
    },
    {
      numero: 9,
      titulo: 'O Humanitário',
      descricao: 'Compaixão, conclusões e serviço ao mundo. Sua vida é sobre amor incondicional.',
      caracteristicas: ['Generosidade', 'Sabedoria', 'Artes']
    }
  ];

  // FUNÇÃO PARA CALCULAR NUMEROLOGIA
  const calcularNumerologia = (data: string) => {
    const numeros = data.replace(/\D/g, '');
    
    if (numeros.length !== 8) return null;

    let soma = numeros.split('').reduce((acc, num) => acc + parseInt(num), 0);
    
    while (soma > 9 && soma !== 11 && soma !== 22 && soma !== 33) {
      soma = soma.toString().split('').reduce((acc, num) => acc + parseInt(num), 0);
    }

    return numerosCaminhoVida.find(item => item.numero === soma) || null;
  };

  const handleCalcularNumerologia = () => {
    const resultado = calcularNumerologia(dataNascimento);
    setNumeroCalculado(resultado);
  };

  // FUNÇÃO PARA OBTER NOME DO ELEMENTO
  const getElementoNome = (elemento: string) => {
    const elementos: { [key: string]: string } = {
      'fogo': '🔥 Fogo',
      'terra': '🌿 Terra', 
      'ar': '💨 Ar',
      'agua': '💧 Água'
    };
    return elementos[elemento] || elemento;
  };

  const selecionarTema = (tema: Tema) => {
    setTemaSelecionado(tema);
    setEtapa('embaralhando');
    
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
      setTimeout(() => setEtapa('revelando'), 500);
    }
  };

  const reiniciar = () => {
    setEtapa('tema');
    setTemaSelecionado(null);
    setCartasEscolhidas([]);
    setCartasEmbaralhadas([]);
    setCartasSelecionadasIndices([]);
  };

  // Partículas mantidas (cores refinadas)
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

  return (
    <>
      {/* CSS GLOBAL REFINADO - MANTIDO ORIGINAL */}
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
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(147, 112, 219, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(147, 112, 219, 0.5);
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
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
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
        
        .magical-border {
          position: relative;
          border: 1px solid rgba(147, 112, 219, 0.3);
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

      {/* BACKGROUND REFINADO - MANTIDO ORIGINAL */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-purple-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,112,219,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(106,90,205,0.1),transparent_50%)]"></div>
      </div>

      {/* CONTEÚDO PRINCIPAL - MOBILE FIRST */}
      <div className="relative container mx-auto px-4 py-6 md:py-12 min-h-screen mobile-optimized">
        
        {/* HERO SECTION - RESPONSIVA */}
        <div className="text-center mb-8 md:mb-16 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-64 h-64 md:w-96 md:h-96 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-full blur-2xl animate-pulse"></div>
          </div>
          
          <div className="relative z-10">
            <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
              <span className="text-6xl md:text-8xl block mb-4 animate-bounce">🔮</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 gradient-text mobile-text">
              Universo dos Oráculos
            </h1>
            
            <p className="text-lg md:text-xl text-purple-200/90 mb-6 md:mb-8 font-light max-w-3xl mx-auto leading-relaxed">
              Conecte-se com as energias místicas e desvende os segredos do seu destino
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

        {/* SEÇÃO NUMEROLOGIA - MANTIDA */}
        <div className="max-w-4xl mx-auto mb-12 md:mb-16">
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-3">
                🔢 Descubra seu Número do Caminho de Vida
              </h2>
              <p className="text-purple-200/80 text-sm md:text-base">
                Seu número revela sua missão de vida e talentos naturais
              </p>
            </div>

            {!numeroCalculado ? (
              <div className="space-y-4">
                <div className="flex flex-col md:flex-row gap-4 items-center justify-center">
                  <input
                    type="text"
                    placeholder="DD/MM/AAAA (ex: 25/09/1985)"
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    className="w-full md:w-80 px-4 py-3 bg-slate-700/50 border border-purple-400/30 rounded-lg text-white placeholder-purple-300/60 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                  />
                  <button
                    onClick={handleCalcularNumerologia}
                    disabled={!dataNascimento}
                    className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border border-purple-400/30"
                  >
                    Calcular Meu Número
                  </button>
                </div>
                <p className="text-purple-300/70 text-xs text-center">
                  ✨ Insira sua data de nascimento para descobrir seu caminho
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 md:p-8 border border-purple-400/30 mb-6">
                  <div className="text-4xl md:text-5xl font-bold text-yellow-300 mb-2">
                    {numeroCalculado.numero}
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-2">
                    {numeroCalculado.titulo}
                  </h3>
                  <p className="text-purple-200/90 mb-4 text-sm md:text-base">
                    {numeroCalculado.descricao}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-4">
                    {numeroCalculado.caracteristicas.map((caract, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-200 text-xs md:text-sm"
                      >
                        {caract}
                      </span>
                    ))}
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setNumeroCalculado(null);
                    setDataNascimento('');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300 border border-purple-400/30"
                >
                  🔄 Calcular Novamente
                </button>
              </div>
            )}
          </div>
        </div>

        {/* SEÇÃO SIGNOS - NOVA ADIÇÃO */}
        <div className="max-w-6xl mx-auto mb-12 md:mb-16">
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
            <div className="text-center mb-6">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-3">
                ♈ Previsão Astral dos Signos
              </h2>
              <p className="text-purple-200/80 text-sm md:text-base">
                Descubra as energias cósmicas que influenciam seu dia
              </p>
            </div>

            {!signoSelecionado ? (
              <div className="space-y-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-4">
                  {signosData.slice(0, mostrarTodosSignos ? 12 : 6).map((signo) => (
                    <button
                      key={signo.id}
                      onClick={() => setSignoSelecionado(signo)}
                      className={`card-hover group relative bg-gradient-to-br ${signo.corElemento} text-white font-semibold py-4 px-3 rounded-xl transition-all duration-300 transform hover:scale-105 border-2 border-purple-400/30 hover:border-white/40 shadow-lg`}
                    >
                      <div className="absolute inset-0 bg-white/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative z-10">
                        <div className="text-2xl md:text-3xl mb-1">{signo.emoji}</div>
                        <div className="text-xs md:text-sm font-medium">{signo.nome}</div>
                        <div className="text-xs text-purple-200/70 mt-1">
                          {signo.dataInicio} - {signo.dataFim}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>

                {!mostrarTodosSignos && (
                  <div className="text-center">
                    <button
                      onClick={() => setMostrarTodosSignos(true)}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600/50 to-blue-600/50 text-white font-medium rounded-lg hover:scale-105 transition-transform duration-300 border border-purple-400/30"
                    >
                      ↓ Ver Todos os Signos
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-2xl p-6 md:p-8 border border-purple-400/30 mb-6">
                  <div className="flex items-center justify-center mb-4">
                    <span className="text-4xl md:text-5xl mr-4">{signoSelecionado.emoji}</span>
                    <div className="text-left">
                      <h3 className="text-2xl md:text-3xl font-bold text-white">{signoSelecionado.nome}</h3>
                      <p className="text-purple-200/80 text-sm">
                        {signoSelecionado.dataInicio} - {signoSelecionado.dataFim}
                      </p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <span className="px-3 py-1 bg-purple-500/30 border border-purple-400/50 rounded-full text-purple-200 text-sm">
                      {getElementoNome(signoSelecionado.elemento)}
                    </span>
                  </div>

                  <div className="bg-slate-700/40 rounded-xl p-4 md:p-6 mb-4 border border-purple-400/20">
                    <h4 className="text-lg md:text-xl font-bold text-yellow-300 mb-3">✨ Previsão do Dia</h4>
                    <p className="text-white text-sm md:text-base leading-relaxed">
                      {signoSelecionado.previsao}
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-2">
                    {signoSelecionado.caracteristicas.map((caract, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 border border-purple-400/30 rounded-full text-purple-200 text-xs md:text-sm"
                      >
                        {caract}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => setSignoSelecionado(null)}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300 border border-purple-400/30"
                  >
                    ← Voltar aos Signos
                  </button>
                  <button
                    onClick={() => {
                      setSignoSelecionado(null);
                      setMostrarTodosSignos(true);
                    }}
                    className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-300 border border-amber-400/30"
                  >
                    🔍 Ver Outro Signo
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* LEITURA GRATUITA - LAYOUT RESPONSIVO (ORIGINAL) */}
        <div className="max-w-6xl mx-auto bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold gradient-text mb-3 md:mb-4">
              ✨ Leitura Gratuita de 3 Cartas ✨
            </h2>
            <p className="text-purple-200/80 text-sm md:text-base">
              Descubra o que o universo tem a revelar sobre seu futuro
            </p>
          </div>

          {/* ETAPA 1: SELEÇÃO DE TEMA - GRID RESPONSIVO */}
          {etapa === 'tema' && (
            <div className="text-center">
              <h3 className="text-xl md:text-2xl text-white mb-6 md:mb-8 font-medium">
                Escolha o tema para sua consulta:
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto">
                {temas.map((tema) => (
                  <button
                    key={tema.id}
                    onClick={() => selecionarTema(tema.id)}
                    className={`card-hover group relative bg-gradient-to-br ${tema.cor} text-white font-semibold py-4 md:py-6 px-4 rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 border-2 ${tema.borda} hover:border-white/40 shadow-lg`}
                  >
                    <div className="absolute inset-0 bg-white/5 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10">
                      <div className="text-3xl md:text-4xl mb-2">{tema.icon}</div>
                      <div className="text-sm md:text-base font-medium">{tema.nome}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ETAPA 2: EMBARALHAMENTO - RESPONSIVO */}
          {etapa === 'embaralhando' && (
            <div className="text-center">
              <h3 className="text-xl md:text-2xl text-white mb-6 font-medium">
                As cartas estão se conectando com suas energias... 🌌
              </h3>
              <div className="flex justify-center space-x-2 md:space-x-4 mb-6 md:mb-8">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div
                    key={i}
                    className="w-12 h-16 md:w-16 md:h-24 bg-gradient-to-br from-purple-600/80 to-blue-600/80 rounded-lg shadow-lg transform transition-all duration-500 card-hover border border-purple-400/30"
                    style={{ 
                      animationDelay: `${i * 0.2}s`,
                      transform: `rotate(${Math.sin(Date.now() / 1000 + i) * 8}deg) translateY(${Math.sin(Date.now() / 800 + i) * 3}px)`
                    }}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent rounded-lg flex items-center justify-center text-lg md:text-xl">
                      🂠
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-slate-700/40 rounded-xl md:rounded-2xl p-4 md:p-6 max-w-md mx-auto border border-purple-500/30">
                <p className="text-purple-200/90 text-sm md:text-base">
                  Concentre-se em sua pergunta sobre{' '}
                  <span className="text-yellow-300 font-semibold">
                    {temas.find(t => t.id === temaSelecionado)?.nome.split(' ').slice(1).join(' ')}
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* ETAPA 3: ESCOLHA DAS CARTAS - COM HOVER E LEQUE */}
          {etapa === 'escolhendo' && (
          <div className="text-center">
          <h3 className="text-lg md:text-xl text-white mb-4 md:mb-6 font-medium">
           Escolha 3 cartas ({cartasSelecionadasIndices.length}/3)
          </h3>

          <div className="relative max-w-full mx-auto mb-6 h-24 md:h-32 flex items-center justify-center overflow-x-auto py-4">
          <div className="flex -space-x-4 md:-space-x-6 px-4">
          {cartasEmbaralhadas.slice(0, 22).map((_, index) => {
          const rotacao = (index - 10) * 1.8;
          const opacidade = Math.max(0.7, 1 - Math.abs(index - 10) * 0.03);
          
          return (
            <button
              key={index}
              onClick={() => escolherCarta(index)}
              disabled={cartasSelecionadasIndices.includes(index)}
              style={{
                transform: `rotate(${rotacao}deg)`,
                opacity: opacidade,
                zIndex: cartasSelecionadasIndices.includes(index) ? 50 : 22 - Math.abs(index - 10)
              }}
              className={`flex-shrink-0 w-12 h-16 md:w-16 md:h-24 rounded-lg transition-all duration-300 transform hover:scale-110 hover:z-40
                ${
                  cartasSelecionadasIndices.includes(index)
                    ? 'bg-gradient-to-br from-green-500 to-emerald-600 scale-110 shadow-lg shadow-green-500/50'
                    : 'bg-gradient-to-br from-purple-600/80 to-blue-600/80 hover:from-purple-500 hover:to-indigo-500 hover:shadow-2xl border border-purple-400/30'
                }`}
            >
              <div className="text-lg md:text-xl">
                {cartasSelecionadasIndices.includes(index) ? '✨' : '🂠'}
              </div>
              
              <div className="absolute inset-0 bg-white/0 hover:bg-white/10 rounded-lg transition-all duration-300"></div>
            </button>
            );
          })}
         </div>
        </div>

        <p className="text-purple-200/70 text-xs md:text-sm">
         Passe o mouse sobre as cartas para verem em destaque
         </p>
         </div>
        )}

          {/* ETAPA 4: REVELAÇÃO - GRID RESPONSIVO */}
          {etapa === 'revelando' && cartasEscolhidas.length === 3 && (
            <div className="text-center">
              <h3 className="text-2xl md:text-3xl text-white mb-6 md:mb-8 font-bold gradient-text">
                Sua Jornada Revelada! 🌟
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
                {cartasEscolhidas.map((carta, index) => (
                  <div 
                    key={carta.id} 
                    className="bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 transform hover:scale-105 transition-all duration-300 card-hover border border-purple-400/30"
                    style={{animationDelay: `${index * 0.2}s`}}
                  >
                    <div className="text-4xl md:text-5xl mb-4 transform hover:scale-110 transition-transform duration-300">
                      {carta.imagemUrl}
                    </div>
                    <h4 className="text-lg md:text-xl font-bold text-yellow-300 mb-3">{carta.nome}</h4>
                    <div className="bg-slate-600/30 rounded-lg p-3 md:p-4 border border-purple-400/20">
                      <p className="text-white text-sm md:text-base leading-relaxed">
                        {carta.interpretacoes[temaSelecionado!]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* BOTÕES RESPONSIVOS */}
              <div className="flex flex-col sm:flex-row gap-3 md:gap-6 justify-center items-center">
                <button
                  onClick={reiniciar}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg border border-purple-400/30"
                >
                  <span className="flex items-center justify-center">
                    🔄 <span className="ml-2">Nova Consulta</span>
                  </span>
                </button>
                
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-semibold rounded-lg hover:scale-105 transition-transform duration-300 shadow-lg border border-amber-400/30 text-center"
                >
                  <span className="flex items-center justify-center">
                    💫 <span className="ml-2">Consulta com Especialista</span>
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* CALL TO ACTION - RESPONSIVO (ORIGINAL) */}
        {etapa === 'tema' && (
          <div className="mt-12 md:mt-20 text-center">
            <div className="max-w-4xl mx-auto bg-slate-800/40 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-purple-500/30">
              <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-4 md:mb-6">
                Pronto para uma Jornada Profunda?
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-slate-700/30 rounded-xl p-4 md:p-6 border border-purple-400/20 card-hover">
                  <div className="text-3xl mb-3">🔮</div>
                  <h3 className="text-lg md:text-xl font-semibold text-yellow-300 mb-2">Consulta Personalizada</h3>
                  <p className="text-purple-200/80 text-sm md:text-base">
                    Atendimento individual via WhatsApp com tarólogo especializado
                  </p>
                </div>
                
                <div className="bg-slate-700/30 rounded-xl p-4 md:p-6 border border-purple-400/20 card-hover">
                  <div className="text-3xl mb-3">⏱️</div>
                  <h3 className="text-lg md:text-xl font-semibold text-yellow-300 mb-2">Flexibilidade Total</h3>
                  <p className="text-purple-200/80 text-sm md:text-base">
                    Sistema de créditos por minuto - pague apenas pelo tempo usado
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