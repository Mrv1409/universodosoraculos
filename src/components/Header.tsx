'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { sairUsuario } from '@/hooks/auth';
import { formatarTempo } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData, loading } = useAuthState();

  const handleLogout = async () => {
    try {
      await sairUsuario();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <header className="bg-dark text-text shadow-lg">
        <div className="container mx-auto px-4 py-4">
          <div className="animate-pulse">Carregando...</div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-dark text-text shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold text-accent">
            🔮 Universo dos Oráculos
          </Link>

          {/* Menu Desktop */}
          <nav className="hidden md:flex space-x-6 items-center">
            <Link href="/" className="hover:text-accent transition-colors">
              Início
            </Link>
            <Link href="/profissionais" className="hover:text-accent transition-colors">
              Profissionais
            </Link>
            <Link href="/services" className="hover:text-accent transition-colors">
              Serviços
            </Link>
            
            {user ? (
              // Menu usuário logado
              <>
                <Link href="/dashboard" className="hover:text-accent transition-colors">
                  Minha Conta
                </Link>
                <div className="text-accent font-medium">
                  💰 {userData?.creditos ? formatarTempo(userData.creditos) : '0min'}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-text px-4 py-2 rounded-lg transition-colors font-medium"
                >
                  Sair
                </button>
              </>
            ) : (
              // Menu usuário não logado
              <Link 
                href="/login" 
                className="bg-accent hover:bg-accent/80 text-dark px-4 py-2 rounded-lg transition-colors font-medium"
              >
                Entrar
              </Link>
            )}
          </nav>

          {/* Botão Menu Mobile */}
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Menu Mobile */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <Link href="/" className="block py-2 hover:text-accent transition-colors">
              Início
            </Link>
            <Link href="/profissionais" className="block py-2 hover:text-accent transition-colors">
              Profissionais
            </Link>
            <Link href="/services" className="block py-2 hover:text-accent transition-colors">
              Serviços
            </Link>
            
            {user ? (
              <>
                <Link href="/dashboard" className="block py-2 hover:text-accent transition-colors">
                  Minha Conta
                </Link>
                <div className="block py-2 text-accent font-medium">
                  💰 {userData?.creditos ? formatarTempo(userData.creditos) : '0min'}
                </div>
                <button
                  onClick={handleLogout}
                  className="block py-2 text-red-400 hover:text-red-300 transition-colors"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link href="/login" className="block py-2 hover:text-accent transition-colors">
                Entrar
              </Link>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}