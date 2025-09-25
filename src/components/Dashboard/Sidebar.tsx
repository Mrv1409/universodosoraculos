'use client';

import { User } from 'firebase/auth';
import { Usuario } from '@/types';
import { formatarTempo } from '@/lib/utils';
import { sairUsuario } from '@/hooks/auth';
import { useRouter } from 'next/navigation';

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
      {/* Sidebar */}
      <div className={`
        fixed top-0 left-0 h-full w-64 bg-dark/90 backdrop-blur-sm border-r border-white/10 z-50 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        {/* Header da Sidebar */}
        <div className="p-6 border-b border-white/10">
          {/* Botão fechar (mobile) */}
          <div className="lg:hidden flex justify-end mb-4">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-text/60 hover:text-text hover:bg-white/10 transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Logo */}
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-accent">🔮 Universo dos Oráculos</h2>
          </div>

          {/* Informações do usuário */}
          <div className="text-center p-4 bg-white/5 rounded-xl border border-white/10">
            <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
              👤
            </div>
            <h3 className="text-text font-medium mb-1 truncate">{userData.nome}</h3>
            <p className="text-text/60 text-sm truncate mb-3">{user.email}</p>
            
            {/* Créditos */}
            <div className="bg-accent/10 rounded-lg p-3 border border-accent/20">
              <p className="text-accent font-bold text-lg">
                💰 {formatarTempo(userData.creditos || 0)}
              </p>
              <p className="text-text/60 text-xs">créditos disponíveis</p>
            </div>
          </div>
        </div>

        {/* Menu de navegação */}
        <nav className="p-4">
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
                    onClose(); // Fechar sidebar no mobile
                  }}
                  className={`
                    w-full flex items-center px-4 py-3 rounded-xl transition-colors text-left
                    ${activeSection === item.id 
                      ? 'bg-accent text-dark font-medium' 
                      : 'text-text hover:bg-white/10 hover:text-accent'
                    }
                  `}
                >
                  <span className="mr-3 text-lg">{item.icon}</span>
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Footer da Sidebar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <span className="mr-3 text-lg">🚪</span>
            Sair
          </button>
        </div>
      </div>
    </>
  );
}