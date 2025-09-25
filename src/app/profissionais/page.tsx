'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useAuthState } from '@/hooks/useAuthState';//eslint-disable-next-line
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Profissional {
  id: string;
  nome: string;
  especialidade: string;
  experiencia: string;
  valorPorMinuto: number;
  avaliacao: number;
  totalAvaliacoes: number;
  foto: string; // Caminho para a imagem: '/images/profissionais/marina.jpg'
  descricao: string;
  especialidades: string[];
  online: boolean;
  ultimoAcesso?: Date;
}

// Dados mockados dos profissionais (ALTERE APENAS OS CAMINHOS DAS FOTOS)
const profissionaisMock: Profissional[] = [
  {
    id: 'prof1',
    nome: 'Marina Celestial',
    especialidade: 'Amor e Relacionamentos',
    experiencia: '8 anos de experiência',
    valorPorMinuto: 3.50,
    avaliacao: 4.9,
    totalAvaliacoes: 1247,
    foto: '/images/profissionais/marina.jpg', // ← ALTERE AQUI
    descricao: 'Especialista em questões do coração, relacionamentos e vida amorosa. Orientação com cartas ciganas e tarô tradicional.',
    especialidades: ['Amor', 'Relacionamentos', 'Casamento', 'Paixão'],
    online: true
  },
  {
    id: 'prof2',
    nome: 'Gabriel Místico',
    especialidade: 'Carreira e Projetos',
    experiencia: '12 anos de experiência',
    valorPorMinuto: 4.50,
    avaliacao: 4.8,
    totalAvaliacoes: 892,
    foto: '/images/profissionais/gabriel.jpg', // ← ALTERE AQUI
    descricao: 'Mestre em orientações profissionais e projetos de vida. Especialista em runas nórdicas e tarô egípcio.',
    especialidades: ['Carreira', 'Projetos', 'Dinheiro', 'Negócios'],
    online: false
  },
  {
    id: 'prof3',
    nome: 'Luna Esotérica',
    especialidade: 'Espiritualidade e Karmas',
    experiencia: '15 anos de experiência',
    valorPorMinuto: 4.00,
    avaliacao: 5.0,
    totalAvaliacoes: 634,
    foto: '/images/profissionais/luna.jpg', // ← ALTERE AQUI
    descricao: 'Conselheira espiritual especializada em limpeza energética, karmas e propósito de vida. Trabalha com cristais e oráculos.',
    especialidades: ['Espiritualidade', 'Karmas', 'Energia', 'Propósito'],
    online: true
  },
  {
    id: 'prof4',
    nome: 'Ricardo Vidente',
    especialidade: 'Consultas Gerais',
    experiencia: '6 anos de experiência',
    valorPorMinuto: 2.50,
    avaliacao: 4.7,
    totalAvaliacoes: 1583,
    foto: '/images/profissionais/ricardo.jpg', // ← ALTERE AQUI
    descricao: 'Tarólogo versátil com dom natural para vidência. Atende todas as áreas da vida com clareza e objetividade.',
    especialidades: ['Geral', 'Futuro', 'Decisões', 'Orientação'],
    online: true
  }
];

