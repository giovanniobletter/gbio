'use client'

import { motion } from 'framer-motion'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { luxuryFadeUp } from '@/lib/animations'

export default function CookiePolicy() {
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
            <h1 className="font-serif text-4xl md:text-5xl text-gold mb-8">Cookie Policy</h1>
            <p className="text-bianco/60 text-sm mb-12">Ultimo aggiornamento: 16 febbraio 2026</p>

            <div className="space-y-8 text-bianco/80 font-sans text-sm leading-relaxed">
              <section>
                <h2 className="font-serif text-xl text-gold mb-4">1. Cosa sono i Cookie</h2>
                <p>
                  I cookie sono piccoli file di testo che i siti web visitati inviano al browser dell&apos;utente,
                  dove vengono memorizzati per essere ritrasmessi agli stessi siti alla visita successiva.
                  I cookie sono utilizzati per diverse finalità, hanno caratteristiche diverse e possono essere
                  utilizzati sia dal titolare del sito che da terze parti.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-gold mb-4">2. Tipologie di Cookie Utilizzati</h2>

                <h3 className="font-serif text-lg text-bianco mt-6 mb-3">Cookie Tecnici (necessari)</h3>
                <p>
                  Sono essenziali per il corretto funzionamento del sito. Includono cookie di sessione,
                  preferenze di lingua e gestione del carrello. Non richiedono il consenso dell&apos;utente.
                </p>

                <div className="mt-4 border border-gold/20 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold/20 bg-gold/5">
                        <th className="text-left p-3 text-gold font-sans text-xs uppercase tracking-wider">Cookie</th>
                        <th className="text-left p-3 text-gold font-sans text-xs uppercase tracking-wider">Finalità</th>
                        <th className="text-left p-3 text-gold font-sans text-xs uppercase tracking-wider">Durata</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gold/10">
                        <td className="p-3 text-bianco">NEXT_LOCALE</td>
                        <td className="p-3">Lingua selezionata</td>
                        <td className="p-3">Sessione</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="p-3 text-bianco">cart</td>
                        <td className="p-3">Contenuto del carrello</td>
                        <td className="p-3">30 giorni</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-serif text-lg text-bianco mt-6 mb-3">Cookie Analitici (Google Analytics)</h3>
                <p>
                  Utilizziamo Google Analytics per raccogliere informazioni anonime sull&apos;utilizzo del sito,
                  come il numero di visitatori, le pagine più visitate e la provenienza del traffico.
                  Questi cookie vengono installati solo previo consenso dell&apos;utente.
                </p>

                <div className="mt-4 border border-gold/20 overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gold/20 bg-gold/5">
                        <th className="text-left p-3 text-gold font-sans text-xs uppercase tracking-wider">Cookie</th>
                        <th className="text-left p-3 text-gold font-sans text-xs uppercase tracking-wider">Finalità</th>
                        <th className="text-left p-3 text-gold font-sans text-xs uppercase tracking-wider">Durata</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b border-gold/10">
                        <td className="p-3 text-bianco">_ga</td>
                        <td className="p-3">Distingue gli utenti</td>
                        <td className="p-3">2 anni</td>
                      </tr>
                      <tr className="border-b border-gold/10">
                        <td className="p-3 text-bianco">_ga_*</td>
                        <td className="p-3">Mantiene lo stato della sessione</td>
                        <td className="p-3">2 anni</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <h3 className="font-serif text-lg text-bianco mt-6 mb-3">Cookie di Terze Parti (Stripe)</h3>
                <p>
                  Durante il processo di pagamento, Stripe può installare cookie necessari per l&apos;elaborazione
                  sicura della transazione e la prevenzione delle frodi.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-gold mb-4">3. Gestione dei Cookie</h2>
                <p>
                  L&apos;utente può gestire le preferenze relative ai cookie direttamente dal proprio browser.
                  Di seguito i link alle istruzioni dei principali browser:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><a href="https://support.google.com/chrome/answer/95647" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Google Chrome</a></li>
                  <li><a href="https://support.mozilla.org/it/kb/Gestione%20dei%20cookie" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Mozilla Firefox</a></li>
                  <li><a href="https://support.apple.com/it-it/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Apple Safari</a></li>
                  <li><a href="https://support.microsoft.com/it-it/help/17442/windows-internet-explorer-delete-manage-cookies" target="_blank" rel="noopener noreferrer" className="text-gold hover:underline">Microsoft Edge</a></li>
                </ul>
                <p className="mt-3">
                  La disabilitazione dei cookie tecnici potrebbe compromettere il corretto funzionamento del sito.
                </p>
              </section>

              <section>
                <h2 className="font-serif text-xl text-gold mb-4">4. Riferimenti Normativi</h2>
                <p>
                  La presente Cookie Policy è redatta in conformità a:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Regolamento UE 2016/679 (GDPR)</li>
                  <li>D.Lgs. 196/2003 (Codice Privacy) come modificato dal D.Lgs. 101/2018</li>
                  <li>Linee guida del Garante per la Protezione dei Dati Personali del 10 giugno 2021</li>
                </ul>
              </section>

              <section>
                <h2 className="font-serif text-xl text-gold mb-4">5. Contatti</h2>
                <p>
                  Per qualsiasi domanda relativa ai cookie utilizzati su questo sito, contattare:<br />
                  <a href="mailto:gb.obletter@gmail.com" className="text-gold hover:underline">gb.obletter@gmail.com</a>
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
