'use client';

import { useState, useEffect } from 'react';
import { User } from 'firebase/auth';
import { Usuario } from '@/types';
import { formatarTempo } from '@/lib/utils';
import Link from 'next/link';
import ConsultaModal from '@/components/ConsultaModal';

interface DashboardContentProps {
  user: User;
  userData: Usuario;
  activeSection: string;
}

export default function DashboardContent({ user, userData, activeSection }: DashboardContentProps) {
  const [consultaModalOpen, setConsultaModalOpen] = useState(false);

  // Partículas flutuantes (mesmo da tela de apresentação)
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

  const OverviewSection = () => (
    <div className="space-y-8 md:space-y-12">
      {/* Welcome Header Refinado */}
      <div className="relative bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-blue-500/10 rounded-2xl md:rounded-3xl"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl md:text-3xl font-bold gradient-text">
              Bem-vindo, {userData.nome}!
            </h1>
            <span className="text-4xl md:text-5xl animate-pulse">✨</span>
          </div>
          <p className="text-purple-200/90 text-base md:text-lg">
            Explore os mistérios do universo através dos oráculos sagrados.
          </p>
        </div>
      </div>

      {/* Cards de Estatísticas Refinados */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Card Créditos */}
        <div className="card-hover group relative bg-slate-800/40 backdrop-blur-lg rounded-2xl p-6 border border-amber-500/30 shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-yellow-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Créditos</h3>
              <span className="text-3xl animate-bounce">💰</span>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-yellow-400 mb-2">
                {formatarTempo(userData.creditos || 0)}
              </p>
              <p className="text-purple-200/80 text-sm">disponíveis para consultas</p>
            </div>
          </div>
        </div>

        {/* Card Leituras */}
        <div className="card-hover group relative bg-slate-800/40 backdrop-blur-lg rounded-2xl p-6 border border-blue-500/30 shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Leituras</h3>
              <span className="text-3xl animate-pulse">🔮</span>
            </div>
            <div>
              <p className="text-3xl md:text-4xl font-bold text-blue-400 mb-2">0</p>
              <p className="text-purple-200/80 text-sm">consultas realizadas</p>
            </div>
          </div>
        </div>

        {/* Card Membro desde */}
        <div className="card-hover group relative bg-slate-800/40 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/30 shadow-xl transform hover:scale-105 transition-all duration-300">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-violet-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Membro desde</h3>
              <span className="text-3xl animate-pulse">⭐</span>
            </div>
            <div>
              <p className="text-lg md:text-xl font-bold text-purple-300 mb-2">
                {userData.criadoEm.toLocaleDateString('pt-BR', { 
                  month: 'long', 
                  year: 'numeric' 
                })}
              </p>
              <p className="text-purple-200/80 text-sm">jornada espiritual iniciada</p>
            </div>
          </div>
        </div>
      </div>

      {/* Ações Rápidas Refinadas */}
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
        <h2 className="text-xl md:text-2xl font-bold gradient-text mb-6 md:mb-8">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card Tarot */}
          <Link
            href="/tarot"
            className="card-hover group flex items-center p-6 bg-slate-700/40 backdrop-blur-md hover:bg-slate-700/60 rounded-xl md:rounded-2xl border border-purple-400/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-4xl mr-4 transform group-hover:scale-110 transition-transform duration-300">🔮</span>
            <div className="relative z-10">
              <h3 className="font-semibold text-white group-hover:text-purple-300 transition-colors duration-300">
                Nova Leitura de Tarot
              </h3>
              <p className="text-purple-200/80 text-sm">
                Descubra o que o futuro reserva
              </p>
            </div>
          </Link>

          {/* Card WhatsApp */}
          <button
            onClick={() => setConsultaModalOpen(true)}
            className="card-hover group flex items-center p-6 bg-slate-700/40 backdrop-blur-md hover:bg-slate-700/60 rounded-xl md:rounded-2xl border border-green-400/30 transition-all duration-300 transform hover:scale-105 text-left w-full"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-4xl mr-4 transform group-hover:scale-110 transition-transform duration-300">💬</span>
            <div className="relative z-10">
              <h3 className="font-semibold text-white group-hover:text-green-300 transition-colors duration-300">
                Consulta com Especialista
              </h3>
              <p className="text-purple-200/80 text-sm">
                Agende via WhatsApp
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // Histórico Section Refinada
  const HistoricoSection = () => (
    <div className="space-y-8">
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-6">Histórico de Leituras</h1>
        
        <div className="text-center py-12 md:py-16">
          <div className="mb-6 transform hover:scale-105 transition-transform duration-500">
            <span className="text-6xl md:text-8xl block mb-4 animate-pulse text-purple-400">🔮</span>
          </div>
          <h3 className="text-xl md:text-2xl font-semibold text-white mb-4">
            Nenhuma leitura realizada ainda
          </h3>
          <p className="text-purple-200/80 mb-8 text-base md:text-lg max-w-md mx-auto">
            Que tal fazer sua primeira consulta aos oráculos?
          </p>
          <button
            onClick={() => setConsultaModalOpen(true)}
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold rounded-xl md:rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            <span className="mr-2 text-xl">🔮</span>
            Solicitar Consulta
          </button>
        </div>
      </div>
    </div>
  );

  // Créditos Section Refinada
  const CreditosSection = () => (
    <div className="space-y-8">
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-6 md:mb-8">Gerenciar Créditos</h1>
        
        {/* Saldo atual Refinado */}
        <div className="relative bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl p-6 md:p-8 border border-yellow-500/30 mb-8 shadow-lg">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/10 to-amber-500/10 rounded-xl md:rounded-2xl"></div>
          <div className="relative z-10 text-center">
            <p className="text-yellow-300/80 text-sm uppercase tracking-wider mb-3">Saldo Atual</p>
            <p className="text-4xl md:text-5xl font-bold text-yellow-400 mb-3 gradient-text">
              {formatarTempo(userData.creditos || 0)}
            </p>
            <p className="text-purple-200/80">em créditos disponíveis</p>
          </div>
        </div>

        {/* Ações Refinadas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Comprar Créditos */}
          <Link
            href="/creditos"
            className="card-hover group flex items-center p-6 bg-slate-700/40 backdrop-blur-md hover:bg-slate-700/60 rounded-xl md:rounded-2xl border border-green-400/30 transition-all duration-300 transform hover:scale-105"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-4xl mr-4 transform group-hover:scale-110 transition-transform duration-300">💳</span>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white group-hover:text-green-300 transition-colors duration-300 mb-1">
                Comprar Créditos
              </h3>
              <p className="text-purple-200/80 text-sm">
                Adicione tempo para suas consultas
              </p>
            </div>
          </Link>

          {/* Usar Créditos */}
          <button
            onClick={() => setConsultaModalOpen(true)}
            className="card-hover group flex items-center p-6 bg-slate-700/40 backdrop-blur-md hover:bg-slate-700/60 rounded-xl md:rounded-2xl border border-purple-400/30 transition-all duration-300 transform hover:scale-105 w-full text-left"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-indigo-500/5 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <span className="text-4xl mr-4 transform group-hover:scale-110 transition-transform duration-300">🔮</span>
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors duration-300 mb-1">
                Usar Créditos
              </h3>
              <p className="text-purple-200/80 text-sm">
                Solicite uma consulta agora
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // Configurações Section Refinada
  const ConfiguracoesSection = () => (
    <div className="space-y-8">
      <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 border border-purple-500/30 shadow-xl">
        <h1 className="text-2xl md:text-3xl font-bold gradient-text mb-6 md:mb-8">Configurações</h1>
        
        {/* Informações da conta Refinadas */}
        <div className="space-y-6">
          <div className="p-4 md:p-6 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-colors duration-300">
            <label className="block text-purple-300/80 text-sm mb-2 uppercase tracking-wider">Nome</label>
            <p className="text-white font-medium text-lg">{userData.nome}</p>
          </div>

          <div className="p-4 md:p-6 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-colors duration-300">
            <label className="block text-purple-300/80 text-sm mb-2 uppercase tracking-wider">E-mail</label>
            <p className="text-white font-medium text-lg">{user.email}</p>
          </div>

          {userData.telefone && (
            <div className="p-4 md:p-6 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-colors duration-300">
              <label className="block text-purple-300/80 text-sm mb-2 uppercase tracking-wider">Telefone</label>
              <p className="text-white font-medium text-lg">{userData.telefone}</p>
            </div>
          )}

          <div className="p-4 md:p-6 bg-slate-700/30 backdrop-blur-sm rounded-xl border border-purple-400/20 hover:border-purple-400/40 transition-colors duration-300">
            <label className="block text-purple-300/80 text-sm mb-2 uppercase tracking-wider">Membro desde</label>
            <p className="text-white font-medium text-lg">
              {userData.criadoEm.toLocaleDateString('pt-BR', { 
                day: 'numeric',
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Funcionalidades futuras Refinadas */}
        <div className="mt-8 p-6 bg-slate-700/40 backdrop-blur-md rounded-xl md:rounded-2xl border border-blue-400/30">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🔧</span>
            <h3 className="text-blue-300 font-semibold text-lg">Funcionalidades em Breve</h3>
          </div>
          <ul className="text-purple-200/80 space-y-2">
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Editar informações pessoais
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Alterar senha
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Preferências de notificação
            </li>
            <li className="flex items-center">
              <span className="w-2 h-2 bg-blue-400 rounded-full mr-3"></span>
              Tema personalizado
            </li>
          </ul>
        </div>
      </div>
    </div>
  );

  // Renderizar seção baseada no activeSection
  const renderSection = () => {
    switch (activeSection) {
      case 'historico':
        return <HistoricoSection />;
      case 'creditos':
        return <CreditosSection />;
      case 'configuracoes':
        return <ConfiguracoesSection />;
      default:
        return <OverviewSection />;
    }
  };

  return (
    <>
      {/* CSS Global Refinado (mesmo da tela de apresentação) */}
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
      `}</style>

      {/* Conteúdo Principal */}
      <div className="relative container mx-auto px-4 py-6 md:py-12 min-h-screen">
        {renderSection()}
      </div>
      
      {/* Modal de Consulta */}
      <ConsultaModal
        isOpen={consultaModalOpen}
        onClose={() => setConsultaModalOpen(false)}
        usuario={userData}
        onSucesso={() => {
          console.log('Consulta solicitada com sucesso!');
        }}
      />
    </>
  );
}