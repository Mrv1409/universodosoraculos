import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { pacotesCreditos } from '@/data/pacotes-creditos';

export async function POST(request: NextRequest) {
  try {
    const { pacoteId, userId } = await request.json();

    if (!pacoteId || !userId) {
      return NextResponse.json(
        { error: 'Dados obrigatórios não fornecidos' },
        { status: 400 }
      );
    }

    
    const pacote = pacotesCreditos.find(p => p.id === pacoteId);
    
    if (!pacote) {
      return NextResponse.json(
        { error: 'Pacote não encontrado' },
        { status: 404 }
      );
    }

    // URLs de sucesso e cancelamento
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
    const successUrl = `${baseUrl}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${baseUrl}/creditos?canceled=true`;

    // Criar sessão de checkout no Stripe
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
      customer_email: undefined, // Será preenchido automaticamente
      payment_intent_data: {
        metadata: {
          userId,
          pacoteId,
          creditos: pacote.creditos.toString(),
        },
      },
      expires_at: Math.floor(Date.now() / 1000) + 3600, // Expira em 1 hora
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Erro na API de checkout:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}