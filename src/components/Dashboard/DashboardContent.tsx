'use client';

import { useState } from 'react';
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

  // Componente para Visão Geral
  const OverviewSection = () => (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h1 className="text-2xl font-bold text-text mb-2">
          Bem-vindo, {userData.nome}! ✨
        </h1>
        <p className="text-text/70">
          Explore os mistérios do universo através dos oráculos sagrados.
        </p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card Créditos */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-accent/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">Créditos</h3>
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-3xl font-bold text-accent mb-2">
            {formatarTempo(userData.creditos || 0)}
          </p>
          <p className="text-text/60 text-sm">disponíveis para consultas</p>
        </div>

        {/* Card Leituras */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">Leituras</h3>
            <span className="text-2xl">🔮</span>
          </div>
          <p className="text-3xl font-bold text-accent mb-2">0</p>
          <p className="text-text/60 text-sm">consultas realizadas</p>
        </div>

        {/* Card Membro desde */}
        <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-text">Membro desde</h3>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-xl font-bold text-accent mb-2">
            {userData.criadoEm.toLocaleDateString('pt-BR', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
          <p className="text-text/60 text-sm">jornada espiritual iniciada</p>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h2 className="text-xl font-bold text-text mb-6">Ações Rápidas</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/tarot"
            className="flex items-center p-4 bg-accent/10 hover:bg-accent/20 rounded-xl border border-accent/30 transition-colors group"
          >
            <span className="text-3xl mr-4">🔮</span>
            <div>
              <h3 className="font-semibold text-text group-hover:text-accent">
                Nova Leitura de Tarot
              </h3>
              <p className="text-text/60 text-sm">
                Descubra o que o futuro reserva
              </p>
            </div>
          </Link>

          <button
            onClick={() => setConsultaModalOpen(true)}
            className="flex items-center p-4 bg-green-600/10 hover:bg-green-600/20 rounded-xl border border-green-500/30 transition-colors group"
          >
            <span className="text-3xl mr-4">💬</span>
            <div className="text-left">
              <h3 className="font-semibold text-text group-hover:text-green-400">
                Consulta com Especialista
              </h3>
              <p className="text-text/60 text-sm">
                Agende via WhatsApp
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // Componente para Histórico
  const HistoricoSection = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h1 className="text-2xl font-bold text-text mb-4">📋 Histórico de Leituras</h1>
        
        <div className="text-center py-12">
          <span className="text-6xl mb-4 block">🔮</span>
          <h3 className="text-xl font-semibold text-text mb-2">
            Nenhuma leitura realizada ainda
          </h3>
          <p className="text-text/60 mb-6">
            Que tal fazer sua primeira consulta aos oráculos?
          </p>
          <button
            onClick={() => setConsultaModalOpen(true)}
            className="inline-flex items-center px-6 py-3 bg-accent hover:bg-accent/80 text-dark font-semibold rounded-xl transition-colors"
          >
            🔮 Solicitar Consulta
          </button>
        </div>
      </div>
    </div>
  );

  // Componente para Créditos
  const CreditosSection = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h1 className="text-2xl font-bold text-text mb-4">💰 Gerenciar Créditos</h1>
        
        {/* Saldo atual */}
        <div className="bg-accent/10 rounded-xl p-6 border border-accent/30 mb-6">
          <div className="text-center">
            <p className="text-accent/80 text-sm uppercase tracking-wider mb-2">Saldo Atual</p>
            <p className="text-4xl font-bold text-accent mb-2">
              {formatarTempo(userData.creditos || 0)}
            </p>
            <p className="text-text/60">em créditos disponíveis</p>
          </div>
        </div>

        {/* Ações */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/creditos"
            className="flex items-center p-6 bg-green-600/10 hover:bg-green-600/20 rounded-xl border border-green-500/30 transition-colors group"
          >
            <span className="text-4xl mr-4">💳</span>
            <div>
              <h3 className="text-lg font-bold text-text group-hover:text-green-400 mb-1">
                Comprar Créditos
              </h3>
              <p className="text-text/60 text-sm">
                Adicione tempo para suas consultas
              </p>
            </div>
          </Link>

          <button
            onClick={() => setConsultaModalOpen(true)}
            className="flex items-center p-6 bg-purple-600/10 hover:bg-purple-600/20 rounded-xl border border-purple-500/30 transition-colors group"
          >
            <span className="text-4xl mr-4">🔮</span>
            <div className="text-left">
              <h3 className="text-lg font-bold text-text group-hover:text-purple-400 mb-1">
                Usar Créditos
              </h3>
              <p className="text-text/60 text-sm">
                Solicite uma consulta agora
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );

  // Componente para Configurações
  const ConfiguracoesSection = () => (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
        <h1 className="text-2xl font-bold text-text mb-6">⚙️ Configurações</h1>
        
        {/* Informações da conta */}
        <div className="space-y-4">
          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <label className="block text-text/70 text-sm mb-2">Nome</label>
            <p className="text-text font-medium">{userData.nome}</p>
          </div>

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <label className="block text-text/70 text-sm mb-2">E-mail</label>
            <p className="text-text font-medium">{user.email}</p>
          </div>

          {userData.telefone && (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <label className="block text-text/70 text-sm mb-2">Telefone</label>
              <p className="text-text font-medium">{userData.telefone}</p>
            </div>
          )}

          <div className="p-4 bg-white/5 rounded-xl border border-white/10">
            <label className="block text-text/70 text-sm mb-2">Membro desde</label>
            <p className="text-text font-medium">
              {userData.criadoEm.toLocaleDateString('pt-BR', { 
                day: 'numeric',
                month: 'long', 
                year: 'numeric' 
              })}
            </p>
          </div>
        </div>

        {/* Funcionalidades futuras */}
        <div className="mt-8 p-4 bg-accent/5 rounded-xl border border-accent/20">
          <h3 className="text-accent font-semibold mb-2">🔧 Funcionalidades em Breve</h3>
          <ul className="text-text/70 text-sm space-y-1">
            <li>• Editar informações pessoais</li>
            <li>• Alterar senha</li>
            <li>• Preferências de notificação</li>
            <li>• Tema personalizado</li>
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
    <div className="p-6">
      {renderSection()}
      
      {/* Modal de Consulta */}
      <ConsultaModal
        isOpen={consultaModalOpen}
        onClose={() => setConsultaModalOpen(false)}
        usuario={userData}
        onSucesso={() => {
          // Callback quando consulta for solicitada com sucesso
          // Aqui você pode atualizar dados, mostrar notificação, etc.
          console.log('Consulta solicitada com sucesso!');
        }}
      />
    </div>
  );
}