import { Product, FoodInfo, NutritionFacts } from '@/types'

// ============================================================
// INFORMAZIONI ALIMENTARI (Reg. UE 1169/2011, artt. 9 e 14)
// Nella vendita a distanza devono essere disponibili PRIMA
// dell'acquisto. I valori nutrizionali e le diciture vanno
// ALLINEATI ALLE ETICHETTE REALI — TODO(Giovanni): verificare
// ogni valore contro l'etichetta stampata del prodotto.
// ============================================================

const OSA = 'Az. Agr. Obletter Giovanni Battista — Via Sicilia, Fraz. Villanova 2/a, 65012 Cepagatti (PE)'

// TODO(Giovanni): verificare valori nutrizionali con etichetta reale olio
const NUTRITION_OLIO: NutritionFacts = {
  per: '100ml',
  energyKj: 3404,
  energyKcal: 828,
  fat: 92,
  saturatedFat: 14,
  carbohydrates: 0,
  sugars: 0,
  protein: 0,
  salt: 0,
}

// TODO(Giovanni): verificare valori nutrizionali con etichetta reale pasta
const NUTRITION_PASTA: NutritionFacts = {
  per: '100g',
  energyKj: 1521,
  energyKcal: 359,
  fat: 2.0,
  saturatedFat: 0.4,
  carbohydrates: 70,
  sugars: 3.5,
  protein: 13,
  salt: 0.01,
}

// TODO(Giovanni): verificare valori nutrizionali con etichette reali farine
const NUTRITION_SEMOLATO: NutritionFacts = {
  per: '100g',
  energyKj: 1493,
  energyKcal: 352,
  fat: 1.8,
  saturatedFat: 0.4,
  carbohydrates: 70,
  sugars: 3.2,
  protein: 12.5,
  salt: 0.01,
}

// TODO(Giovanni): verificare valori nutrizionali con etichetta reale passata
const NUTRITION_PASSATA: NutritionFacts = {
  per: '100g',
  energyKj: 115,
  energyKcal: 27,
  fat: 0.2,
  saturatedFat: 0,
  carbohydrates: 4.5,
  sugars: 3.8,
  protein: 1.4,
  salt: 0.03,
}

function makeOlioFoodInfo(netQuantity: string): FoodInfo {
  return {
    legalName: 'Olio extravergine di oliva DOP "Aprutino Pescarese" biologico',
    ingredients: 'Olive biologiche. Olio di categoria superiore ottenuto direttamente dalle olive e unicamente mediante procedimenti meccanici.',
    allergens: [],
    netQuantity,
    storage: 'Conservare al riparo dalla luce e da fonti di calore.',
    operator: OSA,
    originLabel: 'Prodotto e confezionato in Italia — olive coltivate a Moscufo (PE), zona DOP Aprutino Pescarese',
    organicCode: 'IT-BIO-006', // ICEA — TODO(Giovanni): confermare codice su etichetta
    organicOrigin: 'Agricoltura Italia',
    nutrition: NUTRITION_OLIO,
    extraLabel: [
      'Campagna olearia 2025/2026', // TODO(Giovanni): aggiornare a ogni raccolta
      'DOP — Denominazione di Origine Protetta "Aprutino Pescarese"',
    ],
  }
}

function makePastaFoodInfo(formato: string): FoodInfo {
  return {
    legalName: `Pasta di semola di grano duro Senatore Cappelli — ${formato}`,
    ingredients: 'Semola di GRANO duro Senatore Cappelli, acqua. Può contenere tracce di soia e senape.', // TODO(Giovanni): verificare tracce su etichetta reale
    allergens: ['Glutine (grano)'],
    netQuantity: '500 g',
    storage: 'Conservare in luogo fresco e asciutto, al riparo dalla luce.',
    operator: OSA, // TODO(Giovanni): se prodotta da pastificio terzo, indicare lo stabilimento
    originLabel: 'Grano coltivato in Italia (Abruzzo) — Paese di molitura: Italia',
    nutrition: NUTRITION_PASTA,
  }
}

