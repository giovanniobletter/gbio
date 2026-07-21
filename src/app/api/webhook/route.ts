import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendOrderConfirmationEmail, sendNewOrderNotificationEmail } from '@/lib/email'

// Inizializzazione lazy: a livello di modulo farebbe fallire la build
// negli ambienti senza STRIPE_SECRET_KEY (es. preview Vercel)
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = getStripe().webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object as Stripe.PaymentIntent
    const metadata = paymentIntent.metadata

    const orderData = {
      customerName: metadata.cliente_nome || '',
      customerEmail: metadata.cliente_email || '',
      customerPhone: metadata.cliente_telefono || '',
      address: metadata.indirizzo || '',
      deliveryNotes: metadata.note_consegna || '',
      products: metadata.prodotti || '',
      subtotal: metadata.subtotale || '',
      shipping: metadata.spedizione || '',
      shippingZone: metadata.zona_spedizione || 'italia',
      total: (paymentIntent.amount / 100).toFixed(2),
      paymentId: paymentIntent.id,
      invoice: metadata.fattura_richiesta === 'si' ? {
        requested: true,
        type: metadata.fattura_tipo || 'privato',
        codiceFiscale: metadata.fattura_cf || '',
        businessName: metadata.fattura_ragione_sociale || '',
        partitaIva: metadata.fattura_piva || '',
        sdiCode: metadata.fattura_sdi || '',
        pecEmail: metadata.fattura_pec || '',
      } : undefined,
    }

    // Send both emails in parallel
    await Promise.allSettled([
      sendOrderConfirmationEmail(orderData),
      sendNewOrderNotificationEmail(orderData),
    ])
  }

  return NextResponse.json({ received: true })
}
