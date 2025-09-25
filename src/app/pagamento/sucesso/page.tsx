/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuthState } from '@/hooks/useAuthState';
import { formatarTempo } from '@/lib/utils';
import { Suspense } from 'react';

// Componente que usa useSearchParams - deve estar dentro de Suspense
function SucessoPagamentoContent() {
  const { userData } = useAuthState();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [verificandoPagamento, setVerificandoPagamento] = useState(true);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    if (!sessionId) {
      router.push('/creditos');
      return;
    }

    // Simular verificação do pagamento
    // Na prática, o webhook já processou o pagamento
    const timer = setTimeout(() => {
      setVerificandoPagamento(false);
      setPagamentoConfirmado(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [sessionId, router]);

  if (verificandoPagamento) {
    return (
      <>
        {/* Background */}
        <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-900 -z-10">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-purple-900/30 to-transparent"></div>
        </div>

        <div className="relative min-h-screen flex items-center justify-center px-4">
          <div className="text-center">
            <div className="mb-8">
              <div className="animate-spin rounded-full h-20 w-20 border-4 border-yellow-400 border-t-transparent mx-auto mb-6"></div>
              <span className="text-6xl block mb-4">⏳</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Confirmando seu Pagamento...
            </h1>
            <p className="text-xl text-purple-200 mb-8">
              Aguarde enquanto processamos sua compra de créditos
            </p>
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 max-w-md mx-auto border border-purple-500/30">
              <p className="text-purple-300">Isso pode levar alguns segundos...</p>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-green-900 via-emerald-900 to-teal-900 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-green-900/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(34,197,94,0.3),transparent_50%)]"></div>
      </div>

      <div className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-2xl mx-auto text-center">
          {/* Animação de Sucesso */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <span className="text-4xl text-white">✓</span>
            </div>
            <span className="text-8xl block mb-4">🎉</span>
          </div>

          {/* Mensagem de Sucesso */}
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-green-400 via-emerald-300 to-teal-400 bg-clip-text text-transparent">
            Pagamento Aprovado!
          </h1>

          <p className="text-xl text-green-200 mb-8">
            Parabéns! Seus créditos foram adicionados à sua conta com sucesso.
          </p>

          {/* Card de Confirmação */}
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-green-500/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Saldo Atual */}
              <div className="text-center">
                <h3 className="text-green-400 font-semibold mb-2">Seu Saldo Atual</h3>
                <p className="text-4xl font-bold text-white">
                  {userData ? formatarTempo(userData.creditos || 0) : '...'}
                </p>
                <p className="text-green-200 text-sm mt-1">créditos disponíveis</p>
              </div>

              {/* Status */}
              <div className="text-center">
                <h3 className="text-green-400 font-semibold mb-2">Status</h3>
                <div className="flex items-center justify-center">
                  <span className="w-3 h-3 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  <span className="text-white font-medium">Ativo</span>
                </div>
                <p className="text-green-200 text-sm mt-1">pronto para usar</p>
              </div>
            </div>
          </div>

          {/* Próximos Passos */}
          <div className="bg-black/20 backdrop-blur-xl rounded-3xl p-8 mb-8 border border-green-500/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              🚀 Próximos Passos
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <div className="text-3xl mb-3">📋</div>
                <h3 className="text-green-400 font-semibold mb-2">1. Vá ao Dashboard</h3>
                <p className="text-green-200 text-sm">
                  Acesse sua conta para gerenciar seus créditos
                </p>
              </div>
              
              <div>
                <div className="text-3xl mb-3">🔮</div>
                <h3 className="text-green-400 font-semibold mb-2">2. Solicite Consulta</h3>
                <p className="text-green-200 text-sm">
                  Escolha seu especialista e agende sua sessão
                </p>
              </div>
              
              <div>
                <div className="text-3xl mb-3">📱</div>
                <h3 className="text-green-400 font-semibold mb-2">3. Consulta via WhatsApp</h3>
                <p className="text-green-200 text-sm">
                  Receba orientação diretamente no seu celular
                </p>
              </div>
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/dashboard"
              className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🏠 Ir para Dashboard
            </Link>
            
            <Link
              href="/services"
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              🔮 Solicitar Consulta
            </Link>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-12 text-center">
            <p className="text-green-300 text-sm mb-4">
              Você receberá um email de confirmação em breve
            </p>
            <p className="text-green-400 text-xs">
              Session ID: {sessionId}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

// Componente principal que envolve com Suspense
export default function SucessoPagamento() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-400 border-t-transparent mx-auto mb-4"></div>
          <p className="text-purple-200">Carregando...</p>
        </div>
      </div>
    }>
      <SucessoPagamentoContent />
    </Suspense>
  );
}