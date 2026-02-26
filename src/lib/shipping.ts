export type ShippingZone = 'italia' | 'europa' | 'extra_eu'

interface ShippingZoneConfig {
  cost: number
  freeThreshold: number | null // null = mai gratuita
}

const ZONE_CONFIG: Record<ShippingZone, ShippingZoneConfig> = {
  italia: { cost: 7.90, freeThreshold: 60 },
  europa: { cost: 14.90, freeThreshold: 100 },
  extra_eu: { cost: 19.90, freeThreshold: null },
}

const COUNTRY_TO_ZONE: Record<string, ShippingZone> = {
  IT: 'italia',
  // Europa UE
  FR: 'europa', DE: 'europa', AT: 'europa', ES: 'europa', PT: 'europa',
  NL: 'europa', BE: 'europa', LU: 'europa', IE: 'europa', PL: 'europa',
  CZ: 'europa', SK: 'europa', HU: 'europa', RO: 'europa', BG: 'europa',
  HR: 'europa', SI: 'europa', EL: 'europa', CY: 'europa', MT: 'europa',
  EE: 'europa', LV: 'europa', LT: 'europa', FI: 'europa', SE: 'europa',
  DK: 'europa',
  // Extra UE
  GB: 'extra_eu', CH: 'extra_eu',
}

export interface CountryOption {
  code: string
  name: string
}

export const COUNTRIES: CountryOption[] = [
  // Italia
  { code: 'IT', name: 'Italia' },
  // Europa UE (ordine alfabetico per nome italiano)
  { code: 'AT', name: 'Austria' },
  { code: 'BE', name: 'Belgio' },
  { code: 'BG', name: 'Bulgaria' },
  { code: 'CY', name: 'Cipro' },
  { code: 'HR', name: 'Croazia' },
  { code: 'DK', name: 'Danimarca' },
  { code: 'EE', name: 'Estonia' },
  { code: 'FI', name: 'Finlandia' },
  { code: 'FR', name: 'Francia' },
  { code: 'DE', name: 'Germania' },
  { code: 'EL', name: 'Grecia' },
  { code: 'IE', name: 'Irlanda' },
  { code: 'LV', name: 'Lettonia' },
  { code: 'LT', name: 'Lituania' },
  { code: 'LU', name: 'Lussemburgo' },
  { code: 'MT', name: 'Malta' },
  { code: 'NL', name: 'Paesi Bassi' },
  { code: 'PL', name: 'Polonia' },
  { code: 'PT', name: 'Portogallo' },
  { code: 'CZ', name: 'Repubblica Ceca' },
  { code: 'RO', name: 'Romania' },
  { code: 'SK', name: 'Slovacchia' },
  { code: 'SI', name: 'Slovenia' },
  { code: 'ES', name: 'Spagna' },
  { code: 'SE', name: 'Svezia' },
  { code: 'HU', name: 'Ungheria' },
  // Extra UE
  { code: 'GB', name: 'Regno Unito' },
  { code: 'CH', name: 'Svizzera' },
]

export function getShippingZone(countryCode: string): ShippingZone {
  return COUNTRY_TO_ZONE[countryCode] || 'europa'
}

export function getShippingCost(
  zone: ShippingZone,
  subtotal: number
): { cost: number; freeThreshold: number | null } {
  const config = ZONE_CONFIG[zone]
  const cost =
    config.freeThreshold !== null && subtotal >= config.freeThreshold
      ? 0
      : config.cost
  return { cost, freeThreshold: config.freeThreshold }
}

export function isValidShippingZone(zone: string): zone is ShippingZone {
  return zone === 'italia' || zone === 'europa' || zone === 'extra_eu'
}

export const ALL_COUNTRY_CODES = Object.keys(COUNTRY_TO_ZONE)
