import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-dark text-text mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo e Descrição */}
          <div>
            <h3 className="text-xl font-bold text-accent mb-4">
              🔮 Universo dos Oráculos
            </h3>
            <p className="text-sm opacity-80">
              Descubra seu futuro através das cartas do Tarot. 
              Consultas personalizadas com profissionais especializados.
            </p>
          </div>

          {/* Links Rápidos */}
          <div>
            <h4 className="font-semibold text-accent mb-4">Links Rápidos</h4>
            <nav className="space-y-2">
              <Link href="/" className="block text-sm hover:text-accent transition-colors">
                Início
              </Link>
              <Link href="/services" className="block text-sm hover:text-accent transition-colors">
                Serviços
              </Link>
              <Link href="/dashboard" className="block text-sm hover:text-accent transition-colors">
                Minha Conta
              </Link>
              <Link href="/login" className="block text-sm hover:text-accent transition-colors">
                Entrar
              </Link>
            </nav>
          </div>

          {/* Contato */}
          <div>
            <h4 className="font-semibold text-accent mb-4">Contato</h4>
            <div className="space-y-2 text-sm">
              <p>📧 contato@universodososraculos.com</p>
              <p>📱 WhatsApp: (11) 99999-9999</p>
              <p>🕒 Atendimento: 24h</p>
            </div>
          </div>
        </div>

        {/* Linha de Copyright */}
        <div className="border-t border-gray-700 mt-8 pt-4 text-center">
          <p className="text-sm opacity-60">
            © 2025 Universo dos Oráculos. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}