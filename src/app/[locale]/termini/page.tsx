'use client'

import { motion } from 'framer-motion'
import { useParams } from 'next/navigation'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { luxuryFadeUp } from '@/lib/animations'
import { company } from '@/data/company'

// Condizioni generali di vendita — informazioni precontrattuali ex art. 49
// D.Lgs. 206/2005 (Codice del Consumo). Testo da far validare a un legale.

export default function TerminiVendita() {
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
          >
            <h1 className="font-serif text-4xl md:text-5xl text-gold mb-8">
              {isEn ? 'Terms and Conditions of Sale' : 'Termini e Condizioni di Vendita'}
            </h1>
            <p className="text-bianco/60 text-sm mb-12">
              {isEn ? 'Last updated: July 9, 2026' : 'Ultimo aggiornamento: 9 luglio 2026'}
            </p>

            {isEn ? (
              <div className="space-y-8 text-bianco/80 font-sans text-sm leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">1. Seller identification</h2>
                  <p>
                    The products offered on gbio.it are sold by:<br />
                    <strong className="text-bianco">{company.legalName}</strong><br />
                    {company.address.street}, {company.address.postalCode} {company.address.city} ({company.address.province}), Italy<br />
                    VAT: {company.vatNumber}
                    {company.rea && <><br />Business Register (REA): {company.rea}</>}
                    {company.pec && <><br />Certified email (PEC): {company.pec}</>}
                    <br />Email: {company.email} — Tel: {company.phoneDisplay}
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">2. Scope</h2>
                  <p>
                    These terms govern distance sales concluded through gbio.it between the Seller and
                    consumers, pursuant to Italian Legislative Decree 206/2005 (Consumer Code) and
                    Legislative Decree 70/2003 (e-commerce). Placing an order implies acceptance of these terms.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">3. Products and prices</h2>
                  <p>
                    Product characteristics, food information (ingredients, allergens, net quantity, origin,
                    nutrition facts) are shown on each product page before purchase. All prices are in Euro and
                    <strong className="text-bianco"> include VAT</strong>. Shipping costs are shown before payment and
                    added to the total: Italy €7.90 (free over €60), EU €14.90 (free over €100), non-EU (UK/Switzerland) €19.90.
                    The total price, inclusive of taxes and delivery costs, is always displayed before the order is confirmed.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">4. Ordering and payment</h2>
                  <p>
                    The order is placed by completing the checkout and pressing the payment button, which entails an
                    obligation to pay. Payments are processed by Stripe (cards, Apple Pay, Google Pay) with strong
                    customer authentication (PSD2/SCA); no card data touches our servers. An order confirmation
                    with the full summary is sent by email. An invoice is issued only if requested at the time of ordering.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">5. Delivery</h2>
                  <p>
                    Orders are shipped by courier within 3 working days of payment; delivery typically takes
                    24–72 hours in Italy and 3–7 working days abroad. In any case delivery occurs within 30 days
                    of the order. Please report visible damage to the parcel to the courier upon delivery.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">6. Right of withdrawal</h2>
                  <p>
                    You may withdraw within <strong className="text-bianco">14 days</strong> of receiving the goods, without
                    giving any reason, as described on the <a href={`/${locale}/recesso`} className="text-gold hover:underline">Right of withdrawal</a> page,
                    which includes the withdrawal form. <strong className="text-bianco">Exceptions</strong> (art. 59 Consumer Code):
                    withdrawal does not apply to goods liable to deteriorate or expire rapidly, nor to sealed food
                    products that have been unsealed after delivery for hygiene reasons. Sealed, unopened products
                    (oil, pasta, flour, preserves) can be returned.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">7. Legal guarantee of conformity</h2>
                  <p>
                    All products are covered by the legal guarantee of conformity (artt. 128 ff. Consumer Code):
                    the Seller is liable for lack of conformity that becomes apparent within two years of delivery
                    (within the product&apos;s shelf life for perishable goods). In case of non-conformity you are entitled
                    to replacement, price reduction or refund. Contact us at {company.email}.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">8. Disputes and ADR</h2>
                  <p>
                    For any dispute you may contact us first at {company.email}. Pursuant to art. 141-sexies of the
                    Italian Consumer Code, consumers may resort to alternative dispute resolution (ADR) bodies,
                    such as the mediation service of the Chieti-Pescara Chamber of Commerce; the list of ADR bodies
                    is published by the Italian Ministry of Enterprise (MIMIT). For consumers resident in Italy,
                    the court of the consumer&apos;s place of residence has jurisdiction.
                  </p>
                </section>
              </div>
            ) : (
              <div className="space-y-8 text-bianco/80 font-sans text-sm leading-relaxed">
                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">1. Identificazione del venditore</h2>
                  <p>
                    I prodotti offerti su gbio.it sono venduti da:<br />
                    <strong className="text-bianco">{company.legalName}</strong><br />
                    {company.address.street}, {company.address.postalCode} {company.address.city} ({company.address.province})<br />
                    P.IVA {company.vatNumber}
                    {company.rea && <><br />REA: {company.rea}</>}
                    {company.pec && <><br />PEC: {company.pec}</>}
                    <br />Email: {company.email} — Tel: {company.phoneDisplay}
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">2. Ambito di applicazione</h2>
                  <p>
                    Le presenti condizioni regolano le vendite a distanza concluse tramite gbio.it tra il Venditore
                    e i consumatori, ai sensi del D.Lgs. 206/2005 (Codice del Consumo) e del D.Lgs. 70/2003
                    (commercio elettronico). L&apos;invio dell&apos;ordine comporta l&apos;accettazione delle presenti condizioni.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">3. Prodotti e prezzi</h2>
                  <p>
                    Le caratteristiche dei prodotti e le informazioni alimentari obbligatorie (ingredienti, allergeni,
                    quantità netta, origine, valori nutrizionali) sono riportate su ciascuna pagina prodotto prima
                    dell&apos;acquisto, ai sensi del Reg. UE 1169/2011. Tutti i prezzi sono espressi in Euro e
                    <strong className="text-bianco"> comprensivi di IVA</strong>. Le spese di spedizione sono indicate prima del
                    pagamento e si sommano al totale: Italia €7,90 (gratuita sopra €60), UE €14,90 (gratuita sopra €100),
                    extra-UE (UK/Svizzera) €19,90. Il prezzo totale, comprensivo di imposte e spese di consegna,
                    è sempre visibile prima della conferma dell&apos;ordine.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">4. Ordine e pagamento</h2>
                  <p>
                    L&apos;ordine si conclude completando il checkout e premendo il pulsante di pagamento, che comporta
                    l&apos;obbligo di pagare (art. 51, c. 2, Codice del Consumo). I pagamenti sono gestiti da Stripe
                    (carte, Apple Pay, Google Pay) con autenticazione forte del cliente (PSD2/SCA); nessun dato
                    della carta transita sui nostri server. Una conferma d&apos;ordine con il riepilogo completo viene
                    inviata via email. La fattura viene emessa solo se richiesta al momento dell&apos;ordine
                    (art. 22 DPR 633/72), compilando l&apos;apposita sezione al checkout.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">5. Consegna</h2>
                  <p>
                    Gli ordini sono affidati al corriere entro 3 giorni lavorativi dal pagamento; la consegna
                    avviene di norma in 24–72 ore in Italia e in 3–7 giorni lavorativi all&apos;estero. In ogni caso la
                    consegna avviene entro 30 giorni dall&apos;ordine (art. 61 Codice del Consumo). Eventuali danni
                    visibili del collo vanno segnalati al corriere al momento della consegna.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">6. Diritto di recesso</h2>
                  <p>
                    Hai diritto di recedere entro <strong className="text-bianco">14 giorni</strong> dal ricevimento dei prodotti,
                    senza indicare alcuna motivazione, secondo le modalità descritte nella pagina{' '}
                    <a href={`/${locale}/recesso`} className="text-gold hover:underline">Diritto di recesso</a>, che
                    include il modulo di recesso. <strong className="text-bianco">Eccezioni</strong> (art. 59 Codice del
                    Consumo): il recesso è escluso per i beni che rischiano di deteriorarsi o scadere rapidamente
                    e per i beni sigillati che non si prestano ad essere restituiti per motivi igienici, se aperti
                    dopo la consegna. I prodotti sigillati e non aperti (olio, pasta, farine, conserve) possono
                    essere restituiti.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">7. Garanzia legale di conformità</h2>
                  <p>
                    Tutti i prodotti sono coperti dalla garanzia legale di conformità (artt. 128 e ss. Codice del
                    Consumo): il Venditore risponde dei difetti di conformità che si manifestano entro due anni
                    dalla consegna (entro il termine di conservazione per i prodotti deperibili). In caso di
                    difetto di conformità hai diritto alla sostituzione, alla riduzione del prezzo o al rimborso.
                    Scrivi a {company.email}.
                  </p>
                </section>

                <section>
                  <h2 className="font-serif text-xl text-gold mb-4">8. Reclami e risoluzione delle controversie</h2>
                  <p>
                    Per qualsiasi reclamo puoi contattarci a {company.email}. Ai sensi dell&apos;art. 141-sexies del
                    Codice del Consumo, il consumatore può ricorrere agli organismi di risoluzione alternativa
                    delle controversie (ADR), come il servizio di mediazione della Camera di Commercio
                    Chieti-Pescara; l&apos;elenco degli organismi ADR è pubblicato dal Ministero delle Imprese e del
                    Made in Italy (MIMIT). Per i consumatori residenti in Italia è competente il foro del luogo
                    di residenza o domicilio del consumatore.
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
