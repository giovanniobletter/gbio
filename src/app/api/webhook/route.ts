import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { sendOrderConfirmationEmail, sendNewOrderNotificationEmail } from '@/lib/email'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature) {
    return NextResponse.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
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
    }

    // Send both emails in parallel
    await Promise.allSettled([
      sendOrderConfirmationEmail(orderData),
      sendNewOrderNotificationEmail(orderData),
    ])
  }

  return NextResponse.json({ received: true })
}
