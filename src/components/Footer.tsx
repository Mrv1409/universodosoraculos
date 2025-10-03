'use client';

import { useEffect } from 'react';

export default function Footer() {
  // Mesmo efeito de partículas da homepage
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'footer-particle';
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: rgba(147, 112, 219, 0.4);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        bottom: ${Math.random() * 100}px;
        left: ${Math.random() * 100}vw;
        animation: floatFooter ${8 + Math.random() * 10}s linear infinite;
      `;
      document.querySelector('footer')?.appendChild(particle);
      
      setTimeout(() => particle.remove(), 18000);
    };

    const interval = setInterval(createParticle, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <style jsx global>{`
        @keyframes floatFooter {
          0% {
            transform: translateY(0px) translateX(0px);
            opacity: 0;
          }
          10% {
            opacity: 0.4;
          }
          90% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-100px) translateX(20px);
            opacity: 0;
          }
        }
      `}</style>

      {/* MESMO BACKGROUND DA HOMEPAGE */}
      <footer className="bg-gradient-to-br from-slate-900 via-purple-900/40 to-slate-900 border-t border-purple-500/30 mt-auto relative overflow-hidden">
        
        {/* MESMOS EFEITOS DE BRILHO */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-purple-900/20 to-transparent"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(147,112,219,0.15),transparent_50%)]"></div>
        
        {/* MESMO ESPAÇAMENTO E TIPOGRAFIA */}
        <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
          <div className="text-center">
            <p className="text-purple-200/60 text-sm md:text-base">
              © 2025 Universo dos Oráculos. Todos os direitos reservados.
            </p>
            <p className="text-purple-200/40 text-xs mt-2">
              ✨ Desvendando os mistérios do universo ✨
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}