import { NextResponse } from 'next/server'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const TO_EMAIL = 'customerservice@gbio.it'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name: rawName, email: rawEmail, phone: rawPhone, subject, message: rawMessage } = body
    const name = escapeHtml(String(rawName || ''))
    const email = escapeHtml(String(rawEmail || ''))
    const phone = escapeHtml(String(rawPhone || ''))
    const message = escapeHtml(String(rawMessage || ''))

    // Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Nome, email e messaggio sono obbligatori.' },
        { status: 400 }
      )
    }

    const subjectLabels: Record<string, string> = {
      info: 'Informazioni generali',
      ordini: 'Ordini e spedizioni',
      horeca: 'Ho.Re.Ca. & Distribuzione',
      collaborazioni: 'Collaborazioni & Partnership',
      altro: 'Altro',
    }

    const subjectLabel = subjectLabels[subject] || subject

    // If Resend API key is configured, send via Resend
    if (RESEND_API_KEY) {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'GBiO Sito Web <noreply@gbio.it>',
          to: [TO_EMAIL],
          reply_to: email,
          subject: `[GBiO] ${subjectLabel} - ${name}`,
          html: `
            <h2>Nuovo messaggio dal sito gbio.it</h2>
            <p><strong>Nome:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Telefono:</strong> ${phone || 'Non specificato'}</p>
            <p><strong>Oggetto:</strong> ${subjectLabel}</p>
            <hr />
            <p><strong>Messaggio:</strong></p>
            <p>${message.replace(/\n/g, '<br />')}</p>
          `,
        }),
      })

      if (!res.ok) {
        const errorData = await res.json()
        console.error('Resend error:', errorData)
        return NextResponse.json(
          { error: 'Errore nell\'invio dell\'email.' },
          { status: 500 }
        )
      }

      return NextResponse.json({ success: true })
    }

    // Fallback: log to console (useful for development)
    console.log('=== NUOVO MESSAGGIO CONTATTO ===')
    console.log('Nome:', name)
    console.log('Email:', email)
    console.log('Telefono:', phone)
    console.log('Oggetto:', subjectLabel)
    console.log('Messaggio:', message)
    console.log('================================')

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server.' },
      { status: 500 }
    )
  }
}
