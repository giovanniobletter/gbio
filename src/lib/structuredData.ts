// Dati strutturati (schema.org) condivisi dalle offerte dei prodotti: spedizione e
// politica di reso, che Google richiede per le «Schede commercianti».
// I valori vengono da shipping.ts e dalle pagine Termini (§5 Consegna) e Recesso:
// se cambiano lì, vanno aggiornati anche qui.

import { ZONE_CONFIG, ALL_COUNTRY_CODES, getShippingZone, type ShippingZone } from './shipping'

const SITE = 'https://gbio.it'

// Il checkout usa «EL» per la Grecia (codice Eurostat); schema.org vuole ISO 3166-1 alpha-2.
const toIso = (code: string) => (code === 'EL' ? 'GR' : code)

// Tempi di transito dichiarati nei Termini: 24–72 ore in Italia, 3–7 giorni lavorativi all'estero.
const TRANSIT_DAYS: Record<ShippingZone, [number, number]> = {
  italia: [1, 3],
  europa: [3, 7],
  extra_eu: [3, 7],
}

// Affidamento al corriere entro 3 giorni lavorativi dal pagamento (Termini §5).
const HANDLING_DAYS: [number, number] = [0, 3]

function countriesOfZone(zone: ShippingZone): string[] {
  return ALL_COUNTRY_CODES.filter((c) => getShippingZone(c) === zone).map(toIso)
}

// Una voce per zona di spedizione. La tariffa è quella piena: la soglia di spedizione
// gratuita non è esprimibile nel markup supportato da Google.
export function offerShippingDetails() {
  return (Object.keys(ZONE_CONFIG) as ShippingZone[]).map((zone) => ({
    '@type': 'OfferShippingDetails',
    shippingRate: {
      '@type': 'MonetaryAmount',
      value: ZONE_CONFIG[zone].cost,
      currency: 'EUR',
    },
    shippingDestination: {
      '@type': 'DefinedRegion',
      addressCountry: countriesOfZone(zone),
    },
    deliveryTime: {
      '@type': 'ShippingDeliveryTime',
      handlingTime: {
        '@type': 'QuantitativeValue',
        minValue: HANDLING_DAYS[0],
        maxValue: HANDLING_DAYS[1],
        unitCode: 'DAY',
      },
      transitTime: {
        '@type': 'QuantitativeValue',
        minValue: TRANSIT_DAYS[zone][0],
        maxValue: TRANSIT_DAYS[zone][1],
        unitCode: 'DAY',
      },
    },
  }))
}

// Recesso entro 14 giorni, reso per posta a spese del cliente, rimborso integrale,
// solo prodotti sigillati e non aperti (pagina Recesso, art. 59 Codice del Consumo).
export function merchantReturnPolicy(locale: string) {
  return {
    '@type': 'MerchantReturnPolicy',
    applicableCountry: ALL_COUNTRY_CODES.map(toIso),
    returnPolicyCountry: 'IT',
    returnPolicyCategory: 'https://schema.org/MerchantReturnFiniteReturnWindow',
    merchantReturnDays: 14,
    returnMethod: 'https://schema.org/ReturnByMail',
    returnFees: 'https://schema.org/ReturnFeesCustomerResponsibility',
    returnLabelSource: 'https://schema.org/ReturnLabelCustomerResponsibility',
    refundType: 'https://schema.org/FullRefund',
    itemCondition: 'https://schema.org/NewCondition',
    merchantReturnLink: `${SITE}/${locale}/recesso`,
  }
}

// Da aggiungere con lo spread dentro ogni `offers` di tipo Offer.
export function merchantOfferFields(locale: string) {
  return {
    shippingDetails: offerShippingDetails(),
    hasMerchantReturnPolicy: merchantReturnPolicy(locale),
  }
}
