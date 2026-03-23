import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { products } from '@/data/products'

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

function buildProductCatalog(): string {
  const lines: string[] = []

  const categories: Record<string, string> = {
    olio: 'OLIO EXTRAVERGINE DOP APRUTINO PESCARESE BIO',
    pasta: 'PASTA SENATORE CAPPELLI (500g)',
    farina: 'FARINE (1kg)',
    conserve: 'CONSERVE',
  }

  for (const [category, title] of Object.entries(categories)) {
    lines.push(`\n${title}:`)
    const catProducts = products.filter(p => p.category === category)
    for (const p of catProducts) {
      const certStr = p.details.certification.join(', ')
      lines.push(`- ${p.name} (${p.subtitle}) — €${p.price.toFixed(2)} [${p.details.weight}] — ${p.description} — Certificazioni: ${certStr}`)
    }
  }

  return lines.join('\n')
}

const SYSTEM_PROMPT = `Sei Robin, l'assistente virtuale di GBiO — Azienda Agricola Biologica Obletter.
Parli italiano. Sei cortese, professionale, e conosci ogni dettaglio dei nostri prodotti.

AZIENDA:
- GBiO — Azienda agricola biologica a Cepagatti (PE), Abruzzo
- Certificazione biologica ICEA
- Olio DOP Aprutino Pescarese, pasta con grano Senatore Cappelli, farine, conserve

PRODOTTI E PREZZI:
${buildProductCatalog()}

SPEDIZIONI:
- Italia: €7.90 (gratis sopra €60)
- Europa UE: €14.90 (gratis sopra €100)
- UK/Svizzera: €19.90

PAGAMENTI: Carte di credito, Apple Pay, Google Pay (via Stripe)

REGOLE:
- Rispondi SOLO su prodotti GBiO, ordini, spedizioni
- Se chiedono cose non relative a GBiO, dì gentilmente che puoi aiutare solo con i prodotti
- Suggerisci prodotti complementari (es. chi compra olio → suggerisci pasta)
- Se chiedono di ordinare, indirizzali alla pagina prodotti sul sito
- Max 3-4 frasi per risposta — conciso e utile
- Non inventare informazioni che non conosci`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export async function POST(request: NextRequest) {
  try {
    const { message, history } = (await request.json()) as {
      message: string
      history?: ChatMessage[]
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Messaggio richiesto' },
        { status: 400 }
      )
    }

    const messages: ChatMessage[] = [
      ...(history || []),
      { role: 'user', content: message },
    ]

    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      messages,
    })

    const text =
      response.content[0].type === 'text' ? response.content[0].text : ''

    return NextResponse.json({ response: text })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
