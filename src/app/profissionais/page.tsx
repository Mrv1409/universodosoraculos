'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthState } from '@/hooks/useAuthState';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  experiencia: string;
  valorPorMinuto: number;
  avaliacao: number;
  totalAvaliacoes: number;
  foto: string;
  descricao: string;
  especialidades: string[];
  online: boolean;
  real: boolean;
}

// DADOS REAIS - 4 ATENDENTES PREMIUM (R$2,60)
const profissionaisReais: Profissional[] = [
  {
    id: 'aurora',
    nome: 'Cigana Aurora',
    especialidade: 'Tarot Espiritual',
    experiencia: '10 anos de experiência',
    valorPorMinuto: 2.60,
    avaliacao: 4.9,
    totalAvaliacoes: 1360,
    foto: '/images/ciganaaurora.jpeg',
    descricao: 'Mestre em Tarot de Rider Waite e Baralho Cigano. Conexão espiritual profunda com orientações claras e transformadoras para amor e propósito de vida.',
    especialidades: ['Rider Waite', 'Baralho Cigano', 'Amor', 'Propósito'],
    online: true,
    real: true
  },
  {
    id: 'mary',
    nome: 'Cigana Mary',
    especialidade: 'Tarot Versátil',
    experiencia: '8 anos de experiência',
    valorPorMinuto: 2.60,
    avaliacao: 4.8,
    totalAvaliacoes: 1342,
    foto: '/images/ciganamary.jpeg',
    descricao: 'Especialista em Tarot de Osho, Rider Waite e Baralho Cigano. Abordagem versátil para todas as áreas da vida com foco em clareza e direcionamento.',
    especialidades: ['Tarot Osho', 'Rider Waite', 'Baralho Cigano', 'Clareza'],
    online: true,
    real: true
  },
  {
    id: 'jade',
    nome: 'Cigana Jade',
    especialidade: 'Tarot Terapêutico',
    experiencia: '7 anos de experiência',
    valorPorMinuto: 2.60,
    avaliacao: 4.9,
    totalAvaliacoes: 1487,
    foto: '/images/ciganajade.jpeg',
    descricao: 'Especialista em Tarot de Marselha, Baralho Cigano e Tarot Terapêutico. Abordagem curativa para questões emocionais e kármicas.',
    especialidades: ['Tarot Marselha', 'Baralho Cigano', 'Terapêutico', 'Cura'],
    online: true,
    real: true
  },
  {
    id: 'mel',
    nome: 'Cigana Mel',
    especialidade: 'Tarot Energético',
    experiencia: '9 anos de experiência',
    valorPorMinuto: 2.60,
    avaliacao: 4.8,
    totalAvaliacoes: 1223,
    foto: '/images/ciganamel.jpeg',
    descricao: 'Taróloga e Terapeuta Reikiana. Utiliza Baralho Cigano e Tarô Terapêutico Intuitivo integrado com cura energética para resultados profundos.',
    especialidades: ['Baralho Cigano', 'Tarô Terapêutico', 'Reiki', 'Energético'],
    online: true,
    real: true
  }
];

