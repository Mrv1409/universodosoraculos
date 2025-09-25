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

  // Redirecionar se não estiver logado
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text/80">Carregando seu dashboard...</p>
        </div>
      </div>
    );
  }

  // Não renderizar se não tiver usuário
  if (!user || !userData) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-secondary to-primary">
      <div className="flex">
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
        <div className="flex-1 lg:ml-64">
          {/* Header Mobile */}
          <div className="lg:hidden bg-dark/50 backdrop-blur-sm border-b border-white/10 p-4">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-accent">Dashboard</h1>
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-lg bg-white/10 text-text hover:bg-white/20 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

      {/* Overlay para mobile quando sidebar estiver aberta */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}