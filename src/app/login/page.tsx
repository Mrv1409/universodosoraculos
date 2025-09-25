'use client';

import { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setErro(''); // Limpar erro ao digitar
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
        // Validações do cadastro
        if (formData.password !== formData.confirmPassword) {
          throw new Error('As senhas não coincidem');
        }
        if (formData.password.length < 6) {
          throw new Error('A senha deve ter pelo menos 6 caracteres');
        }
        if (!formData.nome.trim()) {
          throw new Error('Nome é obrigatório');
        }

        await cadastrarUsuario(formData.email, formData.password, formData.nome, formData.telefone);
        router.push('/dashboard');
      }//eslint-disable-next-line
    } catch (error: any) {
      // Traduzir erros do Firebase
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
    <div className="container mx-auto px-4 py-8 min-h-screen flex items-center justify-center">
      <div className="max-w-md w-full bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-accent/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-accent mb-2">
            {modo === 'login' ? '🔮 Entrar' : '✨ Criar Conta'}
          </h1>
          <p className="text-text/80">
            {modo === 'login' 
              ? 'Acesse sua conta no Universo dos Oráculos'
              : 'Junte-se ao Universo dos Oráculos'
            }
          </p>
        </div>

        {/* Botões de alternância */}
        <div className="flex mb-6 bg-white/5 rounded-lg p-1">
          <button
            type="button"
            onClick={() => setModo('login')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              modo === 'login' 
                ? 'bg-accent text-dark font-medium' 
                : 'text-text/70 hover:text-text'
            }`}
          >
            Entrar
          </button>
          <button
            type="button"
            onClick={() => setModo('cadastro')}
            className={`flex-1 py-2 px-4 rounded-md transition-colors ${
              modo === 'cadastro' 
                ? 'bg-accent text-dark font-medium' 
                : 'text-text/70 hover:text-text'
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
                <label className="block text-text/80 text-sm font-medium mb-2">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  name="nome"
                  value={formData.nome}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-text placeholder-text/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div>
                <label className="block text-text/80 text-sm font-medium mb-2">
                  Telefone (opcional)
                </label>
                <input
                  type="tel"
                  name="telefone"
                  value={formData.telefone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-text placeholder-text/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                  placeholder="(11) 99999-9999"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-text/80 text-sm font-medium mb-2">
              E-mail *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-text placeholder-text/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="seu@email.com"
            />
          </div>

          <div>
            <label className="block text-text/80 text-sm font-medium mb-2">
              Senha *
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-text placeholder-text/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
              placeholder="Sua senha"
            />
          </div>

          {modo === 'cadastro' && (
            <div>
              <label className="block text-text/80 text-sm font-medium mb-2">
                Confirmar Senha *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-text placeholder-text/50 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent"
                placeholder="Confirme sua senha"
              />
            </div>
          )}

          {/* Mensagem de erro */}
          {erro && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
              <p className="text-red-200 text-sm">{erro}</p>
            </div>
          )}

          {/* Botão de envio */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-dark font-semibold py-3 px-4 rounded-lg transition-colors"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {modo === 'login' ? 'Entrando...' : 'Criando conta...'}
              </span>
            ) : (
              modo === 'login' ? 'Entrar' : 'Criar Conta'
            )}
          </button>
        </form>

        {/* Link para home */}
        <div className="text-center mt-6">
          <Link href="/" className="text-accent hover:text-accent/80 text-sm transition-colors">
            ← Voltar para início
          </Link>
        </div>
      </div>
    </div>
  );
}