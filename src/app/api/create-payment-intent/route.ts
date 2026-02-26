import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { products } from '@/data/products'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

const SHIPPING_THRESHOLD = 50
const SHIPPING_COST = 7.90

function getServerProduct(productId: string) {
  return products.find(p => p.id === productId)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items } = body

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrello vuoto' },
        { status: 400 }
      )
    }

    // Validate all products and use SERVER prices only
    const validatedItems = []
    for (const item of items) {
      const productId = item.product?.id
      if (!productId) {
        return NextResponse.json(
          { error: 'Prodotto non valido' },
          { status: 400 }
        )
      }

      const serverProduct = getServerProduct(productId)
      if (!serverProduct) {
        return NextResponse.json(
          { error: `Prodotto non trovato: ${productId}` },
          { status: 400 }
        )
      }

      validatedItems.push({
        product: serverProduct,
        quantity: Math.max(1, Math.floor(item.quantity || 1))
      })
    }

    // Calculate total using SERVER prices
    const subtotal = validatedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )
    const shippingCost = subtotal >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST
    const total = subtotal + shippingCost

    // Amount in cents for Stripe
    const amount = Math.round(total * 100)

    // Create PaymentIntent with automatic payment methods (cards, Apple Pay, Google Pay)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        items: JSON.stringify(
          validatedItems.map(i => ({ id: i.product.id, qty: i.quantity }))
        ),
        subtotal: subtotal.toFixed(2),
        shipping: shippingCost.toFixed(2),
      },
    })

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    })
  } catch (error) {
    console.error('PaymentIntent error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
    return NextResponse.json(
      { error: 'Errore durante la creazione del pagamento', details: errorMessage },
      { status: 500 }
    )
  }
}
