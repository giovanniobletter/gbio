// Validazione dei codici fiscali italiani (persona fisica) e delle partite IVA.
// Entrambe le funzioni verificano il carattere/cifra di controllo, non solo il formato.

// Tabelle di conversione per il carattere di controllo del CF
// (fonte: specifica del Ministero delle Finanze, DM 12/03/1974)
const CF_ODD_VALUES: Record<string, number> = {
  '0': 1, '1': 0, '2': 5, '3': 7, '4': 9, '5': 13, '6': 15, '7': 17, '8': 19, '9': 21,
  A: 1, B: 0, C: 5, D: 7, E: 9, F: 13, G: 15, H: 17, I: 19, J: 21,
  K: 2, L: 4, M: 18, N: 20, O: 11, P: 3, Q: 6, R: 8, S: 12, T: 14,
  U: 16, V: 10, W: 22, X: 25, Y: 24, Z: 23,
}

const CF_EVEN_VALUES: Record<string, number> = {
  '0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9,
  A: 0, B: 1, C: 2, D: 3, E: 4, F: 5, G: 6, H: 7, I: 8, J: 9,
  K: 10, L: 11, M: 12, N: 13, O: 14, P: 15, Q: 16, R: 17, S: 18, T: 19,
  U: 20, V: 21, W: 22, X: 23, Y: 24, Z: 25,
}

// Struttura del CF con supporto omocodia (cifre sostituite da LMNPQRSTUV)
const CF_PATTERN = /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[ABCDEHLMPRST][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/

/**
 * Valida un codice fiscale di persona fisica (16 caratteri) verificando
 * struttura e carattere di controllo. Gestisce i codici omocodici.
 */
export function isValidCodiceFiscale(input: string): boolean {
  const cf = input.trim().toUpperCase()
  if (cf.length !== 16 || !CF_PATTERN.test(cf)) return false

  let sum = 0
  for (let i = 0; i < 15; i++) {
    const char = cf[i]
    // posizioni dispari in base 1 = indici pari in base 0
    sum += i % 2 === 0 ? CF_ODD_VALUES[char] : CF_EVEN_VALUES[char]
  }
  const expected = String.fromCharCode(65 + (sum % 26))
  return cf[15] === expected
}

/**
 * Valida una partita IVA italiana (11 cifre) verificando la cifra di
 * controllo (algoritmo Luhn-like, art. 35 DPR 633/72).
 */
export function isValidPartitaIva(input: string): boolean {
  const piva = input.trim().replace(/^IT/i, '')
  if (!/^\d{11}$/.test(piva)) return false

  let sum = 0
  for (let i = 0; i < 10; i++) {
    let digit = Number(piva[i])
    if (i % 2 === 1) {
      digit *= 2
      if (digit > 9) digit -= 9
    }
    sum += digit
  }
  const check = (10 - (sum % 10)) % 10
  return check === Number(piva[10])
}

/** Codice destinatario SDI: 7 caratteri alfanumerici ("0000000" = canale PEC/consumatore). */
export function isValidCodiceSdi(input: string): boolean {
  return /^[A-Za-z0-9]{7}$/.test(input.trim())
}

/** Validazione formato PEC/email (formale, non verifica che sia una PEC reale). */
export function isValidEmailFormat(input: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(input.trim())
}
