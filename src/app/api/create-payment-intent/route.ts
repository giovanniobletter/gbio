import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { products } from '@/data/products'
import { getShippingCost, isValidShippingZone, ShippingZone } from '@/lib/shipping'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function getServerProduct(productId: string) {
  return products.find(p => p.id === productId)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingZone: rawZone, shippingAddress } = body

    const shippingZone: ShippingZone = isValidShippingZone(rawZone) ? rawZone : 'italia'

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
    const { cost: shippingCost } = getShippingCost(shippingZone, subtotal)
    const total = subtotal + shippingCost

    // Amount in cents for Stripe
    const amount = Math.round(total * 100)

    // Build readable product list for metadata (Stripe metadata max 500 chars per value)
    const productList = validatedItems
      .map(i => `${i.quantity}x ${i.product.name} (${i.product.price.toFixed(2)}€)`)
      .join(', ')

    // Extract shipping address fields safely
    const addr = shippingAddress || {}
    const customerName = [addr.firstName, addr.lastName].filter(Boolean).join(' ')
    const customerEmail = addr.email || ''
    const fullAddress = [
      addr.address,
      [addr.postalCode, addr.city, addr.province ? `(${addr.province})` : ''].filter(Boolean).join(' '),
      addr.country,
    ].filter(Boolean).join(', ')

    // Create PaymentIntent with automatic payment methods (cards, Apple Pay, Google Pay)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'eur',
      automatic_payment_methods: {
        enabled: true,
      },
      // Stripe invia ricevuta automatica a questa email
      receipt_email: customerEmail || undefined,
      // Descrizione visibile nella dashboard Stripe e nella ricevuta
      description: `Ordine GBiO — ${productList}`,
      shipping: customerName ? {
        name: customerName,
        phone: addr.phone || undefined,
        address: {
          line1: addr.address || '',
          city: addr.city || '',
          state: addr.province || '',
          postal_code: addr.postalCode || '',
          country: addr.country || 'Italia',
        },
      } : undefined,
      metadata: {
        prodotti: productList.substring(0, 500),
        cliente_nome: customerName,
        cliente_email: customerEmail,
        cliente_telefono: addr.phone || '',
        indirizzo: fullAddress.substring(0, 500),
        note_consegna: (addr.notes || '').substring(0, 500),
        subtotale: subtotal.toFixed(2),
        spedizione: shippingCost.toFixed(2),
        zona_spedizione: shippingZone,
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
