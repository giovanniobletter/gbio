// Dati societari ufficiali — unica fonte di verità per footer, pagine legali ed email.
// I campi contrassegnati TODO vanno confermati da Giovanni prima del deploy.

export const company = {
  legalName: 'Azienda Agricola Obletter Giovanni Battista',
  shortName: 'GBiO',
  vatNumber: 'IT02773610692',
  // TODO: confermare numero REA (Camera di Commercio Chieti-Pescara)
  rea: '', // es. 'PE-201234'
  // TODO: confermare indirizzo PEC (obbligatorio, art. 5 D.L. 179/2012)
  pec: '',
  address: {
    street: 'Via Sicilia, Fraz. Villanova 2/a',
    postalCode: '65012',
    city: 'Cepagatti',
    province: 'PE',
    country: 'Italia',
  },
  email: 'ordini@gbio.it',
  contactEmail: 'gb.obletter@gmail.com',
  phone: '+39 392 636 2254',
  phoneDisplay: '+39 392 636 2254',
  site: 'https://gbio.it',
} as const

/** Riga unica con i dati identificativi, per footer ed email. */
export function companyLegalLine(): string {
  const parts = [
    company.legalName,
    `${company.address.street}, ${company.address.postalCode} ${company.address.city} (${company.address.province})`,
    `P.IVA ${company.vatNumber}`,
  ]
  if (company.rea) parts.push(`REA ${company.rea}`)
  if (company.pec) parts.push(`PEC ${company.pec}`)
  return parts.join(' — ')
}
