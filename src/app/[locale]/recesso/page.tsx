'use client'

import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { luxuryFadeUp } from '@/lib/animations'
import { company } from '@/data/company'

// Informativa sul diritto di recesso ex artt. 52-59 D.Lgs. 206/2005,
// con modulo tipo di recesso (Allegato I, parte B). Testo da far validare a un legale.

export default function DirittoRecesso() {
  const params = useParams()
  const locale = (params?.locale as string) || 'it'
  const isEn = locale === 'en'

  const formBox = 'border border-gold/30 bg-gold/5 p-6 font-sans text-sm text-bianco/80 leading-relaxed'

  return (
    <>
      <Header />
      <main className="bg-nero min-h-screen pt-32 pb-20">
        <div className="container-custom max-w-4xl">
          <motion.div variants={luxuryFadeUp} initial="hidden" animate="visible">
            <h1 className="font-serif text-4xl md:text-5xl text-gold mb-8">
              {isEn ? 'Right of Withdrawal' : 'Diritto di Recesso'}
            </h1>
            <p className="text-bianco/60 text-sm mb-12">
              {isEn ? 'Last updated: July 9, 2026' : 'Ultimo aggiornamento: 9 luglio 2026'}
            </p>

            {isEn ? (
              <div className="space-y-8 text-bianco/80 font-sans text-sm leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">1. Withdrawal period</h2>
                  <p>
                    You have the right to withdraw from the contract, without giving any reason, within
                    <strong className="text-bianco"> 14 days</strong> from the day on which you (or a third party
                    designated by you, other than the carrier) acquire physical possession of the goods.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">2. Exceptions for food products</h2>
                  <p>
                    Pursuant to art. 59 of the Italian Consumer Code, the right of withdrawal does
                    <strong className="text-bianco"> not</strong> apply to:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>goods which are liable to deteriorate or expire rapidly (letter d);</li>
                    <li>sealed goods which are not suitable for return due to hygiene or health protection reasons and which have been <strong className="text-bianco">unsealed after delivery</strong> (letter e).</li>
                  </ul>
                  <p className="mt-3">
                    In practice: sealed and unopened products (bottled/canned oil, packaged pasta, flour, tomato
                    purée) <strong className="text-bianco">can</strong> be returned; opened or unsealed products cannot.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">3. How to withdraw</h2>
                  <p>
                    Send an unequivocal statement to {company.email} (or by post to {company.legalName},{' '}
                    {company.address.street}, {company.address.postalCode} {company.address.city} ({company.address.province}), Italy)
                    before the withdrawal period expires. You may use the model form below, but it is not compulsory.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">4. Effects</h2>
                  <p>
                    We will refund all payments received, including standard delivery costs, without undue delay and
                    in any event within 14 days of being informed of your withdrawal, using the same means of payment
                    you used. We may withhold the refund until we have received the goods back or you have supplied
                    evidence of having sent them. Return the goods without undue delay and in any event within 14
                    days of communicating the withdrawal. The <strong className="text-bianco">direct cost of returning
                    the goods is borne by you</strong>. You are liable for any diminished value resulting from handling
                    other than what is necessary to establish the nature and characteristics of the goods.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">5. Model withdrawal form</h2>
                  <div className={formBox}>
                    <p>
                      — To: {company.legalName}, {company.address.street}, {company.address.postalCode}{' '}
                      {company.address.city} ({company.address.province}), Italy — {company.email}<br /><br />
                      — I/We (*) hereby give notice that I/We (*) withdraw from my/our (*) contract of sale of the
                      following goods (*): ____________<br />
                      — Ordered on (*)/received on (*): ____________<br />
                      — Name of consumer(s): ____________<br />
                      — Address of consumer(s): ____________<br />
                      — Signature of consumer(s) (only if this form is notified on paper): ____________<br />
                      — Date: ____________<br /><br />
                      (*) Delete as appropriate.
                    </p>
                  </div>
                </section>
              </div>
            ) : (
              <div className="space-y-8 text-bianco/80 font-sans text-sm leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">1. Termine per il recesso</h2>
                  <p>
                    Hai il diritto di recedere dal contratto, senza indicarne le ragioni, entro
                    <strong className="text-bianco"> 14 giorni</strong> dal giorno in cui tu (o un terzo da te designato,
                    diverso dal vettore) acquisisci il possesso fisico dei beni (art. 52 D.Lgs. 206/2005).
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">2. Eccezioni per i prodotti alimentari</h2>
                  <p>
                    Ai sensi dell&apos;art. 59 del Codice del Consumo, il diritto di recesso è
                    <strong className="text-bianco"> escluso</strong> per:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>i beni che rischiano di deteriorarsi o scadere rapidamente (lett. d);</li>
                    <li>i beni sigillati che non si prestano ad essere restituiti per motivi igienici o connessi alla protezione della salute e che sono stati <strong className="text-bianco">aperti dopo la consegna</strong> (lett. e).</li>
                  </ul>
                  <p className="mt-3">
                    In pratica: i prodotti sigillati e non aperti (olio in bottiglia o latta, pasta confezionata,
                    farine, passata) <strong className="text-bianco">possono</strong> essere restituiti; i prodotti aperti
                    o con sigillo rimosso no.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">3. Come esercitare il recesso</h2>
                  <p>
                    Invia una dichiarazione esplicita a {company.email} (oppure per posta a {company.legalName},{' '}
                    {company.address.street}, {company.address.postalCode} {company.address.city} ({company.address.province}))
                    prima della scadenza del periodo di recesso. Puoi utilizzare il modulo tipo riportato sotto,
                    ma non è obbligatorio.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">4. Effetti del recesso</h2>
                  <p>
                    Ti rimborseremo tutti i pagamenti ricevuti, comprese le spese di consegna standard, senza
                    indebito ritardo e comunque entro 14 giorni dal giorno in cui siamo informati del recesso,
                    utilizzando lo stesso mezzo di pagamento usato per l&apos;acquisto. Possiamo trattenere il rimborso
                    finché non abbiamo ricevuto i beni oppure finché non avrai dimostrato di averli rispediti.
                    Restituisci i beni senza indebito ritardo e in ogni caso entro 14 giorni dalla comunicazione
                    del recesso. Il <strong className="text-bianco">costo diretto della restituzione è a tuo carico</strong>.
                    Sei responsabile della diminuzione di valore dei beni risultante da una manipolazione diversa
                    da quella necessaria per stabilirne natura e caratteristiche.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">5. Modulo tipo di recesso (Allegato I, parte B, Codice del Consumo)</h2>
                  <div className={formBox}>
                    <p>
                      — Destinatario: {company.legalName}, {company.address.street}, {company.address.postalCode}{' '}
                      {company.address.city} ({company.address.province}) — {company.email}<br /><br />
                      — Con la presente io/noi (*) notifichiamo il recesso dal mio/nostro (*) contratto di vendita
                      dei seguenti beni (*): ____________<br />
                      — Ordinato il (*)/ricevuto il (*): ____________<br />
                      — Nome del/dei consumatore/i: ____________<br />
                      — Indirizzo del/dei consumatore/i: ____________<br />
                      — Firma del/dei consumatore/i (solo se il modulo è notificato in versione cartacea): ____________<br />
                      — Data: ____________<br /><br />
                      (*) Cancellare la dicitura inutile.
                    </p>
                  </div>
                </section>
              </div>
            )}
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
