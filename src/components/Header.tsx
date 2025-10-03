'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { sairUsuario } from '@/hooks/auth';
import { formatarTempo } from '@/lib/utils';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, userData, loading } = useAuthState();

  // Partículas místicas no header
  useEffect(() => {
    const createParticle = () => {
      if (window.innerWidth < 768) return; // Apenas no desktop
      
      const particle = document.createElement('div');
      particle.className = 'header-particle';
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(147, 112, 219, 0.4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        top: ${Math.random() * 80}px;
        left: ${Math.random() * 100}vw;
        animation: floatHeader ${6 + Math.random() * 8}s linear infinite;
      `;
      document.querySelector('header')?.appendChild(particle);
      
      setTimeout(() => particle.remove(), 14000);
    };

    const interval = setInterval(createParticle, 400);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    try {
      await sairUsuario();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (loading) {
    return (
      <header className="bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 border-b border-purple-500/30 shadow-2xl relative overflow-hidden">
        <div className="container mx-auto px-4 py-4">
          <div className="animate-pulse bg-purple-700/20 rounded h-8 w-48"></div>
        </div>
      </header>
    );
  }

  return (
    <>
      <style jsx global>{`
        @keyframes floatHeader {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.6;
          }
          90% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(-80px) translateX(20px);
            opacity: 0;
          }
        }
        
        @keyframes headerGlow {
          0%, 100% {
            box-shadow: 0 4px 20px rgba(147, 112, 219, 0.2);
          }
          50% {
            box-shadow: 0 4px 30px rgba(147, 112, 219, 0.3);
          }
        }
        
        .header-hover {
          transition: all 0.3s ease;
        }
        
        .header-hover:hover {
          transform: translateY(-1px);
        }
      `}</style>

      <header className="bg-gradient-to-br from-slate-900 via-purple-900/50 to-slate-900 border-b border-purple-500/30 shadow-2xl backdrop-blur-lg relative overflow-hidden">
        {/* Efeito de brilho sutil */}
        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5"></div>
        
        <div className="container mx-auto px-4 py-3 relative z-10">
          <div className="flex justify-between items-center">
            {/* Logo com efeito idêntico à página principal */}
            <Link 
              href="/" 
              className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 header-hover"
            >
              <span className="text-2xl">🔮</span> Universo dos Oráculos
            </Link>

            {/* Menu Desktop - Estilo consistente */}
            <nav className="hidden md:flex space-x-4 lg:space-x-6 items-center">
              <Link 
                href="/" 
                className="text-purple-100/90 hover:text-white transition-all duration-300 header-hover font-medium px-3 py-2 rounded-lg hover:bg-purple-500/10 border border-transparent hover:border-purple-400/20"
              >
                Início
              </Link>
              <Link 
                href="/profissionais" 
                className="text-purple-100/90 hover:text-white transition-all duration-300 header-hover font-medium px-3 py-2 rounded-lg hover:bg-purple-500/10 border border-transparent hover:border-purple-400/20"
              >
                Profissionais
              </Link>
              <Link 
                href="/services" 
                className="text-purple-100/90 hover:text-white transition-all duration-300 header-hover font-medium px-3 py-2 rounded-lg hover:bg-purple-500/10 border border-transparent hover:border-purple-400/20"
              >
                Serviços
              </Link>
              
              {user ? (
                // Menu usuário logado - Cores alinhadas
                <>
                  <Link 
                    href="/dashboard" 
                    className="text-purple-100/90 hover:text-white transition-all duration-300 header-hover font-medium px-3 py-2 rounded-lg hover:bg-purple-500/10 border border-transparent hover:border-purple-400/20"
                  >
                    Minha Conta
                  </Link>
                  <div className="bg-gradient-to-r from-yellow-600/30 to-amber-600/20 px-4 py-2 rounded-lg border border-yellow-500/30 text-yellow-300 font-medium shadow-lg header-hover">
                    💰 {userData?.creditos ? formatarTempo(userData.creditos) : '0min'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-600/90 to-pink-600/90 hover:from-red-500/90 hover:to-pink-500/90 text-white px-4 py-2 rounded-lg transition-all duration-300 font-medium shadow-lg header-hover border border-red-400/30"
                  >
                    Sair
                  </button>
                </>
              ) : (
                // Menu usuário não logado - Botão alinhado
                <Link 
                  href="/login" 
                  className="bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500/90 hover:to-indigo-500/90 text-white px-5 py-2.5 rounded-lg transition-all duration-300 font-medium shadow-lg header-hover border border-purple-400/30"
                >
                  Entrar
                </Link>
              )}
            </nav>

            {/* Botão Menu Mobile - Estilizado */}
            <button
              className="md:hidden p-2.5 rounded-lg bg-purple-600/30 hover:bg-purple-500/40 transition-all duration-300 header-hover border border-purple-400/20"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-5 h-5 text-purple-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Menu Mobile - Design consistente */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 space-y-2 bg-slate-800/80 backdrop-blur-xl rounded-xl p-4 border border-purple-500/30 shadow-2xl animate-in slide-in-from-top-4">
              <Link 
                href="/" 
                className="block py-3 px-4 text-purple-100 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-300 font-medium border border-transparent hover:border-purple-400/20"
                onClick={() => setIsMenuOpen(false)}
              >
                🌟 Início
              </Link>
              <Link 
                href="/profissionais" 
                className="block py-3 px-4 text-purple-100 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-300 font-medium border border-transparent hover:border-purple-400/20"
                onClick={() => setIsMenuOpen(false)}
              >
                👥 Profissionais
              </Link>
              <Link 
                href="/services" 
                className="block py-3 px-4 text-purple-100 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-300 font-medium border border-transparent hover:border-purple-400/20"
                onClick={() => setIsMenuOpen(false)}
              >
                🔮 Serviços
              </Link>
              
              {user ? (
                <>
                  <Link 
                    href="/dashboard" 
                    className="block py-3 px-4 text-purple-100 hover:text-white hover:bg-purple-500/20 rounded-lg transition-all duration-300 font-medium border border-transparent hover:border-purple-400/20"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    💼 Minha Conta
                  </Link>
                  <div className="block py-3 px-4 bg-gradient-to-r from-yellow-600/30 to-amber-600/20 rounded-lg border border-yellow-500/30 text-yellow-300 font-medium">
                    💰 {userData?.creditos ? formatarTempo(userData.creditos) : '0min'}
                  </div>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left py-3 px-4 text-red-300 hover:text-red-200 hover:bg-red-600/20 rounded-lg transition-all duration-300 font-medium border border-transparent hover:border-red-400/20"
                  >
                    🚪 Sair
                  </button>
                </>
              ) : (
                <Link 
                  href="/login" 
                  className="block py-3 px-4 bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500/90 hover:to-indigo-500/90 text-white rounded-lg transition-all duration-300 font-medium text-center border border-purple-400/30"
                  onClick={() => setIsMenuOpen(false)}
                >
                  🔑 Entrar
                </Link>
              )}
            </nav>
          )}
        </div>
      </header>
    </>
  );
}