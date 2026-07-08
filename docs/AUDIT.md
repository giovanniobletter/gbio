# AUDIT — gbio.it

**Data:** 8 luglio 2026 · **Fase 0** (solo lettura, nessuna modifica al codice)
**Commit di riferimento:** `e14abae` su `main` · Sito in produzione: https://gbio.it

---

## Executive summary

Il sito è in buona salute strutturale: build pulita, contenuti **già server-renderizzati** (il timore di rendering client-side è infondato: home e pagine prodotto sono SSG con HTML completo), prezzi validati lato server, firma webhook Stripe verificata, banner cookie con blocco preventivo di GA conforme al Garante.

I problemi seri stanno altrove:

| # | Finding | Severità |
|---|---------|----------|
| C1 | Autenticazione finta: utenti e password salvati in `localStorage` del browser | **Critico** |
| C2 | Mancano Termini e condizioni di vendita e diritto di recesso (Codice del Consumo) | **Critico** |
| C3 | Informazioni alimentari obbligatorie assenti: ingredienti, **allergeni (glutine!)**, valori nutrizionali (Reg. UE 1169/2011) | **Critico** |
| C4 | Next.js 14.2.5 con vulnerabilità note di severità critical (cache poisoning, DoS) | **Critico** |
| A1 | HTML injection nelle email ordine (dati cliente non escapati) | Alto |
| A2 | Pagamenti asincroni (`redirect_status=processing`) mostrati come "falliti" → rischio doppio pagamento | Alto |
| A3 | Nessuna persistenza ordini + webhook senza idempotenza (email duplicate/perse) | Alto |
| A4 | `https://www.gbio.it` non funziona: certificato TLS non copre il sottodominio www | Alto |
| A5 | Canonical errato su quasi tutte le pagine + hreflang assente (versione EN invisibile a Google) | Alto |
| A6 | Nessun rate limiting sulle API (`/api/chat` = costi Claude API illimitati, `/api/contact` = spam) | Alto |
| A7 | Security headers assenti (CSP, X-Frame-Options, X-Content-Type-Options, ...) | Alto |

Dettaglio completo nelle sezioni sotto. Findings totali: 4 Critici, 8 Alti, 13 Medi, 12 Bassi.

---

## 1. Stack e architettura

- **Framework:** Next.js **14.2.5** (App Router) + TypeScript 5.5, React 18.3
- **Styling/UI:** Tailwind CSS 3.4, Framer Motion 11, Lucide icons
- **i18n:** next-intl 4.7 — locale attive **solo `it` e `en`** (`src/i18n/config.ts`), `localePrefix: 'always'`. Esistono 6 file messages (de/fr/ru/zh inutilizzati — dead code)
- **Hosting:** Vercel (nessun `vercel.json`; nessuna configurazione headers)
- **Pagamenti:** Stripe live — Payment Element via `/api/create-payment-intent` (flusso attivo). Esiste anche `/api/checkout` (Checkout Session legacy, non più usato dal frontend ma pubblico)
- **Email:** Resend (`ordini@gbio.it` per ordini, `noreply@gbio.it` per contatti)
- **Chatbot:** "Robin" — Claude Haiku 4.5 via `/api/chat`
- **Analytics:** GA4 `G-VNGY3S1T6K`, caricato solo dopo consenso cookie ✓
- **Database: NESSUNO.** Prodotti hardcoded in `src/data/products.ts` (12 prodotti); ordini esistono solo come metadata dei PaymentIntent Stripe + email; "utenti" in localStorage (vedi C1)
- **Crypto payments:** modulo presente in `src/lib/crypto/` ma **non attivo** (dead code, wallet placeholder)

### Dipendenze (`npm audit`: 44 vulnerabilità — 1 critical, 26 high, 16 moderate, 1 low)

