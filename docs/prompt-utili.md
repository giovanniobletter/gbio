# Prompt Utili per Claude

Raccolta di prompt efficaci, filtrati da suggerimenti vari.

---

## 1. Chain-of-Density (per riassunti)

```
Crea un riassunto di densità progressiva in 5 step.
Ogni step deve essere più denso del precedente (più fatti, meno parole).
Step 1 = 50-60 parole
Step 5 = massimo 130 parole ma con altissima densità informativa.
Usa solo informazioni realmente presenti nel testo.
```

**Quando usarlo:** Riassumere articoli, documenti, research.

---

## 2. Meta-prompt Engineer (per migliorare prompt)

```
Sto scrivendo un prompt per Claude per fare [compito].
Ecco la versione attuale:
"""
[incolla prompt]
"""
Come lo miglioreresti?
1) Rendi più chiaro l'obiettivo
2) Aggiungi guardrail contro allucinazioni
3) Inserisci esempi se serve few-shot
4) Scrivi la versione 2.0 migliorata
```

**Quando usarlo:** Quando un prompt non dà risultati soddisfacenti.

---

## 3. Deep Research

```
Fai una ricerca approfondita su [argomento]:
1) Panoramica generale
2) 5-8 fatti/trend più importanti
3) Controversie / punti di vista opposti
4) Sviluppi recenti (ultimi 12 mesi)
5) Previsione prossimi 18 mesi
```

**Quando usarlo:** Esplorare un tema nuovo prima di prendere decisioni.

---

## 4. Editor Testi (versione snella)

```
Riscrivi questo testo eliminando il 30-50% delle parole senza perdere significato.
Elimina: frasi filler, aggettivi inutili, voce passiva non necessaria.
Dopo la versione migliorata, elenca cosa hai tagliato.
```

**Quando usarlo:** Testi marketing, copy per il sito, email.

---

## 5. Idea → PRD veloce

```
Trasforma questa idea in un PRD snello:
[descrizione idea]

Struttura:
1) Problema
2) Utenti target
3) Must-have features
4) Nice-to-have
5) Metriche di successo
6) Domande aperte
```

**Quando usarlo:** Definire nuove feature prima di svilupparle.

---

## Note

- Con Claude Code, non serve chiedere "extended thinking" - è già attivo
- Non serve il roleplay "sei un esperto con 20 anni..." - non migliora le risposte
- Per coding pratico, basta chiedere direttamente cosa serve
