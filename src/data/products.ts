import { Product } from '@/types'

export const products: Product[] = [
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
      origin: 'Triangolo d\'Oro - Abruzzo',
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
      origin: 'Triangolo d\'Oro - Abruzzo',
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
      origin: 'Triangolo d\'Oro - Abruzzo',
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