| Pacchetto | Problema | Impatto |
|---|---|---|
| `next` 14.2.5 | **CRITICAL**: cache poisoning, DoS image optimization, DoS Server Actions (+ nella serie 14.2.x < 14.2.25 c'è anche il bypass del middleware CVE-2025-29927) | **Runtime, produzione**. Fix: upgrade a ultima 14.2.x |
| `vercel` CLI 50.x (devDependency) | Quasi tutte le 26 high (undici, path-to-regexp, tar…) | Solo build/dev, non runtime. Valutare rimozione dal package.json (il deploy è via GitHub) |
| `@anthropic-ai/sdk` 0.80 | 2 moderate (memory tool, non usato qui) | Basso; fix = major upgrade |
| `resend` → `svix` → `uuid` | 1 moderate | Basso |
| `caniuse-lite` | Vecchio di 7 mesi (warning build) | Cosmetico: `npx update-browserslist-db` |

---

## 2. Mappa route e flusso d'acquisto

### Pagine (57 pagine statiche generate, tutte SSG ●)

| Route | Note |
|---|---|
| `/` | redirect **307** → `/it` (meglio 308 permanente) |
| `/[locale]` (it, en) | Home one-page: Hero, Products, Heritage, Territory, Certifications, BoxedSets, Contact |
| `/[locale]/prodotti/[id]` | 12 prodotti × 2 locale, SSG con `generateStaticParams` |
| `/[locale]/checkout` + `/checkout/success` | Checkout 2 step (indirizzo → pagamento) |
| `/[locale]/privacy`, `/[locale]/cookies` | Pagine legali esistenti |
| `/[locale]/account`, `/[locale]/auth/{login,register,reset-password}` | Basate sull'auth finta (C1) |
| `/api/{chat, checkout, contact, create-payment-intent, webhook}` | 5 API route dinamiche |
| `/sitemap.xml`, `/robots.txt` | Generati da `src/app/sitemap.ts` / `robots.ts` |

### Flusso d'acquisto end-to-end (verificato nel codice)

1. **Catalogo → carrello:** `addItem()` di `CartContext` (reducer React), persistito in `localStorage` (`gbio-cart` + `gbio-shipping-zone`)
2. **Carrello → checkout:** `CartDrawer` → `/{locale}/checkout`. Spedizione calcolata client-side da `lib/shipping.ts` (Italia €7,90 gratis ≥€60; Europa €14,90 gratis ≥€100; extra-UE €19,90)
3. **Step indirizzo:** validazione client → `POST /api/create-payment-intent`. Il server **rivalida prodotti e prezzi da `products.ts`** (i prezzi del client sono ignorati ✓), ricalcola la spedizione, crea il PaymentIntent con i dati ordine nei metadata, restituisce il `clientSecret`
4. **Step pagamento:** Stripe Payment Element → `confirmPayment` con `return_url` → `/checkout/success`
5. **Success:** legge `redirect_status`, svuota il carrello, mostra un numero d'ordine **generato client-side** (fittizio, vedi M4)
6. **Email:** webhook `payment_intent.succeeded` (firma verificata ✓) → Resend invia conferma al cliente + notifica a `gb.obletter@gmail.com`

---

## 3. Findings — CRITICO

### C1 — Autenticazione completamente finta, password nel browser
`src/context/AuthContext.tsx:128-148, 191-250`
Non esiste backend: gli utenti registrati vengono salvati in `localStorage` (`gbio-users`) con un hash giocattolo (`simpleHash`, invertibile all'istante). Le password (spesso riusate dagli utenti su altri siti) sono leggibili da qualsiasi script della pagina o accesso al browser. `resetPassword` finge di inviare un'email ma non fa nulla; "Elimina account" fa solo logout. L'account funziona solo sul singolo browser. Oltre al rischio sicurezza è un problema GDPR (dati "gestiti" senza alcuna infrastruttura reale).
**Rimedio:** la Fase 2 (Clerk) sostituisce integralmente questo sistema. Nel frattempo valutare di nascondere login/registrazione.

### C2 — Mancano Termini e condizioni di vendita e diritto di recesso
Non esiste alcuna pagina termini/condizioni/recesso/resi/spedizioni. Per un e-commerce B2C italiano sono obbligatori (D.Lgs. 206/2005, artt. 49 ss.): condizioni di vendita, recesso 14 giorni con modulo tipo (con le esenzioni art. 59 per alimentari deperibili/sigillati da dichiarare), garanzia legale, tempi e costi di consegna. Esposizione a sanzioni AGCM. → **Fase 1**

### C3 — Informazioni alimentari obbligatorie assenti (Reg. UE 1169/2011, art. 14)
`src/types/index.ts:11-16` — il modello prodotto ha solo `origin`, `certification`, `weight`, `harvest`. Mancano ovunque: elenco ingredienti, **allergeni evidenziati (la pasta Senatore Cappelli contiene glutine — mai menzionato)**, denominazione legale, valori nutrizionali, operatore alimentare, condizioni di conservazione. Nella vendita a distanza devono essere disponibili **prima** dell'acquisto. → **Fase 1**

### C4 — Next.js 14.2.5 vulnerabile (critical)
`package.json:20` — cache poisoning, DoS via image optimization e Server Actions; la serie 14.2.x sotto la 14.2.25 include anche il celebre bypass di autorizzazione del middleware (CVE-2025-29927). Il sito usa il middleware (next-intl). **Fix disponibile senza breaking changes: upgrade all'ultima 14.2.x.** → **Fase 3**

---

## 4. Findings — ALTO

### A1 — HTML injection nelle email ordine
`src/lib/email.ts:54, 63, 77-79, 116-127` + `src/app/api/create-payment-intent/route.ts:69-108`
Nome, indirizzo, telefono e note di consegna inseriti dal cliente finiscono nei metadata Stripe e da lì **interpolati senza escape nell'HTML** delle email di conferma/notifica. Chiunque effettui un ordine può iniettare HTML (phishing) nell'email che il venditore riceve e ritiene affidabile. Il pattern corretto esiste già in `/api/contact/route.ts:6-13` (`escapeHtml`) — va applicato anche in `email.ts`. → **Fase 3** (fix da 10 minuti)

### A2 — `redirect_status=processing` trattato come pagamento fallito
`src/app/[locale]/checkout/success/page.tsx:23-24` — `isFailed = redirectStatus !== 'succeeded'`. Con `automatic_payment_methods` attivo, metodi asincroni redirigono con `processing`: il cliente vedrebbe "pagamento fallito" e potrebbe pagare di nuovo → doppio addebito. Gestire esplicitamente lo stato `processing`. → **Fase 3**

### A3 — Nessuna persistenza ordini + webhook non idempotente
`src/app/api/webhook/route.ts:25-48` — l'ordine esiste solo come metadata PI + 2 email. Se Resend fallisce (`email.ts:96-98` inghiotte l'errore), l'ordine pagato è invisibile salvo controllo manuale della dashboard Stripe. Nessun dedupe su `event.id`: i retry di Stripe producono email duplicate. La tab "Ordini" dell'account è hardcoded vuota. → **Fase 3/5** (persistenza minima + idempotenza)

### A4 — www.gbio.it non raggiungibile (errore certificato TLS)
DNS: `www.gbio.it` è CNAME → `gbio.it` → 76.76.21.21 (Vercel), ma il certificato emesso copre solo `gbio.it` perché **il dominio www non è aggiunto al progetto Vercel**. Chi digita `www.gbio.it` vede un errore di sicurezza del browser. **Fix manuale (nessun codice): aggiungere `www.gbio.it` nei Domains del progetto Vercel con redirect verso l'apex.** → azione Giovanni/Vercel dashboard

### A5 — Canonical errato + hreflang assente
`src/app/[locale]/layout.tsx:73-75` — `canonical: 'https://gbio.it'` hardcoded nel layout → ereditato da home it/en, privacy, cookies, checkout, account (tutte dichiarano come canonica la root, che è un redirect). Confermato in produzione e segnalato anche da Lighthouse ("Document does not have a valid rel=canonical"). Nessun `alternates.languages` in tutto il progetto: /it e /en risultano duplicati non collegati → la versione EN è di fatto invisibile. Solo le pagine prodotto hanno canonical corretto. → **Fase 4** (priorità n. 1)

### A6 — Nessun rate limiting su nessuna API
- `/api/chat`: chiunque può invocare Claude API a volontà (history illimitata inclusa) → **abuso di costi** diretto sulla bolletta Anthropic
- `/api/contact`: spam di email via Resend (l'endpoint accetta POST illimitati)
- `/api/create-payment-intent`: creazione illimitata di PaymentIntent orfani
→ **Fase 3** (rate limiting con Upstash Redis o Vercel Firewall)

### A7 — Security headers assenti
Risposta di produzione: presente solo `strict-transport-security`. Mancano: `Content-Security-Policy`, `X-Frame-Options`/`frame-ancestors` (clickjacking sul checkout!), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`. Nessun `headers()` in `next.config.js` né `vercel.json`. → **Fase 3**

### A8 — JSON-LD Product hardcoded nel root layout su OGNI pagina
`src/app/layout.tsx:105-147` — tre snippet `Product` (con prezzi hardcoded, destinati a divergere da `products.ts`) sono iniettati su tutte le pagine, incluse privacy e checkout. Viola le linee guida Google (rischio azione manuale "spammy structured markup"). I Product corretti per-pagina esistono già in `prodotti/[id]/page.tsx`. → **Fase 4** (rimozione)

---

## 5. Findings — MEDIO

| # | Finding | Dove | Note |
|---|---------|------|------|
| M1 | Importo PaymentIntent congelato vs carrello vivo: il riepilogo mostra il totale live, il PI resta a quello del submit; nessuna sync tra tab (`storage` event non ascoltato) | `checkout/page.tsx:131-144` | Divergenza mostrato/addebitato possibile; PI `incomplete` orfani a ogni back-and-forth |
| M2 | Carrello da localStorage senza validazione: prodotti serializzati interi, prezzi snapshot vecchi, item corrotti non scartati | `CartContext.tsx:129-139` | Re-idratare da `products.ts` per id |
| M3 | Quantità senza cap nel drawer (`+` illimitato); server sanitizza solo il minimo | `CartDrawer.tsx:152-160`, `create-payment-intent/route.ts:47` | Importi assurdi → errore Stripe generico |
| M4 | Numero d'ordine fittizio generato client-side (`GBO-${Date.now()}` / `Math.random()`), non esiste in Stripe né nelle email | `success/page.tsx:26-28`, `checkout/page.tsx:224` | Usare l'id del PaymentIntent |
| M5 | Refresh durante il checkout: form e step persi (solo stato React), PI orfano | `checkout/page.tsx:51-55` | UX fragile, nessuna perdita di denaro |
| M6 | Endpoint legacy `/api/checkout` pubblico e non usato; `success?session_id=x` qualsiasi mostra "ordine confermato" e svuota il carrello senza verifica | `api/checkout/route.ts`, `success/page.tsx:21-23` | Rimuovere o proteggere |
| M7 | Sitemap copre solo /it: home, 12 prodotti e legali EN assenti; niente `alternates.languages` | `sitemap.ts:8-29` | → Fase 4 |
| M8 | `robots.ts` `disallow: /checkout/` non matcha le URL reali `/it/checkout`; account/auth indicizzabili | `robots.ts:8` | Meglio `robots:{index:false}` sulle pagine |
| M9 | Metadata prodotto non localizzati su /en (title/desc/OG/JSON-LD in italiano); `og:locale` incoerente (`en_GB` vs `en_US`) | `prodotti/[id]/page.tsx:18-37` | → Fase 4 |
| M10 | Privacy, cookies, checkout, account senza metadata propri → title duplicati | `privacy/page.tsx`, `cookies/page.tsx` | → Fase 4 |
| M11 | Nessuna revoca del consenso cookie: manca link "Gestisci cookie" nel footer (GDPR art. 7.3: revocare dev'essere facile come consentire) | `Footer.tsx`, `CookieBanner.tsx` | → Fase 1 |
| M12 | Privacy policy incoerente: dichiara "legittimo interesse" per GA mentre il banner (correttamente) chiede il consenso; non menziona chatbot Robin/Anthropic né Resend tra i responsabili | `privacy/page.tsx:166-196` | → Fase 1 |
| M13 | Dati societari incompleti nel footer: solo P.IVA. Mancano ragione sociale, **PEC** (obbligatoria, art. 5 D.L. 179/2012), REA | `Footer.tsx:52` | → Fase 1 (dati da Giovanni) |

---

## 6. Findings — BASSO

| # | Finding | Dove |
|---|---------|------|
| B1 | Modulo crypto dead code con wallet placeholder ("UPDATE BEFORE LAUNCH") — mai importato; da rimuovere per igiene | `src/lib/crypto/*` |
| B2 | Messaggi d'errore interni (`details: errorMessage`) esposti nelle risposte JSON | `create-payment-intent/route.ts:119`, `checkout/route.ts:117` |
| B3 | `ProtectedRoute` dead code e buggato (redirect senza prefisso locale) | `ProtectedRoute.tsx:19` |
| B4 | Form contatti: email non validata come formato prima dell'uso come `reply_to` | `api/contact/route.ts` |
| B5 | `body.style.overflow` senza cleanup allo smontaggio (scroll che resta bloccato) | `CartContext.tsx:159-165` |
| B6 | Redirect root `/` → `/it` è 307 temporaneo; meglio `permanentRedirect()` (308) | `src/app/page.tsx:5` |
| B7 | OG image del locale layout è un SVG 600×120 (`logo-gbio.svg`): i social non supportano SVG → condivisioni senza immagine. Il corretto `/og-image.jpg` esiste ma viene sovrascritto | `[locale]/layout.tsx:54-67` |
| B8 | `og:url` fisso alla root per ogni pagina | `[locale]/layout.tsx:50` |
| B9 | `lastModified: new Date()` in sitemap = freshness fasulla | `sitemap.ts:9,17` |
| B10 | H1 home senza keyword (solo tagline); alt text generici (`alt={product.name}`); "Scopri di più" hardcoded in italiano su /en | `Hero.tsx:80-87`, `Products.tsx:76,146` |
| B11 | Warning ESLint build: `<img>` invece di `next/image` | `Territory.tsx:321` |
| B12 | Errore console in produzione: `<circle> attribute cy: Expected length, "undefined"` (SVG decorativo) — rilevato da Lighthouse | chunk `817-*.js` (componente decorativo da individuare) |
| B13 | Locale morte: 4 file messages (de/fr/ru/zh) e `localeMap` esteso mai usati | `src/messages/`, `[locale]/layout.tsx:21-28` |
| B14 | Email di contatto pubblica ovunque è `gb.obletter@gmail.com` invece di un indirizzo @gbio.it | `Footer.tsx`, `Contact.tsx` |

---

## 7. Qualità — misurazioni

### Build (`npm run build`)
✓ Compila senza errori · 57/57 pagine statiche generate · 1 warning ESLint (B11) · First Load JS: 87-189 kB (nella norma)

### Lighthouse (mobile emulato, da locale, su https://gbio.it/it)

| Categoria | Score |
|---|---|
| Performance | **81** |
| Accessibility | 90 |
| Best Practices | 96 |
| SEO | 92 |

Metriche: FCP 1,0s ✓ · **LCP 4,2s ✗** (target <2,5s) · TBT 0ms ✓ · CLS 0 ✓ · Speed Index 5,7s ✗
Problemi puntuali: LCP alto (immagine hero), ~77 KiB risparmiabili sulle immagini, errore console (B12), canonical non valido (A5), bottoni/link senza nome accessibile e heading order non sequenziale (accessibilità — rilevante anche per l'European Accessibility Act, vedi Fase 1).

### Link interni
Tutti i 29 link interni della home rispondono 200 (le ancore `/it/#...` passano per un 308 di normalizzazione — innocuo). 404 gestiti correttamente (prodotto inesistente → 404 con pagina custom).

---

## 8. Rendering (verifica per la Fase 4)

**Esito: il sito è già server-renderizzato.** Verificato con `curl` (senza JavaScript):
- Home `/it`: HTML iniziale di 204 KB con tutti i contenuti testuali (nomi prodotti, sezioni, prezzi)
- Pagina prodotto: HTML completo con JSON-LD `Product` + `BreadcrumbList` + `LocalBusiness`
- Tutte le pagine sono SSG (●) al build

La Fase 4 quindi **non richiede** la migrazione a SSR: le priorità diventano canonical/hreflang (A5), sitemap EN (M7), JSON-LD nel root layout (A8), OG image (B7), LCP (sez. 7).

## 9. Sicurezza — riepilogo

| Controllo | Esito |
|---|---|
| Firma webhook Stripe verificata | ✓ (`constructEvent` con `whsec`) |
| Prezzi calcolati server-side | ✓ (client ignorato) |
| Dati carta sui nostri server | ✓ mai (Stripe Elements) |
| Secrets nel codice / history git | ✓ nessuno (scan su src + `git log -G`, .env correttamente ignorati) |
| Escape input utente | ✗ manca nelle email ordine (A1); ✓ nel form contatti |
| Rate limiting | ✗ assente ovunque (A6) |
| Security headers | ✗ solo HSTS (A7) |
| Idempotenza webhook | ✗ (A3) |
| HTTPS/certificati | ✓ apex; ✗ www (A4) |
| Dipendenze | ✗ Next.js critical (C4); resto per lo più devDependency |

---

## 10. Note positive

- Architettura semplice e coerente; nessun dato di carta transita sui server
- SSG completo con `generateStaticParams` per prodotti × locale
- Banner cookie conforme (blocco preventivo GA, rifiuto equivalente all'accettazione)
- Privacy e cookie policy ben strutturate (da aggiornare, non da rifare)
- BreadcrumbList + Product JSON-LD già presenti sulle pagine prodotto
- Doppio click sul pagamento già protetto (`isProcessing` + PI riusato)

## 11. Azioni manuali per Giovanni (emerse in Fase 0)

1. **Vercel → Settings → Domains:** aggiungere `www.gbio.it` con redirect all'apex (fix A4, 2 minuti)
2. Tenere a portata di mano per la Fase 1: ragione sociale esatta, **PEC**, numero REA, dati per termini di vendita
3. Per la Fase 2: creare la nuova application Clerk e fornire le chiavi