// DADOS FAKE - 9 PROFISSIONAIS DEMONSTRAÇÃO (VALORES MENORES)
const profissionaisFake: Profissional[] = [
  {
    id: 'fake1',
    nome: 'Sábio Orion',
    especialidade: 'Tarot Terapêutico',
    experiencia: '5 anos de experiência',
    valorPorMinuto: 1.80,
    avaliacao: 4.2,
    totalAvaliacoes: 976,
    foto: '/images/sabioorion.jpg',
    descricao: 'Abordagem terapêutica com foco em autoconhecimento e desenvolvimento pessoal através do tarot.',
    especialidades: ['Terapêutico', 'Autoconhecimento', 'Desenvolvimento'],
    online: false,
    real: false
  },
  {
    id: 'fake2',
    nome: 'Cigana Serena',
    especialidade: 'Tarot Lunar',
    experiencia: '4 anos de experiência',
    valorPorMinuto: 2.00,
    avaliacao: 3.9,
    totalAvaliacoes: 754,
    foto: '/images/ciganaserena.jpg',
    descricao: 'Leituras baseadas nas fases lunares e ciclos naturais da vida para melhor sincronicidade.',
    especialidades: ['Lunar', 'Ciclos Naturais', 'Sincronicidade'],
    online: false,
    real: false
  },
  {
    id: 'fake3',
    nome: 'Cigano Celso',
    especialidade: 'Tarot Tradicional',
    experiencia: '6 anos de experiência',
    valorPorMinuto: 2.20,
    avaliacao: 4.2,
    totalAvaliacoes: 932,
    foto: '/images/ciganocelso.jpg',
    descricao: 'Métodos tradicionais de tarot com abordagem direta e objetiva para decisões importantes.',
    especialidades: ['Tradicional', 'Decisões', 'Objetividade'],
    online: false,
    real: false
  },
  {
    id: 'fake4',
    nome: 'Cigana Estela',
    especialidade: 'Baralho Cigano',
    experiencia: '3 anos de experiência',
    valorPorMinuto: 1.90,
    avaliacao: 3.7,
    totalAvaliacoes: 889,
    foto: '/images/ciganaestrela.jpg',
    descricao: 'Foco em baralho cigano com interpretações práticas para o dia a dia e relacionamentos.',
    especialidades: ['Baralho Cigano', 'Prático', 'Relacionamentos'],
    online: false,
    real: false
  },
  {
    id: 'fake5',
    nome: 'Mago Rafael',
    especialidade: 'Tarot Egípcio',
    experiencia: '5 anos de experiência',
    valorPorMinuto: 2.40,
    avaliacao: 4.0,
    totalAvaliacoes: 901,
    foto: '/images/magorafael.jpg',
    descricao: 'Especialista em Tarot Egípcio com conhecimentos ancestrais para questões espirituais.',
    especialidades: ['Tarot Egípcio', 'Ancestral', 'Espiritual'],
    online: false,
    real: false
  },
  {
    id: 'fake6',
    nome: 'Místico Lucas',
    especialidade: 'Tarot Profético',
    experiencia: '4 anos de experiência',
    valorPorMinuto: 2.10,
    avaliacao: 3.8,
    totalAvaliacoes: 876,
    foto: '/images/misticolucas.jpg',
    descricao: 'Leituras com foco em insights futuros e orientações para planejamento de vida.',
    especialidades: ['Profético', 'Insights', 'Planejamento'],
    online: false,
    real: false
  },
  // NOVOS PROFISSIONAIS FAKE
  {
    id: 'fake7',
    nome: 'Cigana Íris',
    especialidade: 'Tarot Intuitivo',
    experiencia: '6 anos de experiência',
    valorPorMinuto: 2.30,
    avaliacao: 4.1,
    totalAvaliacoes: 1045,
    foto: '/images/ciganairis.jpg',
    descricao: 'Especialista em leituras intuitivas conectando com a energia pessoal para revelar caminhos únicos.',
    especialidades: ['Intuitivo', 'Energia', 'Caminhos'],
    online: false,
    real: false
  },
  {
    id: 'fake8',
    nome: 'Xamã Pedro',
    especialidade: 'Tarot Xamânico',
    experiencia: '8 anos de experiência',
    valorPorMinuto: 2.50,
    avaliacao: 4.3,
    totalAvaliacoes: 1187,
    foto: '/images/xamapedro.jpg',
    descricao: 'Integra práticas xamânicas com tarot para cura espiritual e conexão com animais de poder.',
    especialidades: ['Xamânico', 'Cura Espiritual', 'Animais de Poder'],
    online: false,
    real: false
  },
  {
    id: 'fake9',
    nome: 'Cigana Esperança',
    especialidade: 'Runas & Tarô',
    experiencia: '7 anos de experiência',
    valorPorMinuto: 2.35,
    avaliacao: 4.4,
    totalAvaliacoes: 1298,
    foto: '/images/ciganaesperanca.jpg',
    descricao: 'Combina a sabedoria das runas nórdicas com tarot para leituras profundas sobre destino.',
    especialidades: ['Runas', 'Tarô', 'Destino', 'Nórdico'],
    online: false,
    real: false
  },
  {
    id: 'fake10',
    nome: 'Oráculo Diana',
    especialidade: 'Tarot dos Anjos',
    experiencia: '5 anos de experiência',
    valorPorMinuto: 2.15,
    avaliacao: 4.0,
    totalAvaliacoes: 967,
    foto: '/images/oraculodiana.jpg',
    descricao: 'Canalizadora angelical especializada em conexões com anjos guardiões e mensagens celestiais.',
    especialidades: ['Anjos', 'Canalização', 'Celestial', 'Proteção'],
    online: false,
    real: false
  }
];

