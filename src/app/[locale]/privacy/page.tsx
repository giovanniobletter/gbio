'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { luxuryFadeUp } from '@/lib/animations'

export default function PrivacyPolicy() {
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
            <p className="text-bianco/60 text-sm mb-12">Ultimo aggiornamento: 16 febbraio 2026</p>

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
                  <li>Analisi statistica anonima del traffico web (Google Analytics).</li>
                  <li>Adempimenti di legge e obblighi fiscali.</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-gold mb-4">4. Base Giuridica</h2>
                <p>
                  Il trattamento dei dati si basa su: consenso dell&apos;interessato (art. 6.1.a GDPR) per l&apos;invio di comunicazioni;
                  esecuzione di un contratto (art. 6.1.b GDPR) per la gestione degli ordini;
                  obbligo legale (art. 6.1.c GDPR) per gli adempimenti fiscali;
                  legittimo interesse (art. 6.1.f GDPR) per le analisi statistiche anonime.
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
          </motion.div>
        </div>
      </main>
      <Footer />
    </>
  )
}
