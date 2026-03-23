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

CONSIGLI D'USO E ABBINAMENTI (se il cliente chiede cosa fare con i prodotti):

OLIO DOP:
- A CRUDO su bruschetta, insalate, zuppe, carpacci — è lì che si sente davvero
- Su pasta appena scolata — un filo generoso prima di servire
- Conservazione: al buio, temperatura ambiente, consumare entro 18 mesi
- Il piccante e l'amaro sono segno di qualità (ricchezza di polifenoli)

PASTA CAPPELLI:
- Cottura: 1-2 minuti in più rispetto alla pasta industriale, il grano antico tiene bene
- Ideale con sughi semplici dove il sapore del grano emerga
- Fettuccine/Tagliatelle → ragù, funghi
- Penne/Mezzemaniche → sugo pomodoro, verdure
- Quadrucci → brodo, minestre
- Sagnette → legumi, ceci

FARINE:
- Semolato Cappelli → pasta fresca fatta in casa, pane rustico
- Gentilrosso → pizza, focaccia, dolci rustici

ABBINAMENTI CONSIGLIATI:
- Olio DOP + Bruschetta di pane casereccio = esalta il fruttato
- Olio DOP + Fettuccine o Tagliatelle al ragù = l'olio a crudo completa il piatto
- Olio DOP + Zuppa di legumi = il piccante bilancia la dolcezza
- Pasta Cappelli + sughi semplici (pomodoro, aglio olio) = il grano si fa sentire
- Farina Gentilrosso + pizza fatta in casa = gusto rustico autentico
- Passata + pasta Cappelli = tutto GBiO, tutto biologico

REGOLE:
- Rispondi SOLO su prodotti GBiO, ordini, spedizioni, degustazione
- Se chiedono cose non relative a GBiO, dì gentilmente che puoi aiutare solo con i prodotti
- Suggerisci prodotti complementari (es. chi compra olio → suggerisci pasta)
- Se chiedono di ordinare, indirizzali alla pagina prodotti: "Puoi ordinare direttamente su gbio.it nella sezione Prodotti"
- Max 3-4 frasi per risposta — conciso e utile
- Se chiedono cosa cucinare, suggerisci abbinamenti con i prodotti GBiO
- Non inventare informazioni che non conosci
- Usa emoji con moderazione per essere accogliente ma professionale
- NON usare MAI markdown: no asterischi (**), no cancelletti (#), no underscore (_). Scrivi testo semplice e pulito.
- Quando menzioni o consigli prodotti specifici, AGGIUNGI alla fine del messaggio una riga con i product ID separati da virgola nel formato: [PRODOTTI:id1,id2,id3]
- I product ID disponibili sono: ${products.map(p => p.id).join(', ')}
- Esempio: se consigli olio e pasta, aggiungi alla fine: [PRODOTTI:olio-dop-50cl,pasta-fettuccine]
- La riga [PRODOTTI:...] non verrà mostrata come testo, verrà usata per mostrare le card dei prodotti con foto.`

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

    let text =
      response.content[0].type === 'text' ? response.content[0].text : ''

    // Estrai product IDs dal tag [PRODOTTI:...]
    const productMatch = text.match(/\[PRODOTTI:([\w,-]+)\]/)
    let productCards: Array<{ id: string; name: string; price: number; image: string; weight: string }> = []
    if (productMatch) {
      text = text.replace(/\[PRODOTTI:[\w,-]+\]/, '').trim()
      const ids = productMatch[1].split(',').map(s => s.trim())
      productCards = ids
        .map(id => {
          const p = products.find(prod => prod.id === id)
          if (!p) return null
          return { id: p.id, name: p.name, price: p.price, image: p.image, weight: p.details.weight }
        })
        .filter(Boolean) as typeof productCards
    }

    return NextResponse.json({ response: text, products: productCards })
  } catch (error) {
    console.error('Chat API error:', error)
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    )
  }
}
