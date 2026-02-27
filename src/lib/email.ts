import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM_EMAIL = 'GBiO <ordini@gbio.it>'
const SELLER_EMAIL = 'gb.obletter@gmail.com'

interface OrderData {
  customerName: string
  customerEmail: string
  customerPhone: string
  address: string
  deliveryNotes: string
  products: string
  subtotal: string
  shipping: string
  shippingZone: string
  total: string
  paymentId: string
}

function getZoneLabel(zone: string): string {
  if (zone === 'italia') return 'Italia'
  if (zone === 'europa') return 'Europa UE'
  return 'Extra-UE (UK/Svizzera)'
}

// Email al CLIENTE — conferma ordine
export async function sendOrderConfirmationEmail(order: OrderData) {
  if (!order.customerEmail) return

  const shippingLabel = getZoneLabel(order.shippingZone)
  const shippingText = order.shipping === '0.00' || order.shipping === '0'
    ? 'Gratuita'
    : `${order.shipping}€`

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: order.customerEmail,
      subject: `Conferma ordine GBiO — ${order.total}€`,
      html: `
        <div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #0d0d0d; color: #ffffff; padding: 40px;">
          <div style="text-align: center; margin-bottom: 32px;">
            <h1 style="color: #c9a961; font-size: 28px; margin: 0;">GBiO</h1>
            <p style="color: #ffffff80; font-size: 12px; letter-spacing: 3px; text-transform: uppercase; margin-top: 8px;">Azienda Agricola Biologica</p>
          </div>

          <div style="border: 1px solid #c9a96130; padding: 24px; margin-bottom: 24px;">
            <h2 style="color: #c9a961; font-size: 20px; margin: 0 0 16px;">Grazie per il tuo ordine!</h2>
            <p style="color: #ffffffb0; font-size: 14px; line-height: 1.6; margin: 0;">
              Ciao ${order.customerName},<br><br>
              Abbiamo ricevuto il tuo ordine e lo stiamo preparando con cura.
              Riceverai un aggiornamento quando verrà spedito.
            </p>
          </div>

          <div style="border: 1px solid #c9a96130; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #c9a961; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px;">Riepilogo ordine</h3>
            <p style="color: #ffffffd0; font-size: 14px; line-height: 1.8; margin: 0;">
              ${order.products.split(', ').map(p => `• ${p}`).join('<br>')}
            </p>
            <div style="border-top: 1px solid #c9a96120; margin-top: 16px; padding-top: 16px;">
              <table style="width: 100%; font-size: 14px;">
                <tr><td style="color: #ffffff80; padding: 4px 0;">Subtotale</td><td style="text-align: right; color: #fff;">${order.subtotal}€</td></tr>
                <tr><td style="color: #ffffff80; padding: 4px 0;">Spedizione (${shippingLabel})</td><td style="text-align: right; color: #fff;">${shippingText}</td></tr>
                <tr><td style="color: #c9a961; padding: 8px 0 0; font-size: 18px; font-weight: bold;">Totale</td><td style="text-align: right; color: #c9a961; font-size: 18px; font-weight: bold;">${order.total}€</td></tr>
              </table>
            </div>
          </div>

          <div style="border: 1px solid #c9a96130; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #c9a961; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px;">Spedizione a</h3>
            <p style="color: #ffffffb0; font-size: 14px; line-height: 1.6; margin: 0;">
              ${order.customerName}<br>
              ${order.address}
              ${order.deliveryNotes ? `<br><em style="color: #ffffff60;">Note: ${order.deliveryNotes}</em>` : ''}
            </p>
          </div>

          <div style="text-align: center; padding: 24px 0; border-top: 1px solid #c9a96120;">
            <p style="color: #ffffff60; font-size: 12px; margin: 0;">
              Per qualsiasi domanda rispondi a questa email o contattaci a
              <a href="mailto:gb.obletter@gmail.com" style="color: #c9a961;">gb.obletter@gmail.com</a>
            </p>
            <p style="color: #ffffff40; font-size: 11px; margin-top: 12px;">
              GBiO — Azienda Agricola Biologica Obletter<br>
              Cepagatti (PE) — Italia
            </p>
          </div>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send customer email:', error)
  }
}

// Email al VENDITORE — notifica nuovo ordine
export async function sendNewOrderNotificationEmail(order: OrderData) {
  const shippingLabel = getZoneLabel(order.shippingZone)

  try {
    await getResend().emails.send({
      from: FROM_EMAIL,
      to: SELLER_EMAIL,
      subject: `Nuovo ordine! ${order.customerName} — ${order.total}€`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #c9a961; border-bottom: 2px solid #c9a961; padding-bottom: 12px;">Nuovo Ordine Ricevuto</h1>

          <h2 style="margin-top: 24px;">Cliente</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Nome</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.customerName}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${order.customerEmail}">${order.customerEmail}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefono</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${order.customerPhone}">${order.customerPhone}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Indirizzo</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.address}</td></tr>
            ${order.deliveryNotes ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Note consegna</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.deliveryNotes}</td></tr>` : ''}
          </table>

          <h2 style="margin-top: 24px;">Ordine</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Prodotti</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.products.split(', ').join('<br>')}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Subtotale</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.subtotal}€</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Spedizione</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.shipping === '0.00' || order.shipping === '0' ? 'Gratuita' : order.shipping + '€'} (${shippingLabel})</td></tr>
            <tr style="background: #f8f8f0;"><td style="padding: 12px 8px; font-weight: bold; font-size: 18px;">TOTALE</td><td style="padding: 12px 8px; font-size: 18px; font-weight: bold; color: #c9a961;">${order.total}€</td></tr>
          </table>

          <p style="margin-top: 24px; color: #999; font-size: 12px;">
            ID Pagamento: ${order.paymentId}<br>
            <a href="https://dashboard.stripe.com/payments/${order.paymentId}">Vedi su Stripe →</a>
          </p>
        </div>
      `,
    })
  } catch (error) {
    console.error('Failed to send seller notification email:', error)
  }
}
