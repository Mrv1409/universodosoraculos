'use client';

import Link from 'next/link';

export default function ServicesPage() {
  const modalidadesConsulta = [
    {
      id: 'whatsapp',
      titulo: 'Consulta via WhatsApp',
      descricao: 'Atendimento personalizado direto no seu celular',
      icone: '📱',
      detalhes: [
        'Conversa privada com especialista',
        'Respostas em tempo real',
        'Conforto da sua casa',
        'Horários flexíveis'
      ]
    },
    {
      id: 'tempo-real',
      titulo: 'Consulta em Tempo Real',
      descricao: 'Orientação imediata quando você mais precisa',
      icone: '⚡',
      detalhes: [
        'Atendimento instantâneo',
        'Especialistas sempre online',
        'Emergências espirituais',
        'Clareza na hora certa'
      ]
    },
    {
      id: 'personalizada',
      titulo: 'Consulta Personalizada',
      descricao: 'Análise completa e detalhada da sua situação',
      icone: '🔮',
      detalhes: [
        'Análise aprofundada',
        'Relatório personalizado',
        'Múltiplas áreas da vida',
        'Plano de ação espiritual'
      ]
    }
  ];

  const processoSteps = [
    {
      numero: '1',
      titulo: 'Escolha seus Créditos',
      descricao: 'Selecione o pacote ideal para suas necessidades',
      icone: '💰'
    },
    {
      numero: '2', 
      titulo: 'Selecione o Especialista',
      descricao: 'Escolha entre nossos 4 profissionais qualificados',
      icone: '👥'
    },
    {
      numero: '3',
      titulo: 'Inicie sua Consulta',
      descricao: 'Conecte-se via WhatsApp e receba orientação',
      icone: '🔮'
    }
  ];

  // Dados temporários dos pacotes (depois movemos para Stripe)
  const pacotesCreditos = [
  {
    id: 'basico',
    nome: 'Básico',
    creditos: 30,
    preco: 50,
    precoFormatado: 'R$ 50,00',
    popular: false,
    beneficios: [
      '30 minutos de consulta',
      'Atendimento via WhatsApp',
      'Suporte prioritário',
      'Válido por 90 dias'
    ]
  },
  {
    id: 'popular',
    nome: 'Popular',
    creditos: 60,
    preco: 90,
    precoFormatado: 'R$ 90,00',
    popular: true,
    beneficios: [
      '60 minutos de consulta',
      'Atendimento via WhatsApp',
      '10% de desconto',
      'Relatório por email',
      'Válido por 120 dias'
    ]
  },
  {
    id: 'premium',
    nome: 'Premium',
    creditos: 120,
    preco: 160,
    precoFormatado: 'R$ 160,00',
    popular: false,
    beneficios: [
      '120 minutos de consulta',
      'Atendimento prioritário',
      '20% de desconto',
      'Relatório detalhado',
      'Consultoria personalizada',
      'Válido por 180 dias'
    ]
  }
];

  return (
    <>
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-900 via-indigo-900 to-violet-900 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-purple-900/30 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(138,43,226,0.3),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(147,112,219,0.4),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(186,85,211,0.4),transparent_50%)]"></div>
      </div>

      <div className="relative container mx-auto px-4 py-12 min-h-screen">
        {/* Hero Section */}
        <div className="text-center mb-20">
          <div className="mb-8">
            <span className="text-7xl block mb-6">🌟</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-8 bg-gradient-to-r from-purple-400 via-pink-300 to-purple-500 bg-clip-text text-transparent">
            Nossos Serviços
          </h1>
          <p className="text-2xl text-purple-200 max-w-4xl mx-auto leading-relaxed">
            Conecte-se com a sabedoria ancestral através de consultas personalizadas com nossos especialistas em tarô
          </p>
        </div>

        {/* Modalidades de Consulta */}
        <div className="max-w-7xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Como Atendemos Você
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modalidadesConsulta.map((modalidade) => (
              <div
                key={modalidade.id}
                className="bg-black/30 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl"
              >
                <div className="text-center mb-6">
                  <div className="text-6xl mb-4">{modalidade.icone}</div>
                  <h3 className="text-2xl font-bold text-white mb-3">{modalidade.titulo}</h3>
                  <p className="text-purple-200 text-lg">{modalidade.descricao}</p>
                </div>

                <div className="space-y-3">
                  {modalidade.detalhes.map((detalhe, index) => (
                    <div key={index} className="flex items-center text-purple-300">
                      <span className="text-green-400 mr-3 text-lg">✓</span>
                      <span>{detalhe}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Como Funciona */}
        <div className="max-w-6xl mx-auto mb-20">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Como Funciona
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {processoSteps.map((step, index) => (
              <div key={step.numero} className="text-center relative">
                {/* Linha conectora */}
                {index < processoSteps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-purple-500 to-transparent transform translate-x-8 z-0"></div>
                )}
                
                <div className="relative z-10 bg-black/40 backdrop-blur-xl rounded-3xl p-8 border border-purple-500/30 hover:border-purple-400/50 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full flex items-center justify-center text-2xl font-bold text-white mx-auto mb-6">
                    {step.numero}
                  </div>
                  
                  <div className="text-5xl mb-4">{step.icone}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{step.titulo}</h3>
                  <p className="text-purple-200">{step.descricao}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Preview dos Profissionais */}
        <div className="max-w-6xl mx-auto mb-20">
          <div className="bg-black/30 backdrop-blur-xl rounded-3xl p-12 border border-purple-500/30">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-6">Nossos Especialistas</h2>
              <p className="text-xl text-purple-200">
                 profissionais experientes prontos para orientar sua jornada espiritual
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { nome: 'Marina Celestial', especialidade: 'Amor', icone: '💕' },
                { nome: 'Gabriel Místico', especialidade: 'Carreira', icone: '🚀' },
                { nome: 'Luna Esotérica', especialidade: 'Espiritualidade', icone: '🌙' },
                { nome: 'Ricardo Vidente', especialidade: 'Geral', icone: '✨' }
              ].map((prof, index) => (
                <div key={index} className="text-center p-6 bg-purple-900/20 rounded-2xl border border-purple-500/20">
                  <div className="text-4xl mb-3">{prof.icone}</div>
                  <h4 className="font-bold text-white mb-2">{prof.nome}</h4>
                  <p className="text-purple-300 text-sm">{prof.especialidade}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/profissionais"
                className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
              >
                👥 Ver Todos os Profissionais
              </Link>
            </div>
          </div>
        </div>

        {/* Pacotes e Preços */}
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-6">Pacotes de Créditos</h2>
            <p className="text-xl text-purple-200">
              Escolha o pacote ideal para suas consultas
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {pacotesCreditos.map((pacote) => (
              <div
                key={pacote.id}
                className={`bg-black/30 backdrop-blur-xl rounded-3xl p-8 border-2 transition-all duration-300 hover:transform hover:scale-105 ${
                  pacote.popular 
                    ? 'border-yellow-400/50 shadow-yellow-400/20 shadow-2xl' 
                    : 'border-purple-500/30'
                }`}
              >
                {pacote.popular && (
                  <div className="text-center mb-6">
                    <div className="inline-block bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-4 py-2 rounded-full text-sm font-bold">
                      ⭐ MAIS POPULAR
                    </div>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-3">{pacote.nome}</h3>
                  <div className="text-4xl font-bold text-yellow-400 mb-2">
                    {pacote.precoFormatado}
                  </div>
                  <p className="text-purple-300">
                    {pacote.creditos} minutos de consulta
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {pacote.beneficios.map((beneficio, index) => (
                    <div key={index} className="flex items-center text-purple-200">
                      <span className="text-green-400 mr-3">✓</span>
                      <span className="text-sm">{beneficio}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* CTA para Créditos */}
          <div className="text-center">
            <Link
              href="/creditos"
              className="inline-flex items-center px-12 py-6 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold text-xl rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-2xl"
            >
              💰 Comprar Créditos Agora
            </Link>
            <p className="text-purple-300 mt-4 text-sm">
              Pagamento seguro via cartão ou PIX
            </p>
          </div>
        </div>
      </div>
    </>
  );
}