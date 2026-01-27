import { Product } from '@/types'

export const products: Product[] = [
  {
    id: 'olio-dop-50cl',
    name: 'Olio Extravergine DOP Bio',
    subtitle: 'Bottiglia 0,5 L',
    description: 'Nutraceutico. Alto contenuto di polifenoli. Estrazione a freddo. Note di mandorla e carciofo.',
    price: 25.00,
    image: '/images/olio-05l.jpg',
    images: ['/images/olio-05l.jpg'],
    category: 'olio',
    details: {
      origin: 'Triangolo d\'Oro - Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '0,5 L',
      harvest: '2025',
    },
  },
  {
    id: 'olio-dop-3l',
    name: 'Olio Extravergine DOP Bio',
    subtitle: 'Latta 3 Litri',
    description: 'Formato famiglia. Nutraceutico con proprietà antiossidanti.',
    price: 55.00,
    image: '/images/olio-3l.jpg',
    category: 'olio',
    details: {
      origin: 'Triangolo d\'Oro - Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '3L',
      harvest: '2025',
    },
  },
  {
    id: 'olio-dop-5l',
    name: 'Olio Extravergine DOP Bio',
    subtitle: 'Latta 5 Litri',
    description: 'Per intenditori. Polifenoli e antiossidanti naturali.',
    price: 80.00,
    image: '/images/olio-latta-5l.jpg',
    category: 'olio',
    details: {
      origin: 'Triangolo d\'Oro - Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '5L',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-mezzemaniche',
    name: 'Mezzemaniche Senatore Cappelli',
    subtitle: 'Grano Antico Bio',
    description: 'Alta digeribilità. Trafilatura al bronzo, essiccazione lenta.',
    price: 4.50,
    image: '/images/pasta-mezzemaniche.jpg',
    images: ['/images/pasta-mezzemaniche.jpg', '/images/pasta-mezzemaniche-retro.jpg'],
    category: 'pasta',
    details: {
      origin: 'Via del Grano - Castellana',
      certification: ['Biologico ICEA'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-penne',
    name: 'Penne Senatore Cappelli',
    subtitle: 'Grano Antico Bio',
    description: 'Alta digeribilità. Trafilatura al bronzo, essiccazione lenta.',
    price: 4.50,
    image: '/images/pasta-penne.jpg',
    images: ['/images/pasta-penne.jpg', '/images/pasta-penne-retro.jpg'],
    category: 'pasta',
    details: {
      origin: 'Via del Grano - Castellana',
      certification: ['Biologico ICEA'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-fettuccine',
    name: 'Fettuccine Senatore Cappelli',
    subtitle: 'Grano Antico Bio',
    description: 'Alta digeribilità. Trafilatura al bronzo, essiccazione lenta.',
    price: 4.50,
    image: '/images/pasta-fettuccine.jpg',
    category: 'pasta',
    details: {
      origin: 'Via del Grano - Castellana',
      certification: ['Biologico ICEA'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-tagliatelle',
    name: 'Tagliatelle Senatore Cappelli',
    subtitle: 'Grano Antico Bio',
    description: 'Alta digeribilità. Trafilatura al bronzo, essiccazione lenta.',
    price: 4.50,
    image: '/images/pasta-tagliatelle.jpg',
    category: 'pasta',
    details: {
      origin: 'Via del Grano - Castellana',
      certification: ['Biologico ICEA'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-sagnette',
    name: 'Sagnette Senatore Cappelli',
    subtitle: 'Grano Antico Bio',
    description: 'Formato abruzzese. Alta digeribilità, trafilatura al bronzo.',
    price: 4.50,
    image: '/images/pasta-sagnette.jpg',
    category: 'pasta',
    details: {
      origin: 'Via del Grano - Castellana',
      certification: ['Biologico ICEA'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'pasta-quadrucci',
    name: 'Quadrucci Senatore Cappelli',
    subtitle: 'Grano Antico Bio',
    description: 'Per minestre e brodi. Alta digeribilità.',
    price: 4.50,
    image: '/images/pasta-quadrucci.jpg',
    category: 'pasta',
    details: {
      origin: 'Via del Grano - Castellana',
      certification: ['Biologico ICEA'],
      weight: '500g',
      harvest: '2025',
    },
  },
  {
    id: 'semolato-cappelli',
    name: 'Semolato Senatore Cappelli',
    subtitle: 'Grano Antico Bio',
    description: 'Macinato a pietra. Basso indice glicemico. Per pasta fresca e pane.',
    price: 3.00,
    image: '/images/semolato-cappelli.jpg',
    category: 'farina',
    details: {
      origin: 'Via del Grano - Castellana',
      certification: ['Biologico ICEA'],
      weight: '1kg',
      harvest: '2025',
    },
  },
  {
    id: 'farina-gentilrosso',
    name: 'Farina Gentilrosso',
    subtitle: 'Grano Tenero Antico Bio',
    description: 'Macinata a pietra. Basso indice glicemico. Per panificazione e dolci.',
    price: 3.00,
    image: '/images/farina-gentilrosso.jpg',
    category: 'farina',
    details: {
      origin: 'Via del Grano - Castellana',
      certification: ['Biologico ICEA'],
      weight: '1kg',
      harvest: '2025',
    },
  },
  {
    id: 'passata-pomodoro',
    name: 'Passata di Pomodoro',
    subtitle: 'Pera d\'Abruzzo Bio',
    description: 'Polpa densa, alto contenuto di licopene. Lavorazione entro 24 ore.',
    price: 4.00,
    image: '/images/passata-pomodoro.jpg',
    category: 'conserve',
    details: {
      origin: 'Abruzzo',
      certification: ['Biologico ICEA'],
      weight: '70cl',
      harvest: '2025',
    },
  },
]

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
