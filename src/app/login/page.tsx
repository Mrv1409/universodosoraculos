/* eslint-disable prefer-const */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { cadastrarUsuario, entrarUsuario } from '@/hooks/auth';
import Link from 'next/link';

export default function LoginPage() {
  const [modo, setModo] = useState<'login' | 'cadastro'>('login');
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState('');
  
  const router = useRouter();

  // Efeito de partículas místicas
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'login-particle';
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
        animation: floatLogin ${8 + Math.random() * 10}s linear infinite;
      `;
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 18000);
    };

    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  // Função para formatar telefone enquanto digita
  const formatarTelefone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    
    if (numbers.length <= 11) {
      return numbers
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
    }
    return value.substring(0, 15); // Limita tamanho
  };

  // Função para validar telefone brasileiro
  const validarTelefone = (telefone: string) => {
    const numbers = telefone.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let { name, value } = e.target;
    
    // Formatar telefone enquanto digita
    if (name === 'telefone') {
      value = formatarTelefone(value);
    }
    
    setFormData({
      ...formData,
      [name]: value
    });
    setErro('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErro('');

    try {
      if (modo === 'login') {
        await entrarUsuario(formData.email, formData.password);
        router.push('/dashboard');
      } else {
        // Validações para cadastro
        if (formData.password !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        if (formData.password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        if (!formData.nome.trim()) {
          throw new Error('Nome é obrigatório');
        }
        if (!formData.telefone.trim()) {
          throw new Error('Telefone é obrigatório para consultas');
        }
        if (!validarTelefone(formData.telefone)) {
          throw new Error('Telefone deve ter entre 10 e 11 dígitos');
        }

        await cadastrarUsuario(formData.email, formData.password, formData.nome, formData.telefone);
        router.push('/dashboard');
      }//eslint-disable-next-line
    } catch (error: any) {
      let mensagemErro = error.message;
      
      if (mensagemErro.includes('auth/email-already-in-use')) {
        mensagemErro = 'Este e-mail já está em uso';
      } else if (mensagemErro.includes('auth/weak-password')) {
        mensagemErro = 'A senha deve ter pelo menos 6 caracteres';
      } else if (mensagemErro.includes('auth/invalid-email')) {
        mensagemErro = 'E-mail inválido';
      } else if (mensagemErro.includes('auth/user-not-found')) {
        mensagemErro = 'Usuário não encontrado';
      } else if (mensagemErro.includes('auth/wrong-password')) {
        mensagemErro = 'Senha incorreta';
      }
      
      setErro(mensagemErro);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx global>{`
        @keyframes floatLogin {
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
        
        @keyframes formGlow {
          0%, 100% {
            box-shadow: 0 8px 32px rgba(147, 112, 219, 0.1);
          }
          50% {
            box-shadow: 0 8px 40px rgba(147, 112, 219, 0.15);
          }
        }
        
        .form-hover {
          transition: all 0.3s ease;
        }
        
        .form-hover:hover {
          transform: translateY(-2px);
        }
      `}</style>

      {/* Background idêntico à página principal */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 -z-10">
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-purple-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,112,219,0.15),transparent_50%)]"></div>
      </div>

      <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
        {/* Card de Login - Design harmonizado */}
        <div className="max-w-md w-full bg-slate-800/40 backdrop-blur-lg rounded-2xl p-6 md:p-8 border border-purple-500/30 shadow-xl animate-formGlow">
          
          {/* Header místico */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🔮</div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-200 to-blue-200 bg-clip-text text-transparent mb-2">
              {modo === 'login' ? 'Acesso Místico' : 'Jornada Iniciada'}
            </h1>
            <p className="text-purple-200/80 text-sm md:text-base">
              {modo === 'login' 
                ? 'Entre no Universo dos Oráculos'
                : 'Comece sua jornada espiritual'
              }
            </p>
          </div>

          {/* Alternância entre Login/Cadastro */}
          <div className="flex mb-6 bg-slate-700/30 rounded-lg p-1 border border-purple-500/20">
            <button
              type="button"
              onClick={() => setModo('login')}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 form-hover ${
                modo === 'login' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg' 
                  : 'text-purple-200/70 hover:text-purple-100'
              }`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setModo('cadastro')}
              className={`flex-1 py-2 px-4 rounded-md transition-all duration-300 form-hover ${
                modo === 'cadastro' 
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg' 
                  : 'text-purple-200/70 hover:text-purple-100'
              }`}
            >
              Cadastrar
            </button>
          </div>

          {/* Formulário */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {modo === 'cadastro' && (
              <>
                <div>
                  <label className="block text-purple-200/80 text-sm font-medium mb-2">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    name="nome"
                    value={formData.nome}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-slate-700/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300"
                    placeholder="Seu nome completo"
                  />
                </div>
                
                <div>
                  <label className="block text-purple-200/80 text-sm font-medium mb-2">
                    Telefone *
                    <span className="text-purple-300/60 text-xs ml-1">(necessário para consultas)</span>
                  </label>
                  <input
                    type="tel"
                    name="telefone"
                    value={formData.telefone}
                    onChange={handleChange}
                    required
                    className={`w-full px-4 py-3 bg-slate-700/30 border rounded-lg text-white placeholder-purple-200/50 focus:outline-none focus:ring-1 transition-all duration-300 ${
                      formData.telefone && !validarTelefone(formData.telefone)
                        ? 'border-red-500/50 focus:border-red-400 focus:ring-red-400'
                        : 'border-purple-500/30 focus:border-purple-400 focus:ring-purple-400'
                    }`}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                  />
                  {formData.telefone && !validarTelefone(formData.telefone) && (
                    <p className="text-red-300 text-xs mt-1">
                      ⚠️ Telefone deve ter entre 10 e 11 dígitos
                    </p>
                  )}
                  <p className="text-purple-300/60 text-xs mt-1">
                    📱 Usado para comunicação durante as consultas
                  </p>
                </div>
              </>
            )}

            <div>
              <label className="block text-purple-200/80 text-sm font-medium mb-2">
                E-mail *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label className="block text-purple-200/80 text-sm font-medium mb-2">
                Senha *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-slate-700/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300"
                placeholder="Sua senha"
              />
            </div>

            {modo === 'cadastro' && (
              <div>
                <label className="block text-purple-200/80 text-sm font-medium mb-2">
                  Confirmar Senha *
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-700/30 border border-purple-500/30 rounded-lg text-white placeholder-purple-200/50 focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400 transition-all duration-300"
                  placeholder="Confirme sua senha"
                />
              </div>
            )}

            {/* Aviso sobre telefone obrigatório */}
            {modo === 'cadastro' && (
              <div className="bg-blue-500/10 border border-blue-400/30 rounded-lg p-3">
                <p className="text-blue-200 text-sm flex items-start">
                  <span className="mr-2 text-base">📞</span>
                  <span>
                    <strong>Telefone obrigatório:</strong> Necessário para que nossas profissionais entrem em contato durante as consultas via WhatsApp.
                  </span>
                </p>
              </div>
            )}

            {/* Mensagem de erro */}
            {erro && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3 animate-pulse">
                <p className="text-red-200 text-sm flex items-center">
                  <span className="mr-2">⚠️</span>
                  {erro}
                </p>
              </div>
            )}

            {/* Botão de envio */}
            <button
              type="submit"
              disabled={loading || (modo === 'cadastro' && formData.telefone.trim() !== '' && !validarTelefone(formData.telefone))}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 form-hover shadow-lg border border-purple-400/30"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {modo === 'login' ? 'Acessando...' : 'Criando...'}
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  {modo === 'login' ? '🔑 Entrar' : '✨ Criar Conta'}
                </span>
              )}
            </button>
          </form>

          {/* Link para home */}
          <div className="text-center mt-6">
            <Link 
              href="/" 
              className="text-purple-300 hover:text-purple-200 text-sm transition-all duration-300 form-hover inline-flex items-center"
            >
              <span className="mr-2">←</span>
              Voltar para o início
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}