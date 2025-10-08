'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/hooks/useAuthState';
import Sidebar from '@/components/Dashboard/Sidebar';
import DashboardContent from '@/components/Dashboard/DashboardContent';

export default function DashboardPage() {
  const { user, userData, loading } = useAuthState();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Efeito de partículas no dashboard
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'dashboard-particle';
      particle.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: rgba(147, 112, 219, 0.3);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        top: ${Math.random() * 100}vh;
        left: ${Math.random() * 100}vw;
        animation: floatDashboard ${10 + Math.random() * 12}s linear infinite;
      `;
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 22000);
    };

    const interval = setInterval(createParticle, 600);
    return () => clearInterval(interval);
  }, []);

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Loading state harmonizado
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-purple-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,112,219,0.15),transparent_50%)]"></div>
        
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400 mx-auto mb-6"></div>
          <p className="text-purple-200/80 text-lg">Conectando com as energias cósmicas...</p>
        </div>
      </div>
    );
  }

  // Não renderizar se não tiver usuário
  if (!user || !userData) {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        @keyframes floatDashboard {
          0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
          }
        }
      `}</style>

      {/* BACKGROUND IDÊNTICO À HOMEPAGE */}
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-purple-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,112,219,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(106,90,205,0.1),transparent_50%)]"></div>

        <div className="flex relative z-10">
          {/* Sidebar */}
          <Sidebar
            user={user}
            userData={userData}
            isOpen={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />

          {/* Main Content */}
          <div className="flex-1 lg:ml-64 min-h-screen">
            {/* Header Mobile Harmonizado */}
            <div className="lg:hidden bg-slate-800/70 border-b border-purple-500/30 p-4">
              <div className="flex items-center justify-between">
                <h1 className="text-xl font-bold text-white flex items-center">
                  <span className="text-2xl mr-2">🌌</span>
                  Dashboard
                </h1>
                <button
                  onClick={() => setSidebarOpen(true)}
                  className="p-2.5 rounded-lg bg-purple-600/30 text-purple-200 hover:bg-purple-500/40 transition-all duration-300 border border-purple-400/20"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Dashboard Content */}
            <DashboardContent
              user={user}
              userData={userData}
              activeSection={activeSection}
            />
          </div>
        </div>

        {/* Overlay para mobile harmonizado */}
        {sidebarOpen && (
          <div
            className="lg:hidden fixed inset-0 bg-black/20 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </div>
    </>
  );
}