const todosProfissionais = [...profissionaisReais, ...profissionaisFake];

export default function ProfissionaisPage() {
  const { user } = useAuthState();
  const router = useRouter();
  const [profissionais, setProfissionais] = useState<Profissional[]>(todosProfissionais);
  const [filtroEspecialidade, setFiltroEspecialidade] = useState<string>('todos');
  const [filtroTipo, setFiltroTipo] = useState<string>('todos');
  const [ordenacao, setOrdenacao] = useState<string>('destaque');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);

  // Partículas flutuantes (mesmo padrão)
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

  // Monitorar status online dos profissionais no Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'profissionais-status'), (snapshot) => {
      const statusUpdates: { [key: string]: boolean } = {};
      
      snapshot.docs.forEach((doc) => {
        statusUpdates[doc.id] = doc.data().online || false;
      });

      setProfissionais(prev => 
        prev.map(prof => ({
          ...prof,
          online: statusUpdates[prof.id] !== undefined ? statusUpdates[prof.id] : prof.online
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  // Filtrar e ordenar profissionais
  const profissionaisFiltrados = profissionais
    .filter(prof => {
      if (filtroEspecialidade !== 'todos') {
        const especialidadeMatch = prof.especialidades.some(esp => 
          esp.toLowerCase().includes(filtroEspecialidade.toLowerCase())
        );
        if (!especialidadeMatch) return false;
      }

      if (filtroTipo !== 'todos') {
        if (filtroTipo === 'reais' && !prof.real) return false;
        if (filtroTipo === 'demonstracao' && prof.real) return false;
      }

      return true;
    })
    .sort((a, b) => {
      switch (ordenacao) {
        case 'preco-menor':
          return a.valorPorMinuto - b.valorPorMinuto;
        case 'preco-maior':
          return b.valorPorMinuto - a.valorPorMinuto;
        case 'avaliacao':
          return b.avaliacao - a.avaliacao;
        case 'online':
          return (b.online ? 1 : 0) - (a.online ? 1 : 0);
        case 'destaque':
        default:
          if (a.real && !b.real) return -1;
          if (!a.real && b.real) return 1;
          return b.avaliacao - a.avaliacao;
      }
    });

  const handleAgendarConsulta = (profissional: Profissional) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (!profissional.online) {
      alert('Este profissional está offline no momento. Tente novamente mais tarde.');
      return;
    }

    router.push(`/dashboard`);
  };

  const renderEstrelas = (avaliacao: number) => {
    return (
      <div className="flex items-center justify-center">
        {[...Array(5)].map((_, i) => (
          <span 
            key={i} 
            className={`text-sm ${
              i < Math.floor(avaliacao) ? 'text-yellow-400' : 'text-gray-600'
            }`}
          >
            ⭐
          </span>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* CSS Global (mesmo padrão) */}
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
              <span className="text-6xl md:text-8xl block mb-4 animate-bounce">👥</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 md:mb-6 gradient-text mobile-text">
              Nossos Especialistas
            </h1>
            
            <p className="text-lg md:text-xl text-purple-200/90 mb-6 md:mb-8 font-light max-w-3xl mx-auto leading-relaxed">
              Conecte-se com tarólogos experientes e encontre as respostas que busca para sua vida
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

        {/* Filtros e Ordenação Refinados */}
        <div className="max-w-6xl mx-auto mb-8">
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 border border-purple-500/30 shadow-xl">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              
              <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
                {/* Filtro por Tipo */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-purple-300 text-sm mb-2 font-medium">Tipo:</label>
                  <select
                    value={filtroTipo}
                    onChange={(e) => setFiltroTipo(e.target.value)}
                    className="w-full bg-slate-700/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white focus:border-purple-400 focus:outline-none text-sm backdrop-blur-sm"
                  >
                    <option value="todos">Todos Profissionais</option>
                    <option value="reais">⭐ Atendentes Reais</option>
                    <option value="demonstracao">Demonstração</option>
                  </select>
                </div>

                {/* Filtro por Especialidade */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-purple-300 text-sm mb-2 font-medium">Especialidade:</label>
                  <select
                    value={filtroEspecialidade}
                    onChange={(e) => setFiltroEspecialidade(e.target.value)}
                    className="w-full bg-slate-700/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white focus:border-purple-400 focus:outline-none text-sm backdrop-blur-sm"
                  >
                    <option value="todos">Todas Especialidades</option>
                    <option value="amor">Amor & Relacionamentos</option>
                    <option value="terapêutico">Terapêutico & Cura</option>
                    <option value="espiritual">Espiritual & Energético</option>
                    <option value="tradicional">Tradicional</option>
                  </select>
                </div>

                {/* Ordenação */}
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-purple-300 text-sm mb-2 font-medium">Ordenar por:</label>
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    className="w-full bg-slate-700/50 border border-purple-500/30 rounded-xl px-3 py-2 text-white focus:border-purple-400 focus:outline-none text-sm backdrop-blur-sm"
                  >
                    <option value="destaque">⭐ Em Destaque</option>
                    <option value="avaliacao">Melhor Avaliação</option>
                    <option value="preco-menor">Menor Preço</option>
                    <option value="preco-maior">Maior Preço</option>
                    <option value="online">Online Primeiro</option>
                  </select>
                </div>
              </div>

              {/* Contador */}
              <div className="text-purple-300 text-sm whitespace-nowrap bg-slate-700/30 px-4 py-2 rounded-xl">
                <span className="font-medium">{profissionaisFiltrados.length}</span> especialista{profissionaisFiltrados.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Profissionais Refinado */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 md:gap-6">
            {profissionaisFiltrados.map((profissional) => (
              <div
                key={profissional.id}
                className={`card-hover bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-4 md:p-6 border transition-all duration-300 transform hover:scale-105 shadow-xl relative group ${
                  profissional.real 
                    ? 'border-yellow-400/50 hover:border-yellow-300/70 shadow-yellow-500/10' 
                    : 'border-purple-500/30 hover:border-purple-400/50'
                }`}
              >
                {/* Badge TOP para profissionais reais */}
                {profissional.real && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-xs font-bold px-3 py-1 rounded-full z-10 shadow-lg animate-pulse">
                    TOP ⭐
                  </div>
                )}

                {/* Status Online/Offline */}
                <div className="absolute top-3 left-3">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold backdrop-blur-sm ${
                    profissional.online 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      profissional.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                    }`}></span>
                    <span className="hidden sm:inline">
                      {profissional.online ? 'ONLINE' : 'OFFLINE'}
                    </span>
                  </div>
                </div>

                {/* Foto e Informações Principais */}
                <div className="text-center mb-4">
                  <div className={`relative w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 rounded-full overflow-hidden shadow-lg ${
                    profissional.real ? 'border-2 border-yellow-400/70' : 'border-2 border-purple-400/50'
                  }`}>
                    <Image
                      src={profissional.foto}
                      alt={profissional.nome}
                      fill
                      sizes="(max-width: 768px) 64px, 80px"
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-1 line-clamp-1">{profissional.nome}</h3>
                  <p className="text-purple-300 text-sm md:text-base font-medium mb-1">{profissional.especialidade}</p>
                  <p className="text-purple-400 text-xs md:text-sm">{profissional.experiencia}</p>
                </div>

                {/* Avaliação */}
                <div className="text-center mb-4">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    {renderEstrelas(profissional.avaliacao)}
                    <span className="text-yellow-400 font-bold text-sm ml-1">{profissional.avaliacao}</span>
                  </div>
                  <p className="text-purple-300 text-xs">
                    ({profissional.totalAvaliacoes} avaliações)
                  </p>
                </div>

                {/* Preço com Destaque */}
                <div className="text-center mb-4">
                  <div className={`rounded-2xl p-2 md:p-3 border ${
                    profissional.real
                      ? 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 border-yellow-500/30' 
                      : 'bg-gradient-to-r from-purple-500/20 to-blue-500/20 border-purple-500/30'
                  }`}>
                    <span className={`text-lg md:text-xl font-bold ${
                      profissional.real ? 'text-yellow-400' : 'text-purple-300'
                    }`}>
                      R$ {profissional.valorPorMinuto.toFixed(2)}
                    </span>
                    <p className="text-xs md:text-sm opacity-80">por minuto</p>
                  </div>
                </div>

                {/* Especialidades */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-1 justify-center">
                    {profissional.especialidades.slice(0, 3).map((esp, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30 backdrop-blur-sm"
                      >
                        {esp}
                      </span>
                    ))}
                    {profissional.especialidades.length > 3 && (
                      <span className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded-full text-xs">
                        +{profissional.especialidades.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Botões */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setProfissionalSelecionado(profissional)}
                    className="w-full py-2 px-4 bg-slate-700/40 hover:bg-slate-700/60 text-purple-300 hover:text-purple-200 font-medium rounded-xl border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 text-sm backdrop-blur-sm"
                  >
                    📋 Ver Detalhes
                  </button>
                  
                  <button
                    onClick={() => handleAgendarConsulta(profissional)}
                    disabled={!profissional.online}
                    className={`w-full py-2 px-4 font-bold rounded-xl transition-all duration-300 text-sm ${
                      profissional.online
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:scale-105'
                        : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {profissional.online ? '📱 Consultar Agora' : '⏰ Offline'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Mensagem quando nenhum profissional encontrado */}
          {profissionaisFiltrados.length === 0 && (
            <div className="text-center py-12">
              <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-8 border border-purple-500/30 shadow-xl">
                <span className="text-6xl block mb-4">🔍</span>
                <h3 className="text-xl font-bold text-white mb-4">Nenhum profissional encontrado</h3>
                <p className="text-purple-200/80 mb-6">Tente ajustar os filtros para encontrar mais especialistas.</p>
                <button
                  onClick={() => {
                    setFiltroTipo('todos');
                    setFiltroEspecialidade('todos');
                    setOrdenacao('destaque');
                  }}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-105"
                >
                  Limpar Filtros
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Detalhes Refinado */}
        {profissionalSelecionado && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-800/90 backdrop-blur-xl rounded-2xl md:rounded-3xl p-6 max-w-2xl w-full border border-purple-500/50 max-h-[90vh] overflow-y-auto shadow-2xl">
              <div className="text-center mb-6">
                <div className={`relative w-20 h-20 md:w-24 md:h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 shadow-2xl ${
                  profissionalSelecionado.real ? 'border-yellow-400/70' : 'border-purple-400/70'
                }`}>
                  <Image
                    src={profissionalSelecionado.foto}
                    alt={profissionalSelecionado.nome}
                    fill
                    sizes="(max-width: 768px) 80px, 96px"
                    className="object-cover"
                  />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold gradient-text mb-2">{profissionalSelecionado.nome}</h2>
                <p className="text-purple-300 text-lg">{profissionalSelecionado.especialidade}</p>
                {profissionalSelecionado.real && (
                  <span className="inline-block bg-gradient-to-r from-yellow-500 to-orange-500 text-black text-sm font-bold px-3 py-1 rounded-full mt-2 animate-pulse">
                    ⭐ ATENDENTE REAL - TOP QUALIDADE
                  </span>
                )}
              </div>

              <div className="space-y-6">
                <div className="bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-500/30">
                  <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center">
                    <span className="text-xl mr-2">📖</span>
                    Sobre o Profissional
                  </h3>
                  <p className="text-purple-200/90 leading-relaxed">{profissionalSelecionado.descricao}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-700/40 backdrop-blur-md rounded-xl p-4 border border-yellow-500/30">
                    <h4 className="text-yellow-400 font-semibold mb-2 flex items-center">
                      <span className="text-lg mr-2">⏳</span>
                      Experiência
                    </h4>
                    <p className="text-yellow-300">{profissionalSelecionado.experiencia}</p>
                  </div>
                  
                  <div className="bg-slate-700/40 backdrop-blur-md rounded-xl p-4 border border-green-500/30">
                    <h4 className="text-green-400 font-semibold mb-2 flex items-center">
                      <span className="text-lg mr-2">⭐</span>
                      Avaliação
                    </h4>
                    <div className="flex items-center gap-2">
                      {renderEstrelas(profissionalSelecionado.avaliacao)}
                      <span className="text-green-300 font-bold">{profissionalSelecionado.avaliacao}</span>
                      <span className="text-green-300/70 text-sm">({profissionalSelecionado.totalAvaliacoes})</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-purple-500/30">
                  <h3 className="text-lg font-bold text-purple-300 mb-4 flex items-center">
                    <span className="text-xl mr-2">🎯</span>
                    Especialidades
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {profissionalSelecionado.especialidades.map((esp, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-slate-600/50 text-purple-200 rounded-full text-sm border border-purple-500/30 backdrop-blur-sm hover:border-purple-400/50 transition-colors duration-300"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-700/40 backdrop-blur-md rounded-xl p-4 border border-blue-500/30 text-center">
                  <h4 className="text-blue-400 font-semibold mb-2 flex items-center justify-center">
                    <span className="text-lg mr-2">💰</span>
                    Valor da Consulta
                  </h4>
                  <p className="text-blue-300 text-2xl font-bold">R$ {profissionalSelecionado.valorPorMinuto.toFixed(2)}</p>
                  <p className="text-blue-300/70 text-sm">por minuto</p>
                </div>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => setProfissionalSelecionado(null)}
                  className="flex-1 py-3 px-4 bg-slate-700/50 hover:bg-slate-700/70 text-slate-300 font-medium rounded-xl transition-all duration-300 border border-slate-500/30"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setProfissionalSelecionado(null);
                    handleAgendarConsulta(profissionalSelecionado);
                  }}
                  disabled={!profissionalSelecionado.online}
                  className={`flex-1 py-3 px-4 font-bold rounded-xl transition-all duration-300 ${
                    profissionalSelecionado.online
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg hover:scale-105'
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {profissionalSelecionado.online ? '📱 Agendar Consulta' : '⏰ Indisponível'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Call-to-Action Final */}
        <div className="max-w-4xl mx-auto text-center mt-12 md:mt-20">
          <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-8 md:p-12 border border-purple-500/30 shadow-xl">
            <h2 className="text-2xl md:text-4xl font-bold gradient-text mb-4 md:mb-6">
              Não encontrou o que procurava?
            </h2>
            <p className="text-base md:text-xl text-purple-200/90 mb-6 md:mb-8 leading-relaxed">
              Nossos atendentes reais estão sempre disponíveis para consultas personalizadas.
              Adquira seus créditos e conecte-se agora mesmo!
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => router.push('/creditos')}
                className="card-hover w-full sm:w-auto inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-lg md:text-xl rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
              >
                <span className="mr-2">💰</span>
                Comprar Créditos
              </button>
              
              <button
                onClick={() => router.push('/dashboard')}
                className="card-hover w-full sm:w-auto inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-lg md:text-xl rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg border border-purple-400/30"
              >
                <span className="mr-2">🔮</span>
                Solicitar Consulta
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}