const FOOD_INFO: Record<string, FoodInfo> = {
  'olio-dop-50cl': makeOlioFoodInfo('0,5 L'),
  'olio-dop-3l': makeOlioFoodInfo('3 L'),
  'olio-dop-5l': makeOlioFoodInfo('5 L'),
  'pasta-mezzemaniche': makePastaFoodInfo('Mezzemaniche'),
  'pasta-penne': makePastaFoodInfo('Penne'),
  'pasta-fettuccine': makePastaFoodInfo('Fettuccine'),
  'pasta-tagliatelle': makePastaFoodInfo('Tagliatelle'),
  'pasta-sagnette': makePastaFoodInfo('Sagnette'),
  'pasta-quadrucci': makePastaFoodInfo('Quadrucci'),
  'semolato-cappelli': {
    legalName: 'Semolato di grano duro Senatore Cappelli',
    ingredients: 'Semolato di GRANO duro Senatore Cappelli macinato a pietra.',
    allergens: ['Glutine (grano)'],
    netQuantity: '1 kg',
    storage: 'Conservare in luogo fresco e asciutto, al riparo dalla luce.',
    operator: OSA, // TODO(Giovanni): se molito da mulino terzo, indicare lo stabilimento
    originLabel: 'Grano coltivato in Italia (Abruzzo)',
    nutrition: NUTRITION_SEMOLATO,
  },
  'farina-gentilrosso': {
    legalName: 'Farina di grano tenero Gentilrosso',
    ingredients: 'Farina di GRANO tenero Gentilrosso macinata a pietra.',
    allergens: ['Glutine (grano)'],
    netQuantity: '1 kg',
    storage: 'Conservare in luogo fresco e asciutto, al riparo dalla luce.',
    operator: OSA, // TODO(Giovanni): se molita da mulino terzo, indicare lo stabilimento
    originLabel: 'Grano coltivato in Italia (Abruzzo)',
    nutrition: NUTRITION_SEMOLATO, // TODO(Giovanni): valori specifici farina Gentilrosso da etichetta
  },
  'passata-pomodoro': {
    legalName: 'Passata di pomodoro',
    ingredients: 'Pomodoro Pera d\'Abruzzo. Può contenere sale.', // TODO(Giovanni): verificare ingredienti esatti su etichetta (sale? basilico?)
    allergens: [],
    netQuantity: '700 g', // TODO(Giovanni): verificare peso netto in g su etichetta (70 cl)
    storage: 'Conservare in luogo fresco e asciutto. Dopo l\'apertura conservare in frigorifero e consumare entro 3-4 giorni.',
    operator: OSA, // TODO(Giovanni): se trasformata da terzi, indicare lo stabilimento
    originLabel: 'Origine del pomodoro: Italia (Abruzzo)',
    nutrition: NUTRITION_PASSATA,
  },
}

