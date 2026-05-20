// English overrides for product names, subtitles and descriptions.
// Italian proper nouns (Senatore Cappelli, DOP Aprutino Pescarese, place
// names, pasta shape names) are intentionally preserved.

export const productsEn: Record<
  string,
  { name?: string; subtitle?: string; description?: string }
> = {
  // BOX
  'box-olio-6': {
    name: 'Olive Oil Box 6×0.5L',
    subtitle: 'DOP Aprutino Pescarese Gift Set',
    description:
      "Six bottles of our DOP Aprutino Pescarese Organic Extra Virgin Olive Oil. The Abruzzo pantry essential, in a single gift set.",
  },
  'box-pasta-6': {
    name: 'Pasta Box — 6 Shapes',
    subtitle: 'Senatore Cappelli Gift Set',
    description:
      'Six Senatore Cappelli pasta shapes: penne, fettuccine, mezzemaniche, tagliatelle, sagnette, quadrucci.',
  },
  // OLIVE OIL
  'olio-dop-50cl': {
    name: 'Bottle 0.5L',
    subtitle: 'DOP Aprutino Pescarese — Organic',
    description:
      'An introduction to excellence. Notes of artichoke, green almond and wild herbs.',
  },
  'olio-dop-3l': {
    name: 'Tin 3L',
    subtitle: 'DOP Aprutino Pescarese — Organic',
    description: "For those who've chosen never to go back.",
  },
  'olio-dop-5l': {
    name: 'Tin 5L',
    subtitle: 'DOP Aprutino Pescarese — Organic',
    description:
      "The connoisseur's choice. Cold-pressed within 6 hours of harvest.",
  },
  // PASTA
  'pasta-mezzemaniche': {
    subtitle: 'Senatore Cappelli',
    description: 'For ragù and rich sauces. Holds the dressing inside.',
  },
  'pasta-penne': {
    subtitle: 'Senatore Cappelli',
    description: 'The versatile classic. Perfect with vegetables and tomato.',
  },
  'pasta-fettuccine': {
    subtitle: 'Senatore Cappelli',
    description: 'Abruzzese tradition. Divine with our oil drizzled on top.',
  },
  'pasta-tagliatelle': {
    subtitle: 'Senatore Cappelli',
    description: 'Elegant and thin. For truffle and porcini mushrooms.',
  },
  'pasta-sagnette': {
    subtitle: 'Senatore Cappelli',
    description: 'A traditional Abruzzese shape. With beans or chickpeas.',
  },
  'pasta-quadrucci': {
    subtitle: 'Senatore Cappelli',
    description: 'For soups and broths. Sunday family lunch.',
  },
  // FLOUR
  'semolato-cappelli': {
    name: 'Semolato',
    subtitle: 'Senatore Cappelli',
    description:
      'For fresh pasta, bread and pizzas that taste of home. Stone-ground.',
  },
  'farina-gentilrosso': {
    name: 'Gentilrosso Flour',
    subtitle: 'Ancient Soft Wheat',
    description:
      'The secret to bread and cakes with an unmistakable aroma. Naturally high in vanillin.',
  },
  // PRESERVES
  'passata-pomodoro': {
    name: 'Tomato Passata',
    subtitle: "Pera d'Abruzzo",
    description:
      'Hand-picked, processed within hours. The full taste of an Abruzzese summer.',
  },
}
