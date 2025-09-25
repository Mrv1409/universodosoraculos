'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from '@/hooks/useAuthState';
import { pacotesCreditos, PacoteCredito } from '@/data/pacotes-creditos';
import { formatarTempo } from '@/lib/utils';

export default function CreditosPage() {
  const { user, userData, loading } = useAuthState();
  const [processandoPagamento, setProcessandoPagamento] = useState<string | null>(null);
  const router = useRouter();

  // Redirecionar se não estiver logado
  if (!loading && !user) {
    router.push('/login');
    return null;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-text/80">Carregando...</p>
        </div>
      </div>
    );
  }

  const handleComprarCreditos = async (pacote: PacoteCredito) => {
    if (!user) {
      router.push('/login');
      return;
    }

    setProcessandoPagamento(pacote.id);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          pacoteId: pacote.id,
          userId: user.uid,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao processar pagamento');
      }

      const { url } = await response.json();
      
      // Redirecionar para o Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error('Erro no checkout:', error);
      alert('Erro ao processar pagamento. Tente novamente.');
      setProcessandoPagamento(null);
    }
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
            <span className="text-6xl block mb-4">💰</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500 bg-clip-text text-transparent">
            Créditos para Consultas
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-3xl mx-auto">
            Escolha o pacote ideal e conecte-se com nossos especialistas em tarô via WhatsApp
          </p>
          
          {userData && (
            <div className="bg-black/30 backdrop-blur-xl rounded-2xl p-6 max-w-md mx-auto border border-purple-500/30">
              <p className="text-purple-300 mb-2">Seu saldo atual:</p>
              <p className="text-4xl font-bold text-yellow-400">
                {formatarTempo(userData.creditos || 0)}
              </p>
            </div>
          )}
        </div>

        {/* Pacotes de Créditos */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {pacotesCreditos.map((pacote) => (
              <div
                key={pacote.id}
                className={`relative bg-black/30 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl ${
                  pacote.popular 
                    ? 'border-yellow-400/50 shadow-yellow-400/20 shadow-2xl' 
                    : 'border-purple-500/30 hover:border-purple-400/50'
                }`}
              >
                {/* Badge Popular */}
                {pacote.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-6 py-2 rounded-full text-sm font-bold">
                      ⭐ MAIS POPULAR
                    </div>
                  </div>
                )}

                {/* Header do Pacote */}
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">{pacote.nome}</h3>
                  <p className="text-purple-300 text-sm mb-4">{pacote.descricao}</p>
                  
                  {/* Preço */}
                  <div className="mb-6">
                    <span className="text-5xl font-bold text-yellow-400">
                      {pacote.precoFormatado}
                    </span>
                    <p className="text-purple-300 text-sm mt-2">
                      {formatarTempo(pacote.creditos)} de consulta
                    </p>
                  </div>
                </div>

                {/* Benefícios */}
                <div className="mb-8">
                  <ul className="space-y-3">
                    {pacote.beneficios.map((beneficio, index) => (
                      <li key={index} className="flex items-center text-purple-200">
                        <span className="text-green-400 mr-3">✓</span>
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Botão de Compra */}
                <button
                  onClick={() => handleComprarCreditos(pacote)}
                  disabled={processandoPagamento === pacote.id}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 ${
                    pacote.popular
                      ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 text-black'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white'
                  } ${processandoPagamento === pacote.id ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {processandoPagamento === pacote.id ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processando...
                    </span>
                  ) : (
                    `Comprar ${formatarTempo(pacote.creditos)}`
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Informações Adicionais */}
        <div className="mt-20 max-w-4xl mx-auto">
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30">
            <h2 className="text-3xl font-bold text-center text-white mb-8">
              Como Funciona? 🤔
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-4xl mb-4">💳</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">1. Escolha seu Pacote</h3>
                <p className="text-purple-200">
                  Selecione o pacote de créditos ideal para suas necessidades
                </p>
              </div>
              
              <div>
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">2. Pagamento Seguro</h3>
                <p className="text-purple-200">
                  Pague com cartão ou PIX através do sistema seguro do Stripe
                </p>
              </div>
              
              <div>
                <div className="text-4xl mb-4">📱</div>
                <h3 className="text-xl font-bold text-yellow-400 mb-3">3. Consulta via WhatsApp</h3>
                <p className="text-purple-200">
                  Seus créditos ficarão disponíveis para usar com nossos especialistas
                </p>
              </div>
            </div>
          </div>

          {/* Garantias */}
          <div className="mt-12 bg-green-900/20 backdrop-blur-xl rounded-3xl p-8 border border-green-500/30">
            <h3 className="text-2xl font-bold text-center text-green-400 mb-6">
              🛡️ Garantias e Segurança
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-green-200">
              <div className="flex items-center">
                <span className="text-green-400 mr-3 text-xl">🔒</span>
                Pagamentos 100% seguros via Stripe
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3 text-xl">💯</span>
                Satisfação garantida ou reembolso
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3 text-xl">⏱️</span>
                Créditos com validade estendida
              </div>
              <div className="flex items-center">
                <span className="text-green-400 mr-3 text-xl">📞</span>
                Suporte 24/7 via WhatsApp
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}