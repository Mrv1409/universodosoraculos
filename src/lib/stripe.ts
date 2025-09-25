import Stripe from 'stripe';
import { pacotesCreditos, PacoteCredito } from '@/data/pacotes-creditos';

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY não encontrada nas variáveis de ambiente');
}

// Inicializar Stripe com a chave secreta
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  typescript: true,
});

// Exportar o tipo (importado de pacotes-creditos)
export type { PacoteCredito };

// Função para formatar preço em centavos para Real
export function formatarPreco(precoEmCentavos: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(precoEmCentavos / 100);
}

// Função para criar sessão de checkout
export async function criarSessaoCheckout({
  pacoteId,
  userId,
  successUrl,
  cancelUrl,
}: {
  pacoteId: string;
  userId: string;
  successUrl: string;
  cancelUrl: string;
}) {
  const pacote = pacotesCreditos.find(p => p.id === pacoteId);
  
  if (!pacote) {
    throw new Error('Pacote não encontrado');
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: pacote.nome,
              description: pacote.descricao,
              metadata: {
                creditos: pacote.creditos.toString(),
                pacoteId: pacote.id,
              },
            },
            unit_amount: pacote.preco,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata: {
        userId,
        pacoteId,
        creditos: pacote.creditos.toString(),
      },
      expires_at: Math.floor(Date.now() / 1000) + 3600, // Expira em 1 hora
    });

    return session;
  } catch (error) {
    console.error('Erro ao criar sessão de checkout:', error);
    throw new Error('Erro ao processar pagamento');
  }
}