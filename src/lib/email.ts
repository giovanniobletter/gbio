import { Resend } from 'resend'

function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

const FROM_EMAIL = 'GBiO <ordini@gbio.it>'
const SELLER_EMAIL = 'customerservice@gbio.it'

// I dati ordine arrivano dai metadata Stripe compilati dal cliente:
// vanno escapati prima di finire nell'HTML delle email
function esc(str: string): string {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export interface InvoiceData {
  requested: boolean
  type: string
  codiceFiscale?: string
  businessName?: string
  partitaIva?: string
  sdiCode?: string
  pecEmail?: string
}

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
  invoice?: InvoiceData
}

function invoiceRowsHtml(invoice?: InvoiceData): string {
  if (!invoice?.requested) return ''
  const rows: Array<[string, string]> = [['Fattura richiesta', invoice.type === 'azienda' ? 'Sì — Azienda' : 'Sì — Privato']]
  if (invoice.codiceFiscale) rows.push(['Codice Fiscale', invoice.codiceFiscale])
  if (invoice.businessName) rows.push(['Ragione sociale', invoice.businessName])
  if (invoice.partitaIva) rows.push(['Partita IVA', invoice.partitaIva])
  if (invoice.sdiCode) rows.push(['Codice SDI', invoice.sdiCode])
  if (invoice.pecEmail) rows.push(['PEC', invoice.pecEmail])
  return rows
    .map(([label, value]) => `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">${label}</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(value)}</td></tr>`)
    .join('')
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
              Ciao ${esc(order.customerName)},<br><br>
              Abbiamo ricevuto il tuo ordine e lo stiamo preparando con cura.
              Riceverai un aggiornamento quando verrà spedito.
            </p>
          </div>

          <div style="border: 1px solid #c9a96130; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #c9a961; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 16px;">Riepilogo ordine</h3>
            <p style="color: #ffffffd0; font-size: 14px; line-height: 1.8; margin: 0;">
              ${order.products.split(', ').map(p => `• ${esc(p)}`).join('<br>')}
            </p>
            <div style="border-top: 1px solid #c9a96120; margin-top: 16px; padding-top: 16px;">
              <table style="width: 100%; font-size: 14px;">
                <tr><td style="color: #ffffff80; padding: 4px 0;">Subtotale</td><td style="text-align: right; color: #fff;">${order.subtotal}€</td></tr>
                <tr><td style="color: #ffffff80; padding: 4px 0;">Spedizione (${shippingLabel})</td><td style="text-align: right; color: #fff;">${shippingText}</td></tr>
                <tr><td style="color: #c9a961; padding: 8px 0 0; font-size: 18px; font-weight: bold;">Totale</td><td style="text-align: right; color: #c9a961; font-size: 18px; font-weight: bold;">${order.total}€</td></tr>
              </table>
              <p style="color: #ffffff50; font-size: 11px; text-align: right; margin: 4px 0 0;">IVA inclusa</p>
            </div>
          </div>

          ${order.invoice?.requested ? `
          <div style="border: 1px solid #c9a96130; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #c9a961; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px;">Fattura richiesta</h3>
            <p style="color: #ffffffb0; font-size: 14px; line-height: 1.6; margin: 0;">
              Riceverai la fattura elettronica per questo ordine.<br>
              ${order.invoice.type === 'azienda'
                ? `${esc(order.invoice.businessName || '')} — P.IVA ${esc(order.invoice.partitaIva || '')}${order.invoice.sdiCode ? ` — SDI ${esc(order.invoice.sdiCode)}` : ''}${order.invoice.pecEmail ? ` — PEC ${esc(order.invoice.pecEmail)}` : ''}`
                : `Codice Fiscale: ${esc(order.invoice.codiceFiscale || '')}`}
            </p>
          </div>` : ''}

          <div style="border: 1px solid #c9a96130; padding: 24px; margin-bottom: 24px;">
            <h3 style="color: #c9a961; font-size: 14px; text-transform: uppercase; letter-spacing: 2px; margin: 0 0 12px;">Spedizione a</h3>
            <p style="color: #ffffffb0; font-size: 14px; line-height: 1.6; margin: 0;">
              ${esc(order.customerName)}<br>
              ${esc(order.address)}
              ${order.deliveryNotes ? `<br><em style="color: #ffffff60;">Note: ${esc(order.deliveryNotes)}</em>` : ''}
            </p>
          </div>

          <div style="text-align: center; padding: 24px 0; border-top: 1px solid #c9a96120;">
            <p style="color: #ffffff60; font-size: 12px; margin: 0;">
              Per qualsiasi domanda rispondi a questa email o contattaci a
              <a href="mailto:customerservice@gbio.it" style="color: #c9a961;">customerservice@gbio.it</a>
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
      subject: `Nuovo ordine!${order.invoice?.requested ? ' [FATTURA]' : ''} ${order.customerName} — ${order.total}€`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h1 style="color: #c9a961; border-bottom: 2px solid #c9a961; padding-bottom: 12px;">Nuovo Ordine Ricevuto</h1>

          <h2 style="margin-top: 24px;">Cliente</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Nome</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(order.customerName)}</td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${esc(order.customerEmail)}">${esc(order.customerEmail)}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Telefono</td><td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="tel:${esc(order.customerPhone)}">${esc(order.customerPhone)}</a></td></tr>
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Indirizzo</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(order.address)}</td></tr>
            ${order.deliveryNotes ? `<tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Note consegna</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${esc(order.deliveryNotes)}</td></tr>` : ''}
          </table>

          ${order.invoice?.requested ? `
          <h2 style="margin-top: 24px; color: #b00;">⚠ Fattura da emettere</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            ${invoiceRowsHtml(order.invoice)}
          </table>` : ''}

          <h2 style="margin-top: 24px;">Ordine</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 15px;">
            <tr><td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 140px;">Prodotti</td><td style="padding: 8px; border-bottom: 1px solid #eee;">${order.products.split(', ').map(esc).join('<br>')}</td></tr>
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
