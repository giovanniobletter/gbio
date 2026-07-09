'use client'

import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { luxuryFadeUp } from '@/lib/animations'

export default function PrivacyPolicy() {
  const params = useParams()
  const locale = (params?.locale as string) || 'it'
  const isEn = locale === 'en'

  return (
    <>
      <Header />
      <main className="bg-nero min-h-screen pt-32 pb-20">
        <div className="container-custom max-w-4xl">
          <motion.div
            variants={luxuryFadeUp}
            initial="hidden"
            animate="visible"
            className="prose prose-invert prose-gold max-w-none"
          >
            <h1 className="font-serif text-4xl md:text-5xl text-gold mb-8">Privacy Policy</h1>
            <p className="text-bianco/60 text-sm mb-12">
              {isEn ? 'Last updated: February 16, 2026' : 'Ultimo aggiornamento: 16 febbraio 2026'}
            </p>

            {isEn ? (
              <div className="space-y-8 text-bianco/80 font-sans text-sm leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">1. Data Controller</h2>
                  <p>
                    The data controller is:<br />
                    <strong className="text-bianco">Azienda Agricola Obletter Giovanni Battista</strong><br />
                    Via Sicilia, Fraz. Villanova 2/a, 65012 Cepagatti (PE), Italy<br />
                    VAT: IT02773610692<br />
                    Email: gb.obletter@gmail.com<br />
                    Tel: +39 392 636 2254
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">2. Data Collected</h2>
                  <p>The website collects the following personal data:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li><strong className="text-bianco">Browsing data:</strong> IP address, browser type, pages visited, access time (collected automatically via technical and analytics cookies).</li>
                    <li><strong className="text-bianco">Voluntarily provided data:</strong> name, email, phone and message via the contact form.</li>
                    <li><strong className="text-bianco">Purchase data:</strong> name, shipping address, payment details (handled by Stripe, acting as an external data processor).</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">3. Purpose of Processing</h2>
                  <p>Personal data is processed for the following purposes:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Responding to enquiries submitted via the contact form.</li>
                    <li>Managing orders and shipments of purchased products.</li>
                    <li>Statistical analysis of web traffic (Google Analytics).</li>
                    <li>Responding to questions submitted to the &quot;Robin&quot; chat assistant.</li>
                    <li>Legal compliance and tax obligations.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">4. Legal Basis</h2>
                  <p>
                    Data processing is based on: consent of the data subject (art. 6.1.a GDPR) for sending communications
                    and for analytics cookies (Google Analytics), which are activated only after your consent via the
                    cookie banner; performance of a contract (art. 6.1.b GDPR) for order management;
                    legal obligation (art. 6.1.c GDPR) for tax compliance.
                    You can withdraw your cookie consent at any time via the &quot;Manage cookies&quot; link in the footer.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">5. Data Retention</h2>
                  <p>
                    Personal data is retained only for the time strictly necessary for the purposes for which it was collected:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Contact form data: maximum 12 months.</li>
                    <li>Purchase data: 10 years (tax obligations).</li>
                    <li>Browsing data: 26 months (Google Analytics).</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">6. Sharing with Third Parties</h2>
                  <p>Data may be shared with:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li><strong className="text-bianco">Stripe Inc.</strong> — for payment processing.</li>
                    <li><strong className="text-bianco">Google LLC</strong> — for statistical analysis (Google Analytics).</li>
                    <li><strong className="text-bianco">Vercel Inc.</strong> — for website hosting.</li>
                    <li><strong className="text-bianco">Resend Inc.</strong> — for sending transactional emails (order confirmations, contact form).</li>
                    <li><strong className="text-bianco">Anthropic PBC</strong> — for the &quot;Robin&quot; chat assistant: messages you type in the chat are processed by the Claude API to generate replies. Do not enter personal data in the chat.</li>
                  </ul>
                  <p className="mt-3">Data is never sold to third parties.</p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">7. Your Rights</h2>
                  <p>Under articles 15–22 of the GDPR, you have the right to:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Access your personal data.</li>
                    <li>Request rectification or erasure of data.</li>
                    <li>Restrict or object to processing.</li>
                    <li>Request data portability.</li>
                    <li>Withdraw consent at any time.</li>
                    <li>Lodge a complaint with the Italian Data Protection Authority.</li>
                  </ul>
                  <p className="mt-3">
                    To exercise your rights, contact: <a href="mailto:gb.obletter@gmail.com" className="text-gold hover:underline">gb.obletter@gmail.com</a>
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">8. Security</h2>
                  <p>
                    We adopt appropriate technical and organizational measures to protect personal data from unauthorized access,
                    loss or destruction. The website uses the HTTPS protocol for secure data transmission.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">9. Changes to this Privacy Policy</h2>
                  <p>
                    We reserve the right to amend this Privacy Policy at any time.
                    Changes will be published on this page with the updated date.
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-8 text-bianco/80 font-sans text-sm leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">1. Titolare del Trattamento</h2>
                  <p>
                    Il titolare del trattamento dei dati personali è:<br />
                    <strong className="text-bianco">Azienda Agricola Obletter Giovanni Battista</strong><br />
                    Via Sicilia, Fraz. Villanova 2/a, 65012 Cepagatti (PE)<br />
                    P.IVA: IT02773610692<br />
                    Email: gb.obletter@gmail.com<br />
                    Tel: +39 392 636 2254
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">2. Dati Raccolti</h2>
                  <p>Il sito raccoglie i seguenti dati personali:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li><strong className="text-bianco">Dati di navigazione:</strong> indirizzo IP, tipo di browser, pagine visitate, orario di accesso (raccolti automaticamente tramite cookie tecnici e analytics).</li>
                    <li><strong className="text-bianco">Dati forniti volontariamente:</strong> nome, email, telefono e messaggio tramite il modulo di contatto.</li>
                    <li><strong className="text-bianco">Dati di acquisto:</strong> nome, indirizzo di spedizione, dati di pagamento (gestiti tramite Stripe, che agisce come responsabile esterno del trattamento).</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">3. Finalità del Trattamento</h2>
                  <p>I dati personali sono trattati per le seguenti finalità:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Rispondere alle richieste inviate tramite il modulo di contatto.</li>
                    <li>Gestire gli ordini e le spedizioni dei prodotti acquistati.</li>
                    <li>Analisi statistica del traffico web (Google Analytics).</li>
                    <li>Risposta alle domande poste all&apos;assistente virtuale &quot;Robin&quot;.</li>
                    <li>Adempimenti di legge e obblighi fiscali.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">4. Base Giuridica</h2>
                  <p>
                    Il trattamento dei dati si basa su: consenso dell&apos;interessato (art. 6.1.a GDPR) per l&apos;invio di
                    comunicazioni e per i cookie analitici (Google Analytics), attivati solo dopo il consenso espresso
                    tramite il banner; esecuzione di un contratto (art. 6.1.b GDPR) per la gestione degli ordini;
                    obbligo legale (art. 6.1.c GDPR) per gli adempimenti fiscali.
                    Puoi revocare il consenso ai cookie in qualsiasi momento tramite il link &quot;Gestisci cookie&quot; nel footer.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">5. Conservazione dei Dati</h2>
                  <p>
                    I dati personali sono conservati per il tempo strettamente necessario alle finalità per cui sono stati raccolti:
                  </p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Dati del modulo di contatto: massimo 12 mesi.</li>
                    <li>Dati di acquisto: 10 anni (obblighi fiscali).</li>
                    <li>Dati di navigazione: 26 mesi (Google Analytics).</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">6. Condivisione con Terzi</h2>
                  <p>I dati possono essere condivisi con:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li><strong className="text-bianco">Stripe Inc.</strong> — per l&apos;elaborazione dei pagamenti.</li>
                    <li><strong className="text-bianco">Google LLC</strong> — per le analisi statistiche (Google Analytics).</li>
                    <li><strong className="text-bianco">Vercel Inc.</strong> — per l&apos;hosting del sito web.</li>
                    <li><strong className="text-bianco">Resend Inc.</strong> — per l&apos;invio delle email transazionali (conferme d&apos;ordine, modulo contatti).</li>
                    <li><strong className="text-bianco">Anthropic PBC</strong> — per l&apos;assistente virtuale &quot;Robin&quot;: i messaggi scritti in chat sono elaborati dalla API Claude per generare le risposte. Ti invitiamo a non inserire dati personali nella chat.</li>
                  </ul>
                  <p className="mt-3">I dati non vengono venduti a terzi.</p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">7. Diritti dell&apos;Interessato</h2>
                  <p>Ai sensi degli artt. 15-22 del GDPR, l&apos;utente ha diritto di:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-3">
                    <li>Accedere ai propri dati personali.</li>
                    <li>Richiedere la rettifica o la cancellazione dei dati.</li>
                    <li>Limitare o opporsi al trattamento.</li>
                    <li>Richiedere la portabilità dei dati.</li>
                    <li>Revocare il consenso in qualsiasi momento.</li>
                    <li>Proporre reclamo al Garante per la Protezione dei Dati Personali.</li>
                  </ul>
                  <p className="mt-3">
                    Per esercitare i propri diritti, contattare: <a href="mailto:gb.obletter@gmail.com" className="text-gold hover:underline">gb.obletter@gmail.com</a>
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">8. Sicurezza</h2>
                  <p>
                    Adottiamo misure tecniche e organizzative adeguate per proteggere i dati personali da accessi non autorizzati,
                    perdita o distruzione. Il sito utilizza il protocollo HTTPS per la trasmissione sicura dei dati.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">9. Modifiche alla Privacy Policy</h2>
                  <p>
                    Ci riserviamo il diritto di modificare questa Privacy Policy in qualsiasi momento.
                    Le modifiche saranno pubblicate su questa pagina con la data di aggiornamento.
                  </p>
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
