import { Product } from '@/types'

export const products: Product[] = [
  {
    id: 'olio-dop-50cl',
    name: 'Olio Extravergine di Oliva DOP Aprutino Pescarese Biologico',
    subtitle: 'Cultivar Dritta, Leccino, Intosso | Raccolta 2024',
    description: '444 mg/kg di polifenoli. Spremuto a freddo entro 24 ore dalla raccolta. Note di carciofo crudo, mandorla verde ed erbe officinali.',
    price: 25.00,
    image: '/images/olio-05l.jpg',
    images: ['/images/olio-05l.jpg'],
    category: 'olio',
    details: {
      origin: 'Triangolo d\'Oro - Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '0,5 L',
      harvest: '2024',
    },
  },
  {
    id: 'olio-dop-3l',
    name: 'Olio Extravergine DOP Bio',
    subtitle: 'Latta 3 Litri',
    description: 'Il formato ideale per chi ha scoperto l\'eccellenza e non vuole più farne a meno. Tre litri del nostro DOP Aprutino Pescarese in elegante latta che preserva intatte le proprietà nutraceutiche.',
    price: 55.00,
    image: '/images/olio-3l.jpg',
    category: 'olio',
    details: {
      origin: 'Triangolo d\'Oro - Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '3L',
      harvest: '2024',
    },
  },
  {
    id: 'olio-dop-5l',
    name: 'Olio Extravergine DOP Bio',
    subtitle: 'Latta 5 Litri',
    description: 'La scelta del conoscitore. Cinque litri di pura eccellenza abruzzese, il formato che premia la fedeltà con il miglior rapporto qualità-prezzo.',
    price: 80.00,
    image: '/images/olio-latta-5l.jpg',
    category: 'olio',
    details: {
      origin: 'Triangolo d\'Oro - Abruzzo',
      certification: ['DOP Aprutino Pescarese', 'Biologico ICEA'],
      weight: '5L',
      harvest: '2024',
    },
  },
  {
    id: 'pasta-mezzemaniche',
    name: 'Mezzemaniche Senatore Cappelli',
    subtitle: 'Biologica | Trafilata al Bronzo | Essiccazione Lenta',
    description: 'Perfette per sughi corposi e ragù. La forma trattiene il condimento all\'interno. 14% di proteine, doppia concentrazione di antiossidanti.',
    price: 4.50,
    image: '/images/pasta-mezzemaniche.jpg',
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
    subtitle: 'Biologica | Trafilata al Bronzo | Essiccazione Lenta',
    description: 'Il classico italiano, versatile e amato. Ideali con sughi di verdure o pomodoro fresco. 14% di proteine, doppia concentrazione di antiossidanti.',
    price: 4.50,
    image: '/images/pasta-penne.jpg',
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
    subtitle: 'Biologica | Trafilata al Bronzo | Essiccazione Lenta',
    description: 'La tradizione abruzzese. Sposano magnificamente il nostro olio DOP a crudo o con ragù d\'agnello. 14% di proteine.',
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
    subtitle: 'Biologica | Trafilata al Bronzo | Essiccazione Lenta',
    description: 'Più sottili delle fettuccine, catturano i sughi delicati. Eccellenti con tartufo o funghi porcini. 14% di proteine.',
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
    subtitle: 'Biologica | Trafilata al Bronzo | Essiccazione Lenta',
    description: 'Formato tipico abruzzese, irregolare e rustico. Tradizionalmente servite con fagioli o ceci. 14% di proteine.',
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
    subtitle: 'Biologica | Trafilata al Bronzo | Essiccazione Lenta',
    description: 'Piccoli quadrati perfetti per minestre e brodi. La pasta della domenica in famiglia. 14% di proteine.',
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
    subtitle: 'Semola Rimacinata | Macinata a Pietra | Bio',
    description: 'Semola rimacinata di grano duro Senatore Cappelli, macinata a pietra. Ideale per pasta fresca fatta in casa, pane pugliese, focacce e pizze gourmet. Colore ambrato naturale.',
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
    subtitle: 'Grano Tenero Antico | Macinata a Pietra | Bio',
    description: 'Varietà italiana dei primi \'900 dalla caratteristica sfumatura rossastra. La più alta concentrazione naturale di vanillina tra i grani teneri. 13% proteine, 9% fibre, glutine delicato e digeribile.',
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
    subtitle: 'Pera d\'Abruzzo Bio | Artigianale',
    description: 'Pomodoro Pera d\'Abruzzo biologico, raccolto a mano e trasformato artigianalmente presso La Giara entro poche ore dalla raccolta. Cottura lenta in caldaie di rame, zero conservanti.',
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