export default function ProfissionaisPage() {
  const { user } = useAuthState();
  const router = useRouter();
  const [profissionais, setProfissionais] = useState<Profissional[]>(profissionaisMock);
  const [filtroEspecialidade, setFiltroEspecialidade] = useState<string>('todos');
  const [ordenacao, setOrdenacao] = useState<string>('avaliacao');
  const [profissionalSelecionado, setProfissionalSelecionado] = useState<Profissional | null>(null);

  // Monitorar status online dos profissionais no Firebase
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'profissionais-status'), (snapshot) => {
      const statusUpdates: { [key: string]: boolean } = {};
      
      snapshot.docs.forEach((doc) => {
        statusUpdates[doc.id] = doc.data().online || false;
      });

      // Atualizar status dos profissionais
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
      if (filtroEspecialidade === 'todos') return true;
      return prof.especialidades.some(esp => 
        esp.toLowerCase().includes(filtroEspecialidade.toLowerCase())
      );
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
        default:
          return 0;
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

    // Redirecionar para página de agendamento ou gerar WhatsApp
    // Por enquanto, vamos simular
    const mensagem = `Olá ${profissional.nome}! Gostaria de agendar uma consulta de tarô. Meu nome é ${user.displayName || user.email}.`;
    const whatsapp = `https://wa.me/5511999999999?text=${encodeURIComponent(mensagem)}`;
    window.open(whatsapp, '_blank');
  };

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-900 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-purple-900/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,43,226,0.3),transparent_50%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12 min-h-screen">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="mb-8">
            <span className="text-6xl block mb-4">👥</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 bg-clip-text text-transparent">
            Nossos Especialistas
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Conecte-se com taróglogos experientes e encontre as respostas que busca para sua vida
          </p>
        </div>

        {/* Filtros e Ordenação */}
        <div className="max-w-6xl mx-auto mb-12">
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-6 border border-purple-500/30">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Filtro por Especialidade */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div>
                  <label className="block text-purple-300 text-sm mb-2">Especialidade:</label>
                  <select
                    value={filtroEspecialidade}
                    onChange={(e) => setFiltroEspecialidade(e.target.value)}
                    className="bg-black/50 border border-purple-500/50 rounded-xl px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="todos">Todas</option>
                    <option value="amor">Amor</option>
                    <option value="carreira">Carreira</option>
                    <option value="espiritualidade">Espiritualidade</option>
                    <option value="geral">Consulta Geral</option>
                  </select>
                </div>

                <div>
                  <label className="block text-purple-300 text-sm mb-2">Ordenar por:</label>
                  <select
                    value={ordenacao}
                    onChange={(e) => setOrdenacao(e.target.value)}
                    className="bg-black/50 border border-purple-500/50 rounded-xl px-4 py-2 text-white focus:border-purple-400 focus:outline-none"
                  >
                    <option value="avaliacao">Melhor Avaliação</option>
                    <option value="preco-menor">Menor Preço</option>
                    <option value="preco-maior">Maior Preço</option>
                    <option value="online">Online Primeiro</option>
                  </select>
                </div>
              </div>

              {/* Contador */}
              <div className="text-purple-300 text-sm">
                {profissionaisFiltrados.length} especialista{profissionaisFiltrados.length !== 1 ? 's' : ''} encontrado{profissionaisFiltrados.length !== 1 ? 's' : ''}
              </div>
            </div>
          </div>
        </div>

        {/* Grid de Profissionais */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-8">
            {profissionaisFiltrados.map((profissional) => (
              <div
                key={profissional.id}
                className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl relative"
              >
                {/* Status Online/Offline */}
                <div className="absolute top-4 right-4">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold ${
                    profissional.online 
                      ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                      : 'bg-red-500/20 text-red-400 border border-red-500/50'
                  }`}>
                    <span className={`w-2 h-2 rounded-full ${
                      profissional.online ? 'bg-green-400 animate-pulse' : 'bg-red-400'
                    }`}></span>
                    {profissional.online ? 'ONLINE' : 'OFFLINE'}
                  </div>
                </div>

                {/* Foto e Nome */}
                <div className="text-center mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-purple-400/50 shadow-xl hover:border-purple-300/70 transition-all duration-300">
                    <Image
                      src={profissional.foto}
                      alt={profissional.nome}
                      fill
                      sizes="96px"
                      className="object-cover hover:scale-110 transition-transform duration-300"
                      priority={true}
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">{profissional.nome}</h3>
                  <p className="text-purple-300 font-medium">{profissional.especialidade}</p>
                  <p className="text-purple-400 text-sm">{profissional.experiencia}</p>
                </div>

                {/* Avaliação */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={i} 
                          className={`text-lg ${
                            i < Math.floor(profissional.avaliacao) ? 'text-yellow-400' : 'text-gray-600'
                          }`}
                        >
                          ⭐
                        </span>
                      ))}
                    </div>
                    <span className="text-yellow-400 font-bold">{profissional.avaliacao}</span>
                  </div>
                  <p className="text-purple-300 text-sm">
                    {profissional.totalAvaliacoes} avaliações
                  </p>
                </div>

                {/* Preço */}
                <div className="text-center mb-6">
                  <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 rounded-2xl p-4 border border-yellow-500/30">
                    <span className="text-yellow-400 text-3xl font-bold">
                      R$ {profissional.valorPorMinuto.toFixed(2)}
                    </span>
                    <p className="text-yellow-300 text-sm">por minuto</p>
                  </div>
                </div>

                {/* Especialidades */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2 justify-center">
                    {profissional.especialidades.slice(0, 4).map((esp, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-purple-500/20 text-purple-300 rounded-full text-xs border border-purple-500/30"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Botões */}
                <div className="flex flex-col gap-3">
                  <button
                    onClick={() => setProfissionalSelecionado(profissional)}
                    className="w-full py-3 px-6 bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 hover:text-purple-200 font-medium rounded-xl border border-purple-500/50 hover:border-purple-400/70 transition-all duration-300"
                  >
                    📋 Ver Detalhes
                  </button>
                  
                  <button
                    onClick={() => handleAgendarConsulta(profissional)}
                    disabled={!profissional.online}
                    className={`w-full py-4 px-6 font-bold rounded-xl transition-all duration-300 transform hover:scale-105 ${
                      profissional.online
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white shadow-lg'
                        : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {profissional.online ? '📱 Agendar Consulta' : '⏰ Indisponível'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal de Detalhes */}
        {profissionalSelecionado && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-black/80 backdrop-blur-xl rounded-3xl p-8 max-w-2xl w-full border border-purple-500/50 max-h-[90vh] overflow-y-auto">
              <div className="text-center mb-6">
                <div className="relative w-32 h-32 mx-auto mb-6 rounded-full overflow-hidden border-4 border-purple-400/70 shadow-2xl">
                  <Image
                    src={profissionalSelecionado.foto}
                    alt={profissionalSelecionado.nome}
                    fill
                    sizes="128px"
                    className="object-cover"
                    priority={true}
                  />
                </div>
                <h2 className="text-3xl font-bold text-white mb-2">{profissionalSelecionado.nome}</h2>
                <p className="text-purple-300 text-lg">{profissionalSelecionado.especialidade}</p>
              </div>

              <div className="space-y-6">
                <div className="bg-purple-900/30 rounded-2xl p-6 border border-purple-500/30">
                  <h3 className="text-xl font-bold text-purple-300 mb-3">Sobre</h3>
                  <p className="text-purple-200 leading-relaxed">{profissionalSelecionado.descricao}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-yellow-900/20 rounded-2xl p-4 border border-yellow-500/30">
                    <h4 className="text-yellow-400 font-semibold mb-2">Experiência</h4>
                    <p className="text-yellow-300">{profissionalSelecionado.experiencia}</p>
                  </div>
                  
                  <div className="bg-green-900/20 rounded-2xl p-4 border border-green-500/30">
                    <h4 className="text-green-400 font-semibold mb-2">Avaliação</h4>
                    <p className="text-green-300">⭐ {profissionalSelecionado.avaliacao} ({profissionalSelecionado.totalAvaliacoes} avaliações)</p>
                  </div>
                </div>

                <div className="bg-purple-900/30 rounded-2xl p-6 border border-purple-500/30">
                  <h3 className="text-xl font-bold text-purple-300 mb-3">Especialidades</h3>
                  <div className="flex flex-wrap gap-2">
                    {profissionalSelecionado.especialidades.map((esp, index) => (
                      <span 
                        key={index}
                        className="px-4 py-2 bg-purple-500/30 text-purple-200 rounded-full text-sm border border-purple-500/50"
                      >
                        {esp}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  onClick={() => setProfissionalSelecionado(null)}
                  className="flex-1 py-3 px-6 bg-gray-600/50 hover:bg-gray-600/70 text-gray-300 font-medium rounded-xl transition-all duration-300"
                >
                  Fechar
                </button>
                <button
                  onClick={() => {
                    setProfissionalSelecionado(null);
                    handleAgendarConsulta(profissionalSelecionado);
                  }}
                  disabled={!profissionalSelecionado.online}
                  className={`flex-1 py-3 px-6 font-bold rounded-xl transition-all duration-300 ${
                    profissionalSelecionado.online
                      ? 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white'
                      : 'bg-gray-600/50 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {profissionalSelecionado.online ? '📱 Agendar Consulta' : '⏰ Indisponível'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}