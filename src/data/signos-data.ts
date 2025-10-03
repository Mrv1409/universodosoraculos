// src/data/signos-data.ts

export type Signo = {
    id: string;
    nome: string;
    emoji: string;
    dataInicio: string;
    dataFim: string;
    elemento: 'fogo' | 'terra' | 'ar' | 'agua';
    corElemento: string;
    previsao: string;
    caracteristicas: string[];
  };
  
  export const signosData: Signo[] = [
    {
      id: 'aries',
      nome: 'Áries',
      emoji: '♈',
      dataInicio: '21/03',
      dataFim: '19/04',
      elemento: 'fogo',
      corElemento: 'from-red-500/20 to-orange-500/20',
      previsao: '🔥 Dia de muita energia e iniciativa! O universo apoia seus novos projetos. Hora de tomar a frente em situações importantes.',
      caracteristicas: ['Corajoso', 'Determinado', 'Pioneiro']
    },
    {
      id: 'touro',
      nome: 'Touro',
      emoji: '♉',
      dataInicio: '20/04',
      dataFim: '20/05',
      elemento: 'terra',
      corElemento: 'from-emerald-500/20 to-green-600/20',
      previsao: '💎 Momento de estabilidade e segurança. Invista em relações sólidas e cuide do seu bem-estar financeiro.',
      caracteristicas: ['Prático', 'Confiável', 'Sensual']
    },
    {
      id: 'gemeos',
      nome: 'Gêmeos',
      emoji: '♊',
      dataInicio: '21/05',
      dataFim: '20/06',
      elemento: 'ar',
      corElemento: 'from-yellow-500/20 to-amber-500/20',
      previsao: '💬 Comunicação em alta! Networking pode trazer oportunidades incríveis. Expresse suas ideias com confiança.',
      caracteristicas: ['Comunicativo', 'Curioso', 'Adaptável']
    },
    {
      id: 'cancer',
      nome: 'Câncer',
      emoji: '♋',
      dataInicio: '21/06',
      dataFim: '22/07',
      elemento: 'agua',
      corElemento: 'from-blue-500/20 to-cyan-500/20',
      previsao: '🌙 Emoções em destaque. Perfeito para cuidar de relações familiares e seguir sua intuição em decisões importantes.',
      caracteristicas: ['Sensível', 'Protetor', 'Intuitivo']
    },
    {
      id: 'leao',
      nome: 'Leão',
      emoji: '♌',
      dataInicio: '23/07',
      dataFim: '22/08',
      elemento: 'fogo',
      corElemento: 'from-amber-500/20 to-orange-500/20',
      previsao: '👑 Sua criatividade está em alta! Hora de brilhar e mostrar seus talentos. Amor pode trazer surpresas agradáveis.',
      caracteristicas: ['Criativo', 'Generoso', 'Líder']
    },
    {
      id: 'virgem',
      nome: 'Virgem',
      emoji: '♍',
      dataInicio: '23/08',
      dataFim: '22/09',
      elemento: 'terra',
      corElemento: 'from-lime-500/20 to-green-500/20',
      previsao: '📊 Organização trará resultados excelentes. Momento ideal para planejar o futuro e cuidar da saúde.',
      caracteristicas: ['Analítico', 'Organizado', 'Servicial']
    },
    {
      id: 'libra',
      nome: 'Libra',
      emoji: '♎',
      dataInicio: '23/09',
      dataFim: '22/10',
      elemento: 'ar',
      corElemento: 'from-pink-500/20 to-rose-500/20',
      previsao: '⚖️ Harmonia nas relações é seu foco. Decisões importantes devem ser tomadas com equilíbrio e diplomacia.',
      caracteristicas: ['Diplomata', 'Justo', 'Social']
    },
    {
      id: 'escorpiao',
      nome: 'Escorpião',
      emoji: '♏',
      dataInicio: '23/10',
      dataFim: '21/11',
      elemento: 'agua',
      corElemento: 'from-purple-500/20 to-violet-600/20',
      previsao: '💫 Transformação em andamento. Confie nos processos de mudança - grandes revelações podem acontecer.',
      caracteristicas: ['Intenso', 'Passional', 'Misterioso']
    },
    {
      id: 'sagitario',
      nome: 'Sagitário',
      emoji: '♐',
      dataInicio: '22/11',
      dataFim: '21/12',
      elemento: 'fogo',
      corElemento: 'from-purple-500/20 to-indigo-500/20',
      previsao: '🌠 Aventuras e aprendizado te aguardam. Ótimo momento para expandir horizontes e buscar conhecimento.',
      caracteristicas: ['Otimista', 'Aventureiro', 'Filósofo']
    },
    {
      id: 'capricornio',
      nome: 'Capricórnio',
      emoji: '♑',
      dataInicio: '22/12',
      dataFim: '19/01',
      elemento: 'terra',
      corElemento: 'from-gray-500/20 to-slate-600/20',
      previsao: '🏔️ Foco em metas de longo prazo trará recompensas. Sua disciplina será reconhecida profissionalmente.',
      caracteristicas: ['Ambicioso', 'Disciplinado', 'Responsável']
    },
    {
      id: 'aquario',
      nome: 'Aquário',
      emoji: '♒',
      dataInicio: '20/01',
      dataFim: '18/02',
      elemento: 'ar',
      corElemento: 'from-cyan-500/20 to-blue-500/20',
      previsao: '💡 Ideias revolucionárias surgem! Conecte-se com grupos que compartilham seus ideais e visões de futuro.',
      caracteristicas: ['Inovador', 'Humanitário', 'Intelectual']
    },
    {
      id: 'peixes',
      nome: 'Peixes',
      emoji: '♓',
      dataInicio: '19/02',
      dataFim: '20/03',
      elemento: 'agua',
      corElemento: 'from-indigo-500/20 to-purple-500/20',
      previsao: '🌊 Intuição muito forte hoje. Arte e espiritualidade podem trazer respostas que a razão não encontra.',
      caracteristicas: ['Sensível', 'Artístico', 'Espiritual']
    }
  ];
  
  // Função auxiliar para encontrar signo por data
  export function encontrarSignoPorData(dia: number, mes: number): Signo | null {
    const data = `${dia.toString().padStart(2, '0')}/${mes.toString().padStart(2, '0')}`;
    
    for (const signo of signosData) {
      if (data >= signo.dataInicio || data <= signo.dataFim) {
        return signo;
      }
    }
    
    return null;
  }
  
  // Função para obter elemento em português
  export function getElementoNome(elemento: string): string {
    const elementos: { [key: string]: string } = {
      'fogo': '🔥 Fogo',
      'terra': '🌿 Terra', 
      'ar': '💨 Ar',
      'agua': '💧 Água'
    };
    return elementos[elemento] || elemento;
  }