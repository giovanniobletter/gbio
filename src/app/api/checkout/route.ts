import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'
import { products } from '@/data/products'
import { ALL_COUNTRY_CODES, getShippingCost, isValidShippingZone, ShippingZone } from '@/lib/shipping'

// Inizializzazione lazy: a livello di modulo farebbe fallire la build
// negli ambienti senza STRIPE_SECRET_KEY (es. preview Vercel)
function getStripe() {
  return new Stripe(process.env.STRIPE_SECRET_KEY!)
}

function getServerProduct(productId: string) {
  return products.find(p => p.id === productId)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { items, shippingAddress, locale = 'it', shippingZone: rawZone } = body
    const shippingZone: ShippingZone = isValidShippingZone(rawZone) ? rawZone : 'italia'

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'Carrello vuoto' },
        { status: 400 }
      )
    }

    // Validate all products exist and get SERVER prices (not client prices!)
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
        product: serverProduct, // Use SERVER product data, not client data!
        quantity: Math.max(1, Math.floor(item.quantity || 1)) // Sanitize quantity
      })
    }

    // Calculate subtotal using SERVER prices only
    const subtotal = validatedItems.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    )

    const { cost: shippingCost } = getShippingCost(shippingZone, subtotal)

    // Create line items for Stripe using SERVER prices
    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = validatedItems.map(
      (item) => ({
        price_data: {
          currency: 'eur',
          product_data: {
            name: item.product.name,
            description: item.product.description || undefined,
            // Images only work with public URLs, skip for localhost
            ...(process.env.NEXT_PUBLIC_SITE_URL?.includes('localhost') ? {} : {
              images: [`${process.env.NEXT_PUBLIC_SITE_URL}${item.product.image}`],
            }),
          },
          unit_amount: Math.round(item.product.price * 100), // SERVER price in cents
        },
        quantity: item.quantity,
      })
    )

    // Add shipping as a line item if not free
    if (shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'eur',
          product_data: {
            name: 'Spedizione',
            description: shippingZone === 'italia' ? 'Spedizione standard in Italia' : shippingZone === 'europa' ? 'Spedizione in Europa' : 'Spedizione extra-UE',
          },
          unit_amount: Math.round(shippingCost * 100),
        },
        quantity: 1,
      })
    }

    // Create Stripe Checkout Session
    // No payment_method_types restriction = Stripe auto-enables Apple Pay, Google Pay, cards, etc.
    const session = await getStripe().checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${locale}/checkout`,
      locale: locale === 'it' ? 'it' : 'en',
      shipping_address_collection: {
        allowed_countries: ALL_COUNTRY_CODES as unknown as Stripe.Checkout.SessionCreateParams.ShippingAddressCollection.AllowedCountry[],
      },
      metadata: {
        customerEmail: shippingAddress?.email || '',
        customerName: shippingAddress
          ? `${shippingAddress.firstName} ${shippingAddress.lastName}`
          : '',
      },
      customer_email: shippingAddress?.email,
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Errore sconosciuto'
    return NextResponse.json(
      { error: 'Errore durante la creazione del pagamento', details: errorMessage },
      { status: 500 }
    )
  }
}
