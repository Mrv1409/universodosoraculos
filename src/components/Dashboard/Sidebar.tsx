'use client';

import { User } from 'firebase/auth';
import { Usuario } from '@/types';
import { formatarTempo } from '@/lib/utils';
import { sairUsuario } from '@/hooks/auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface SidebarProps {
  user: User;
  userData: Usuario;
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ 
  user, 
  userData, 
  isOpen, 
  onClose, 
  activeSection, 
  onSectionChange 
}: SidebarProps) {
  const router = useRouter();

  // Efeito de partículas sutis no sidebar
  useEffect(() => {
    const createParticle = () => {
      if (window.innerWidth < 1024) return; // Apenas no desktop
      
      const particle = document.createElement('div');
      particle.className = 'sidebar-particle';
      particle.style.cssText = `
        position: absolute;
        width: 1px;
        height: 1px;
        background: rgba(147, 112, 219, 0.2);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        top: ${Math.random() * 100}%;
        left: ${Math.random() * 100}%;
        animation: floatSidebar ${12 + Math.random() * 15}s linear infinite;
      `;
      document.querySelector('.sidebar-container')?.appendChild(particle);
      
      setTimeout(() => particle.remove(), 27000);
    };

    const interval = setInterval(createParticle, 1000);
    return () => clearInterval(interval);
  }, []);

  const menuItems = [
    { id: 'overview', label: 'Visão Geral', icon: '🏠' },
    { id: 'nova-leitura', label: 'Nova Leitura', icon: '🔮' },
    { id: 'historico', label: 'Histórico', icon: '📋' },
    { id: 'creditos', label: 'Créditos', icon: '💰' },
    { id: 'configuracoes', label: 'Configurações', icon: '⚙️' },
  ];

  const handleLogout = async () => {
    try {
      await sairUsuario();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleNovaLeitura = () => {
    router.push('/tarot');
  };

  return (
    <>
      <style jsx global>{`
        @keyframes floatSidebar {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.2;
          }
          90% {
            opacity: 0.2;
          }
          100% {
            transform: translateY(-80px) translateX(20px);
            opacity: 0;
          }
        }
        
        .sidebar-item {
          transition: all 0.3s ease;
        }
        
        .sidebar-item:hover {
          transform: translateX(4px);
        }
      `}</style>

      {/* Overlay para mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div className={`
        sidebar-container fixed top-0 left-0 h-full w-64 bg-gradient-to-br from-slate-900/95 via-purple-900/80 to-slate-900/95 backdrop-blur-xl border-r border-purple-500/30 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-purple-500/20">
          {/* Botão fechar (mobile) */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-purple-200 hover:text-white hover:bg-purple-500/20 transition-all duration-300 sidebar-item"
            >
              ✕
            </button>
          </div>

          {/* Informações do usuário */}
          <div className="text-center p-4 bg-slate-800/40 rounded-xl border border-purple-500/30 shadow-lg backdrop-blur-sm">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl shadow-lg">
              👤
            </div>
            <h3 className="text-white font-medium mb-1 truncate text-sm">{userData.nome}</h3>
            <p className="text-purple-200/80 text-xs truncate mb-3">{user.email}</p>
            
            {/* Créditos - Harmonizado */}
            <div className="bg-gradient-to-br from-yellow-600/30 to-amber-600/20 rounded-lg p-3 border border-yellow-500/30 shadow-lg">
              <p className="text-yellow-300 font-bold text-lg">
                💰 {formatarTempo(userData.creditos || 0)}
              </p>
              <p className="text-yellow-200/70 text-xs">créditos disponíveis</p>
            </div>
          </div>
        </div>

        {/* Menu de navegação */}
        <nav className="p-4 flex-1">
          <ul className="space-y-2">
            {menuItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.id === 'nova-leitura') {
                      handleNovaLeitura();
                    } else {
                      onSectionChange(item.id);
                    }
                    onClose();
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-xl transition-all duration-300 text-left group sidebar-item
                    ${activeSection === item.id 
                      ? 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 text-white shadow-lg transform scale-[1.02] border border-purple-400/50' 
                      : 'text-purple-200/90 hover:bg-purple-500/20 hover:text-white hover:border-purple-400/30 border border-transparent'
                    }
                  `}
                >
                  <span className={`
                    mr-3 text-lg transition-transform duration-300
                    ${activeSection === item.id ? 'scale-110' : 'group-hover:scale-110'}
                  `}>
                    {item.icon}
                  </span>
                  <span className="font-medium text-sm">{item.label}</span>
                  
                  {/* Indicador de item ativo */}
                  {activeSection === item.id && (
                    <div className="ml-auto w-2 h-2 bg-yellow-400 rounded-full animate-pulse shadow-lg" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer da Sidebar */}
        <div className="p-4 border-t border-purple-500/20">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-300 hover:text-red-200 hover:bg-red-500/20 border border-transparent hover:border-red-400/30 transition-all duration-300 sidebar-item group"
          >
            <span className="mr-3 text-lg group-hover:scale-110 transition-transform">🚪</span>
            <span className="font-medium text-sm">Sair da Jornada</span>
          </button>
        </div>
      </div>
    </>
  );
}