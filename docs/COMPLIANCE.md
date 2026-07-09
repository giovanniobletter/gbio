# COMPLIANCE — gbio.it

**Data:** 9 luglio 2026 · **Fase 1** — Conformità legale e-commerce alimentare B2C
Normativa verificata con ricerche su fonti ufficiali (luglio 2026). Le fonti sono citate in ogni sezione.
Legenda: ✅ implementato · 🔶 implementato ma richiede dati/verifica di Giovanni · 📋 azione manuale (nessun codice) · 👨‍💼 domanda per commercialista/legale

---

## 1. Fatturazione

### Quadro normativo verificato
- **Commercio elettronico indiretto = vendita per corrispondenza** (Ris. AdE 274/E/2009): rientra nell'art. 22, c.1, n.1 DPR 633/72 → **la fattura si emette solo se richiesta dal cliente non oltre il momento di effettuazione dell'operazione**. Fonti: [Brocardi art. 22](https://www.brocardi.it/testo-unico-iva/titolo-ii/art22.html), [Fiscomania](https://fiscomania.com/certificazione-corrispettivi-ecommerce/)
- **Esonero corrispettivi telematici** vigente: art. 2, c.1, lett. oo) DPR 696/1996 + DM 10/5/2019 art. 1, c.1, lett. a) → niente registratore telematico per le vendite del sito. Resta l'**annotazione nel registro dei corrispettivi ex art. 24 DPR 633/72** (entro il giorno non festivo successivo). Fonti: [AdE](https://www.agenziaentrate.gov.it/portale/normativa-e-prassi-corrispettivi-telematici-fe), [Euroconference](https://www.ecnews.it/e-commerce-indiretto-esonerato-dalla-trasmissione-telematica-dei-corrispettivi/), interpello 198/2019
- **Fattura elettronica B2C via SdI**: per privati CodiceDestinatario `0000000` + solo Codice Fiscale (copia PDF al cliente, originale nell'area riservata AdE); per aziende P.IVA + codice SDI (7 caratteri) o PEC. Fonti: [Fiscomania](https://fiscomania.com/codice-destinatario/), [BibLus](https://biblus.acca.it/fattura-elettronica-a-privati/)

### Implementato
- ✅ **Checkbox "Richiedi fattura" al checkout** (prima del pagamento, come richiede l'art. 22): per privati campo **Codice Fiscale validato con l'algoritmo del carattere di controllo** (non solo regex, gestisce anche l'omocodia — `src/lib/fiscal.ts`); per aziende **Ragione sociale + P.IVA (cifra di controllo validata) + Codice SDI o PEC** (almeno uno dei due obbligatorio)
- ✅ Validazione sia client sia server (`/api/create-payment-intent` rifiuta dati fiscali non validi)
- ✅ I dati fattura sono salvati nei **metadata del PaymentIntent Stripe** (`fattura_richiesta`, `fattura_cf`, `fattura_piva`, `fattura_sdi`, `fattura_pec`, ...) e arrivano nella **email di notifica al venditore con il riquadro "⚠ Fattura da emettere"** e oggetto marcato `[FATTURA]`
- ✅ Il cliente riceve conferma della richiesta fattura nella propria email d'ordine

### Da fare manualmente
- 👨‍💼 **Domande per il commercialista** (dalla ricerca fiscale):
  1. Siamo in regime speciale art. 34 o ordinario? Come gestiamo contabilmente l'**impresa mista** (art. 34, c.5): olio in regime speciale (Tabella A Parte I, voce 33), ma **pasta, semolato e passata NON sono in Parte I** → "operazioni diverse" con registrazione distinta e detrazione analitica
  2. Molitura/pastificazione conto terzi: la filiera mantiene la qualifica di attività connessa (art. 2135 c.c.) ai fini reddituali? IVA con detrazione analitica sugli acquisti dedicati?
  3. Percentuale di compensazione olio 4% vigente: conviene restare in regime speciale o optare per l'ordinario dato il mix?
  4. Come vuole ricevere il flusso ordini per l'annotazione dei corrispettivi (export Stripe mensile?)
  5. Chi emette materialmente la fattura elettronica quando richiesta (commercialista su segnalazione email? software dedicato?)
- 👨‍💼 Confermare l'inquadramento del "semolato" nella voce 10 Tabella A Parte II

## 2. Dati societari obbligatori sul sito

### Quadro normativo verificato
- **Art. 7 D.Lgs. 70/2003**: nome/ditta, sede, recapiti incluso email, registro imprese + numero REA, P.IVA — accessibili in modo facile, diretto e permanente. [Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2003-04-09;70~art7)
- **Art. 35, c.1 DPR 633/72**: P.IVA nella home page (vigente fino al 31/12/2026; dal 2027 confluisce nel TU IVA D.Lgs. 10/2026 — 👨‍💼 verificare nuova collocazione)
- **PEC obbligatoria** per imprese individuali iscritte al Registro Imprese, incluso l'imprenditore agricolo in sezione speciale (art. 5 D.L. 179/2012); sanzioni ex art. 2194 c.c. triplicate

### Implementato
- ✅ Footer con ragione sociale, indirizzo sede, P.IVA su ogni pagina (`src/data/company.ts` è l'unica fonte di verità)
- ✅ Email di contatto pubblica cambiata in `ordini@gbio.it`
- 🔶 **REA e PEC: campi predisposti ma VUOTI** in `src/data/company.ts` — appena Giovanni fornisce i valori compaiono automaticamente in footer, termini e recesso
  - Formato suggerito REA: "Registro Imprese Chieti-Pescara, sez. speciale imprese agricole — REA PE-xxxxxx"

### Da fare manualmente
- 📋 **Giovanni**: fornire numero REA (visura camerale) e indirizzo PEC → compilare `src/data/company.ts`

## 3. Codice del Consumo

### Quadro normativo verificato ([dettagli e fonti Normattiva](https://www.normattiva.it/uri-res/N2Ls?urn:nir:stato:decreto.legislativo:2005-09-06;206))
- Art. 49: informazioni precontrattuali (identità, prezzo totale con imposte e spedizione, recesso con modulo All. I-B, garanzia legale, ADR...)
- Art. 51 c.2: pulsante con formulazione "ordine con obbligo di pagare" o equivalente
- Art. 52-53: recesso 14 giorni; estensione a 12 mesi se il consumatore non è informato
- Art. 59: esclusioni — lett. d) beni a rapido deterioramento, lett. e) beni sigillati aperti dopo la consegna (motivi igienici)
- Artt. 128-135-septies (post D.Lgs. 170/2021): garanzia legale 2 anni, azione 26 mesi, rimedi: sostituzione/riparazione → riduzione prezzo/risoluzione
- **ODR europea DISMESSA** (Reg. UE 2024/3228, abrogazione dal 20/7/2025): il link ODR non va messo; resta l'informativa ADR ex art. 141-sexies
- ⚠️ **Scadenza futura: 27/09/2026** — D.Lgs. 30/2026 (Dir. UE 2024/825) modifica l'art. 49: avviso armonizzato garanzia legale + nuovi obblighi informativi pre-ordine. **Da mettere in agenda.**

### Implementato
- ✅ Pagina **`/termini`** (it+en): identità venditore, prezzi IVA inclusa, spedizioni con soglie, ordine con obbligo di pagare, consegna entro 30 giorni (art. 61), recesso con rimando, garanzia legale con rimedi, ADR (mediazione Camera di Commercio Chieti-Pescara, elenco MIMIT), foro del consumatore
- ✅ Pagina **`/recesso`** (it+en): 14 giorni, esclusioni art. 59 spiegate per i prodotti GBiO (sigillato non aperto = restituibile; aperto = no), procedura, effetti e costi di reso a carico del cliente, **modulo tipo Allegato I parte B** completo
- ✅ Checkout: totale IVA e spedizione inclusi visibile PRIMA del pagamento sulla stessa schermata (riepilogo sticky), dicitura "IVA e spese di spedizione incluse", nota "pagando invii un ordine con obbligo di pagare e accetti i termini" sotto il pulsante Paga
- ✅ Nessun link ODR presente sul sito (verificato)
- ✅ Footer: link a Termini e Recesso su ogni pagina

### Da fare manualmente
- 📋 Far **validare i testi legali** di /termini e /recesso a un legale (in particolare: qualificazione "deperibilità" art. 59 lett. d per la passata; tempi di consegna dichiarati)
- 📋 **Agenda 27/09/2026**: adeguamento art. 49 post D.Lgs. 30/2026 (avviso armonizzato garanzia)

## 4. Privacy e cookie

### Quadro normativo verificato
- Linee guida Garante 10/6/2021 ([doc. 9677876](https://www.garanteprivacy.it/home/docweb/-/docweb-display/docweb/9677876)): consenso preventivo, rifiuto di pari evidenza, **revoca facile quanto il consenso (link permanente)**, no cookie wall, riproposizione non prima di 6 mesi

### Implementato
- ✅ Il banner era già conforme su consenso preventivo (GA caricato solo dopo accept) e rifiuto equivalente — confermato
- ✅ **Nuovo link "Gestisci cookie" nel footer**: riapre il banner, cancella la scelta e **rimuove i cookie `_ga`/`_ga_*`/`_gid`** (GDPR art. 7.3)
- ✅ Anche il rifiuto ora cancella eventuali cookie GA residui
- ✅ Privacy policy corretta: base giuridica GA = **consenso** (prima dichiarava erroneamente legittimo interesse, in contrasto col banner); aggiunti **Resend** e **Anthropic (chatbot Robin)** tra i destinatari, con avvertenza a non inserire dati personali in chat
- ✅ La scelta è persistita in localStorage senza scadenza → il banner non viene riproposto prima di 6 mesi (conforme)

### Da fare manualmente
- 📋 Far validare privacy e cookie policy aggiornate a un legale/DPO

## 5. Alimenti venduti a distanza (Reg. UE 1169/2011)

### Quadro normativo verificato
- **Art. 14, par. 1, lett. a)** ([consolidato EUR-Lex 01/04/2025](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:02011R1169-20250401)): per gli alimenti preimballati venduti a distanza tutte le informazioni obbligatorie **tranne il TMC/scadenza** devono essere disponibili **prima della conclusione dell'acquisto**, sul supporto di vendita (**la pagina prodotto va bene**), senza costi aggiuntivi. Tutte (incluso TMC) alla consegna sull'etichetta fisica
- **Responsabile**: l'OSA a cui nome il prodotto è commercializzato (art. 8) = GBiO. Sanzioni: **2.000–16.000 €** (art. 7 D.Lgs. 231/2017, autorità ICQRF; riduzione 1/3 per microimprese)
- **Esenzioni dichiarazione nutrizionale (All. V + [Q&A Commissione 2018/C 196/01](https://eur-lex.europa.eu/legal-content/IT/TXT/HTML/?uri=CELEX:52018XC0608(01)))**: **olio NON esente** (è trasformato), **pasta NON esente**, **passata NON esente**; **farine/semolato mono-ingrediente ESENTI** (la sola macinatura non è trasformazione). L'esenzione "piccole quantità/livello locale" (punto 19) **NON vale per l'e-commerce nazionale** ([circolare MISE-Salute 16/11/2016](https://www.mimit.gov.it/images/stories/normativa/Circolare-deroga-allegato-V-punto-19-16-11-2016.pdf): solo provincia e contermini)
- **Olio** ([Reg. delegato 2022/2104 consolidato](https://eur-lex.europa.eu/legal-content/IT/TXT/HTML/?uri=CELEX:02022R2104-20240610), L. 9/2013, D.Lgs. 103/2016): denominazione «olio extra vergine di oliva»; dicitura categoria esatta «olio **di oliva** di categoria superiore ottenuto direttamente dalle olive e unicamente mediante procedimenti meccanici»; conservazione «al riparo della luce e dal calore»; **campagna di raccolta obbligatoria** per olio 100% italiano monocampagna; il tetto TMC 18 mesi **non esiste più** (abrogato dalla L. 122/2016); max 5L al consumatore finale con antirabbocco (3L e 5L ok)
- **DOP** ([Reg. 2024/1143](https://eur-lex.europa.eu/legal-content/IT/TXT/?uri=CELEX:32024R1143)): **simbolo UE DOP obbligatorio anche sul materiale pubblicitario → anche sulla pagina prodotto del sito** (art. 37.3); **dal 14/5/2026 nome del produttore nello stesso campo visivo della denominazione DOP** (art. 37.5, Circolare Masaf 110473/2026); organismo di controllo in etichetta non obbligatorio. Disciplinare "Aprutino Pescarese": vietati aggettivi tipo *selezionato/superiore/genuino*, obbligatoria l'annata
- **Bio** ([Reg. 2018/848 consolidato](https://eur-lex.europa.eu/legal-content/IT/TXT/PDF/?uri=CELEX:02018R0848-20250325), Reg. 2021/279, D.Lgs. 148/2023): logo bio UE obbligatorio sui preconfezionati + codice **IT-BIO-XXX** nello stesso campo visivo + «Agricoltura Italia» (≥95% materie prime italiane). **Prodotti "in conversione": logo bio UE VIETATO**, ammessa solo la dicitura «prodotto in conversione all'agricoltura biologica» (≥12 mesi conversione, un solo ingrediente vegetale — la pasta di sola semola ok), codice OdC comunque obbligatorio. ⚠️ **La vendita online bio è attività soggetta a controllo**: l'esenzione da notifica vale solo per la vendita diretta fisica
- **Pasta** ([DPR 187/2001](https://www.normattiva.it/uri-res/N2Ls?urn:nir:presidente.repubblica:decreto:2001-02-09;187)): denominazione «pasta di semola di grano duro»; **decreto origine grano 26/7/2017 prorogato fino al 31/12/2026**: diciture esatte «Paese di coltivazione del grano: ...» + «Paese di molitura: ...»; glutine: «GRANO» evidenziato negli ingredienti
- **Passata** (DM 23/9/2005 + [DM 17/2/2006](https://www.ambientediritto.it/Legislazione/consumatori/2006/dm_17feb2006.htm), permanente): denominazione riservata (5–12 °Brix, no concentrato); obbligo **«Pomodoro coltivato in [Regione/Italia]»**

### Implementato
- ✅ Modello dati `FoodInfo` + sezione **"Informazioni alimentari"** su ogni pagina prodotto, **prima dell'acquisto**: denominazione legale, ingredienti con allergeni in MAIUSCOLO, riquadro allergeni (glutine su pasta e farine), quantità netta, conservazione, OSA, origine, codice OdC, tabella nutrizionale (ordine All. XV: energia kJ+kcal → grassi → saturi → carboidrati → zuccheri → proteine → sale)
- ✅ Diciture corrette dalla ricerca: categoria olio testuale 2022/2104, «Da conservare al riparo della luce e dal calore», «Campagna di raccolta 2025/2026», «Paese di coltivazione del grano: Italia — Paese di molitura: Italia», «Pomodoro coltivato in Abruzzo (Italia)», «Prodotto in conversione all'agricoltura biologica» su pasta/farine/passata
- ✅ Farine: tabella nutrizionale **rimossa** (esenti All. V punto 1 — meglio nessuna tabella che valori stimati non conformi all'art. 36)
- 🔶 Valori nutrizionali di olio/pasta/passata: valori standard di categoria marcati `TODO(Giovanni)` — **da sostituire con quelli delle etichette reali**

### Da fare manualmente — Giovanni con le etichette in mano
- 📋 In `src/data/products.ts` (cerca `TODO(Giovanni)`): valori nutrizionali reali di olio, pasta e passata; ingredienti esatti della passata (°Brix per la denominazione!); tracce della pasta; codice OdC esatto (IT-BIO-006 ICEA da confermare); campagna di raccolta a ogni annata; stabilimenti terzi (pastificio, mulino, trasformazione passata); tipo della farina di grano tenero (00/0/1/2/integrale)
- 📋 **Simbolo UE DOP da mostrare sulla pagina prodotto dell'olio** (obbligo art. 37.3 Reg. 2024/1143 sul materiale pubblicitario): serve l'asset grafico ufficiale UE — da aggiungere appena disponibile
- ⚠️ **3 azioni urgenti emerse dalla ricerca**:
  1. **Etichette fisiche olio DOP**: verificare conformità al nuovo obbligo del nome produttore accanto alla DOP (in vigore dal 14/5/2026 — etichette stampate prima vendibili a esaurimento)
  2. **Certificazione bio e-commerce**: chiedere a ICEA se la notifica SIB copre la vendita online (l'esenzione non vale a distanza; sanzioni fino al 5% del fatturato)
  3. **31/12/2026**: scadenza proroga decreti origine grano/pasta — monitorare eventuale rinnovo

## 6. Pagamenti

### Verificato e implementato
- ✅ **SCA/3DS (PSD2)**: gestito nativamente da Stripe Payment Element — Stripe applica la Strong Customer Authentication quando richiesta dall'issuer
- ✅ **Nessun dato carta sui nostri server**: Stripe Elements (iframe), il server vede solo il clientSecret
- ✅ **Email di conferma con riepilogo completo**: prodotti, quantità, prezzi, subtotale, spedizione, totale, indirizzo, note, (da questa fase) dati fattura — con escape HTML dei dati utente (fix sicurezza)
- ✅ **Aliquote IVA**: tutti i prodotti a catalogo (olio, pasta, farine, passata) sono al **4%** — Tabella A Parte II, voci 13 (olio), 15 (paste), 10 (farine/semole), 16 (conserve di pomodoro). Fonte: [Tabella A DPR 633/72](https://media.directio.it/portal/norme/19721026_DPR633_TabellaA.pdf), [Consulenza giuridica AdE 12/2021](https://www.agenziaentrate.gov.it/portale/documents/20143/0/Consulenza_giuridica_12_07.09.2021.pdf/a993e17b-eeb2-4285-db91-9fe55df4fdec). I prezzi sul sito sono IVA inclusa: nessuna modifica necessaria al checkout (B2C). ⚠️ Se in futuro si vendono **sughi pronti/salse condite** → aliquota 10%, non 4%
- ℹ️ I prezzi sono gestiti IVA-inclusa senza scorporo per aliquota: per lo scorporo in fattura provvede il commercialista (tutte le referenze attuali sono comunque al 4%)

## 7. Vendite UE e accessibilità

### Verificato
- **Soglia OSS €10.000/anno** (vendite a distanza intra-UE + servizi TTE, anno corrente + precedente): sotto → IVA italiana; sopra → IVA del paese di destinazione o iscrizione OSS (portale AdE, dichiarazione trimestrale). Fonte: [FAQ AdE OSS](https://www.agenziaentrate.gov.it/portale/risposte-alle-domande-piu-frequenti-oss). 📋 **Monitorare il totale annuo delle spedizioni UE**; vicino alla soglia → commercialista per iscrizione OSS preventiva
- **European Accessibility Act** (D.Lgs. 82/2022, in vigore dal 28/6/2025): l'e-commerce rientra (art. 1, c.3, lett. f), **ma le microimprese di servizi sono esentate** (art. 3, c.3: <10 occupati E fatturato ≤2 mln €) → **GBiO è esente**, nessun adempimento obbligatorio. 👨‍💼 Confermare le soglie col commercialista (occupati/fatturato dell'intera azienda agricola); se superate in futuro l'esenzione cade. Buona pratica volontaria: WCAG 2.1 AA (utile anche per SEO — vedi Fase 4/5)

---

## Riepilogo azioni per Giovanni

| # | Azione | Dove |
|---|--------|------|
| 1 | Fornire **numero REA** e **PEC** | → `src/data/company.ts` |
| 2 | Verificare **valori nutrizionali e ingredienti** con le etichette reali | → `src/data/products.ts` (cerca `TODO(Giovanni)`) |
| 3 | Indicare **stabilimenti terzi** (pastificio, mulino, trasformazione passata) se applicabile | → `src/data/products.ts` |
| 4 | Sessione col **commercialista**: impresa mista art. 34, corrispettivi, chi emette le fatture, OSS | domande pronte in §1 |
| 5 | Far **validare i testi legali** (termini, recesso, privacy, cookie) a un legale | pagine `/termini`, `/recesso`, `/privacy`, `/cookies` |
| 6 | **Agenda 27/09/2026**: adeguamento D.Lgs. 30/2026 (garanzia legale, art. 49) | — |
| 7 | Monitorare vendite UE vs soglia **OSS €10.000/anno** | dashboard Stripe |
| 8 | **Etichette olio**: verificare obbligo nome produttore accanto a DOP (dal 14/5/2026) | etichette fisiche |
| 9 | **ICEA**: confermare che la notifica bio copra la vendita e-commerce | telefonata/email a ICEA |
| 10 | Procurare il **simbolo UE DOP** ufficiale per la pagina prodotto olio | asset grafico |
| 11 | **31/12/2026**: scadenza decreti origine grano/pasta — verificare proroga | — |
