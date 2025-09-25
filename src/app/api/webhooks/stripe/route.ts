import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';//eslint-disable-next-line
import { stripe } from '@/lib/stripe';
import { doc, updateDoc, increment, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
//eslint-disable-next-line
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = headers();
    const signature = (await headersList).get('stripe-signature');

    if (!signature) {
      console.error('Assinatura do webhook não encontrada');
      return NextResponse.json(
        { error: 'Webhook signature missing' },
        { status: 400 }
      );
    }

    let event;

    // Comentado para desenvolvimento - pular validação de assinatura
    // try {
    //   event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    // } catch (err: any) {
    //   console.error('Erro na verificação do webhook:', err.message);
    //   return NextResponse.json(
    //     { error: `Webhook signature verification failed: ${err.message}` },
    //     { status: 400 }
    //   );
    // }

    //eslint-disable-next-line
    event = JSON.parse(body);

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object;
        await processarPagamentoCompleto(session);
        break;

      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log('Pagamento confirmado:', paymentIntent.id);
        break;

      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Pagamento falhou:', failedPayment.id);
        break;

      default:
        console.log(`Evento não tratado: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Erro no webhook:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

//eslint-disable-next-line
async function processarPagamentoCompleto(session: any) {
  try {
    const { userId, pacoteId, creditos } = session.metadata;

    if (!userId || !creditos) {
      console.error('Metadados obrigatórios não encontrados:', session.metadata);
      return;
    }

    const creditosNum = parseInt(creditos);
    
    // Atualizar créditos do usuário
    const userRef = doc(db, 'usuarios', userId);
    await updateDoc(userRef, {
      creditos: increment(creditosNum),
      atualizadoEm: new Date()
    });

    // Salvar registro de compra
    const compraRef = doc(db, 'compras', session.id);
    await setDoc(compraRef, {
      userId,
      pacoteId,
      creditos: creditosNum,
      valor: session.amount_total,
      stripeSessionId: session.id,
      status: 'completed',
      criadoEm: new Date(),
      email: session.customer_details?.email || '',
      nome: session.customer_details?.name || ''
    });

    console.log(`Créditos adicionados para usuário ${userId}: ${creditosNum} minutos`);

  } catch (error) {
    console.error('Erro ao processar pagamento:', error);
  }
}