const baseProducts: Product[] = [
  // BOX
  {
    id: 'box-olio-6',
    name: 'Box Olio 6×0,5L',
    subtitle: 'Cofanetto DOP Aprutino Pescarese',
    description: 'Sei bottiglie del nostro Olio EVO DOP Aprutino Pescarese Bio. La scorta che racconta l\'Abruzzo, in un unico cofanetto.',
    price: 100.00,
    image: '/images/box-olio-6.jpg',
    images: ['/images/box-olio-6.jpg', '/images/olio-05l.jpg'],
    category: 'box',
    details: {
      origin: 'Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '6 × 0,5L',
      harvest: '2025',
    },
  },
  {
    id: 'box-pasta-6',
    name: 'Box Pasta 6 Formati',
    subtitle: 'Cofanetto Senatore Cappelli',
    description: 'Sei formati di pasta Senatore Cappelli: penne, fettuccine, mezzemaniche, tagliatelle, sagnette, quadrucci.',
    price: 25.00,
    image: '/images/box-pasta-6.jpg',
    images: ['/images/box-pasta-6.jpg'],
    category: 'box',
    details: {
      origin: 'Castellana - Abruzzo',
      certification: ['In conversione biologica'],
      weight: '6 × 500g',
      harvest: '2025',
    },
  },
  // OLIO
  {
    id: 'olio-dop-50cl',
    name: 'Bottiglia 0,5L',
    subtitle: 'DOP Aprutino Pescarese Bio',
    description: "L'introduzione all'eccellenza. Note di carciofo, mandorla verde, erbe selvatiche.",
    price: 20.00,
    image: '/images/olio-05l.jpg',
    images: ['/images/olio-05l.jpg'],
    category: 'olio',
    details: {
      origin: 'Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '0,5 L',
      harvest: '2025',
    },
  },
  {
    id: 'olio-dop-3l',
    name: 'Latta 3L',
    subtitle: 'DOP Aprutino Pescarese Bio',
    description: 'Per chi ha scelto di non tornare indietro.',
    price: 55.00,
    image: '/images/olio-3l.jpg',
    category: 'olio',
    details: {
      origin: 'Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '3L',
      harvest: '2025',
    },
  },
  {
    id: 'olio-dop-5l',
    name: 'Latta 5L',
    subtitle: 'DOP Aprutino Pescarese Bio',
    description: 'La scelta del conoscitore. Spremuto a freddo entro 6 ore dalla raccolta.',
    price: 80.00,
    image: '/images/olio-latta-5l.jpg',
    category: 'olio',
    details: {
      origin: 'Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '5L',
      harvest: '2025',
    },
  },
  // PASTA
  {
    id: 'pasta-mezzemaniche',
    name: 'Mezzemaniche',
    subtitle: 'Senatore Cappelli',
    description: 'Per ragù e sughi corposi. Trattiene il condimento dentro.',
    price: 4.50,
    image: '/images/pasta-mezzemaniche.jpg',
    images: ['/images/pasta-mezzemaniche.jpg', '/images/pasta-mezzemaniche-retro.jpg'],
    category: 'pasta',
    details: {
      origin: 'Castellana - Abruzzo',
      certification: ['In conversione biologica'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-penne',
    name: 'Penne',
    subtitle: 'Senatore Cappelli',
    description: 'Il classico versatile. Perfette con verdure e pomodoro.',
    price: 4.50,
    image: '/images/pasta-penne.jpg',
    images: ['/images/pasta-penne.jpg', '/images/pasta-penne-retro.jpg'],
    category: 'pasta',
    details: {
      origin: 'Castellana - Abruzzo',
      certification: ['In conversione biologica'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-fettuccine',
    name: 'Fettuccine',
    subtitle: 'Senatore Cappelli',
    description: 'Tradizione abruzzese. Divine con il nostro olio a crudo.',
    price: 4.50,
    image: '/images/pasta-fettuccine.jpg',
    images: ['/images/pasta-fettuccine.jpg', '/images/pasta-fettuccine-retro.jpg'],
    category: 'pasta',
    details: {
      origin: 'Castellana - Abruzzo',
      certification: ['In conversione biologica'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-tagliatelle',
    name: 'Tagliatelle',
    subtitle: 'Senatore Cappelli',
    description: 'Eleganti e sottili. Per tartufo e funghi porcini.',
    price: 4.50,
    image: '/images/pasta-tagliatelle.jpg',
    images: ['/images/pasta-tagliatelle.jpg', '/images/pasta-tagliatelle-retro.jpg'],
    category: 'pasta',
    details: {
      origin: 'Castellana - Abruzzo',
      certification: ['In conversione biologica'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-sagnette',
    name: 'Sagnette',
    subtitle: 'Senatore Cappelli',
    description: 'Formato tipico abruzzese. Con fagioli o ceci.',
    price: 4.50,
    image: '/images/pasta-sagnette.jpg',
    images: ['/images/pasta-sagnette.jpg', '/images/pasta-sagnette-retro.jpg'],
    category: 'pasta',
    details: {
      origin: 'Castellana - Abruzzo',
      certification: ['In conversione biologica'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-quadrucci',
    name: 'Quadrucci',
    subtitle: 'Senatore Cappelli',
    description: 'Per minestre e brodi. La domenica in famiglia.',
    price: 4.50,
    image: '/images/pasta-quadrucci.jpg',
    images: ['/images/pasta-quadrucci.jpg', '/images/pasta-quadrucci-retro.jpg'],
    category: 'pasta',
    details: {
      origin: 'Castellana - Abruzzo',
      certification: ['In conversione biologica'],
      weight: '500g',
      harvest: '2025',
    },
  },
  // FARINE
  {
    id: 'semolato-cappelli',
    name: 'Semolato',
    subtitle: 'Senatore Cappelli',
    description: 'Per pasta fresca, pane e pizze che sanno di casa. Macinato a pietra.',
    price: 3.00,
    image: '/images/semolato-cappelli.jpg',
    category: 'farina',
    details: {
      origin: 'Castellana - Abruzzo',
      certification: ['In conversione biologica'],
      weight: '1kg',
      harvest: '2025',
    },
  },
  {
    id: 'farina-gentilrosso',
    name: 'Farina Gentilrosso',
    subtitle: 'Grano Tenero Antico',
    description: 'Il segreto di pane e dolci dal profumo inconfondibile. Alta vanillina naturale.',
    price: 3.00,
    image: '/images/farina-gentilrosso.jpg',
    category: 'farina',
    details: {
      origin: 'Castellana - Abruzzo',
      certification: ['In conversione biologica'],
      weight: '1kg',
      harvest: '2025',
    },
  },
  // CONSERVE
  {
    id: 'passata-pomodoro',
    name: 'Passata di Pomodoro',
    subtitle: 'Pera d\'Abruzzo',
    description: 'Raccolto a mano, trasformato entro ore. Il sapore pieno dell\'estate abruzzese.',
    price: 4.00,
    image: '/images/passata-pomodoro.jpg',
    category: 'conserve',
    details: {
      origin: 'Abruzzo',
      certification: ['In conversione biologica'],
      weight: '70cl',
      harvest: '2025',
    },
  },
]

// I box ereditano le info alimentari del prodotto contenuto
FOOD_INFO['box-olio-6'] = { ...makeOlioFoodInfo('6 × 0,5 L'), legalName: 'Cofanetto: 6 bottiglie di olio extravergine di oliva DOP "Aprutino Pescarese" biologico' }
FOOD_INFO['box-pasta-6'] = { ...makePastaFoodInfo('6 formati assortiti'), netQuantity: '6 × 500 g' }

export const products: Product[] = baseProducts.map(p => ({
  ...p,
  foodInfo: FOOD_INFO[p.id],
}))

export const getProductById = (id: string): Product | undefined => {
  return products.find(p => p.id === id)
}

export const getProductsByCategory = (category: Product['category']): Product[] => {
  return products.filter(p => p.category === category)
}

// Featured products for homepage (show 4)
export const featuredProducts = [
  products.find(p => p.id === 'olio-dop-50cl')!,
  products.find(p => p.id === 'pasta-penne')!,
  products.find(p => p.id === 'farina-gentilrosso')!,
  products.find(p => p.id === 'passata-pomodoro')!,
]
