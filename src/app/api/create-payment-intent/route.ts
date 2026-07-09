import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { products } from '@/data/products'
import { getShippingCost, isValidShippingZone, ShippingZone } from '@/lib/shipping'
import { isValidCodiceFiscale, isValidPartitaIva, isValidCodiceSdi, isValidEmailFormat } from '@/lib/fiscal'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

function getServerProduct(productId: string) {
  return products.find(p => p.id === productId)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingZone: rawZone, shippingAddress, billing } = body

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

    // Fattura richiesta al momento dell'ordine (art. 22 DPR 633/72):
    // i dati vengono rivalidati qui e salvati nei metadata per l'emissione
    const invoiceMetadata: Record<string, string> = {}
    if (billing?.requested) {
      if (billing.type === 'privato') {
        const cf = String(billing.codiceFiscale || '').trim().toUpperCase()
        if (!isValidCodiceFiscale(cf)) {
          return NextResponse.json({ error: 'Codice fiscale non valido' }, { status: 400 })
        }
        invoiceMetadata.fattura_richiesta = 'si'
        invoiceMetadata.fattura_tipo = 'privato'
        invoiceMetadata.fattura_cf = cf
      } else if (billing.type === 'azienda') {
        const piva = String(billing.partitaIva || '').trim()
        const sdi = String(billing.sdiCode || '').trim().toUpperCase()
        const pec = String(billing.pecEmail || '').trim()
        const ragioneSociale = String(billing.businessName || '').trim()
        if (!ragioneSociale) {
          return NextResponse.json({ error: 'Ragione sociale mancante' }, { status: 400 })
        }
        if (!isValidPartitaIva(piva)) {
          return NextResponse.json({ error: 'Partita IVA non valida' }, { status: 400 })
        }
        if (!sdi && !pec) {
          return NextResponse.json({ error: 'Indicare codice SDI o PEC' }, { status: 400 })
        }
        if (sdi && !isValidCodiceSdi(sdi)) {
          return NextResponse.json({ error: 'Codice SDI non valido' }, { status: 400 })
        }
        if (pec && !isValidEmailFormat(pec)) {
          return NextResponse.json({ error: 'PEC non valida' }, { status: 400 })
        }
        invoiceMetadata.fattura_richiesta = 'si'
        invoiceMetadata.fattura_tipo = 'azienda'
        invoiceMetadata.fattura_ragione_sociale = ragioneSociale.substring(0, 500)
        invoiceMetadata.fattura_piva = piva
        if (sdi) invoiceMetadata.fattura_sdi = sdi
        if (pec) invoiceMetadata.fattura_pec = pec
      }
    }

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
        ...invoiceMetadata,
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
