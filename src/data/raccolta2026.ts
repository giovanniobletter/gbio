// Foto e video della raccolta delle olive 2026, serviti da public/raccolta-2026.
// Usati dallo sfondo della hero (HeroBackdrop) e dalla galleria (Raccolta2026).

type Orientation = 'landscape' | 'portrait'
type Alt = { it: string; en: string }

export type RaccoltaImage = {
  type: 'image'
  src: string
  width: number
  height: number
  orientation: Orientation
  alt: Alt
}

export type RaccoltaVideo = {
  type: 'video'
  src: string
  poster: string
  width: number
  height: number
  orientation: Orientation
  alt: Alt
}

export type RaccoltaItem = RaccoltaImage | RaccoltaVideo

const img = (slug: string, width: number, height: number, it: string, en: string): RaccoltaImage => ({
  type: 'image',
  src: `/raccolta-2026/${slug}.jpg`,
  width,
  height,
  orientation: width >= height ? 'landscape' : 'portrait',
  alt: { it, en },
})

const vid = (slug: string, it: string, en: string): RaccoltaVideo => ({
  type: 'video',
  src: `/raccolta-2026/${slug}.mp4`,
  poster: `/raccolta-2026/${slug}.jpg`,
  width: 720,
  height: 1280,
  orientation: 'portrait',
  alt: { it, en },
})

const r = {
  ulivoControluce: img('ulivo-controluce', 2400, 1600, 'Ulivo secolare in controluce al mattino', 'Century-old olive tree backlit in the morning'),
  oliveSulRamo: img('olive-sul-ramo', 2400, 1600, 'Olive mature sul ramo', 'Ripe olives on the branch'),
  abbacchiatura: img('abbacchiatura', 2400, 1600, 'Giovanni Obletter durante l’abbacchiatura', 'Giovanni Obletter harvesting with the electric olive rake'),
  tramonto: img('tramonto', 1800, 2400, 'Tramonto sulla montagna', 'Sunset over the mountain'),
  bn01: img('bn-01-uliveto', 2400, 1600, 'L’uliveto in bianco e nero', 'The olive grove in black and white'),
  bn02: img('bn-02-tra-i-rami', 2400, 1600, 'Tra i rami dell’ulivo', 'Among the olive branches'),
  bn03: img('bn-03-trattore', 2400, 1600, 'Giovanni Obletter tra gli ulivi, il trattore sullo sfondo', 'Giovanni Obletter among the olive trees, the tractor behind'),
  bn04: img('bn-04-cassette', 2400, 1600, 'Le cassette di olive sul rimorchio', 'Olive crates on the trailer'),
  bn05: img('bn-05-in-cammino', 2400, 1600, 'In cammino tra gli ulivi', 'Walking through the olive grove'),
  bn06: img('bn-06-sotto-l-ulivo', 2400, 1600, 'Una pausa sotto l’ulivo', 'A pause under the olive tree'),
  bn07: img('bn-07-sulle-reti', 2400, 1600, 'Sulle reti stese per la raccolta', 'On the nets laid out for the harvest'),
  bn08: img('bn-08-forcone', 2400, 1600, 'Giovanni Obletter con il forcone', 'Giovanni Obletter with the pitchfork'),
  olioAlFrantoio: vid('olio-al-frantoio', 'L’olio nuovo esce dal separatore al frantoio', 'New oil flowing from the separator at the mill'),
  oliveAlNastro: vid('olive-al-nastro', 'Le olive sul nastro del frantoio', 'Olives on the mill conveyor'),
  ramiControluce: vid('rami-controluce', 'Rami di ulivo in controluce', 'Olive branches against the light'),
  ulivoNelSole: vid('ulivo-nel-sole', 'Un ulivo nel sole del mattino', 'An olive tree in the morning sun'),
  reti01: vid('reti-01', 'Si stendono le reti sotto gli alberi', 'Laying the nets under the trees'),
  reti02: vid('reti-02', 'Le reti sotto l’ulivo, al sole', 'Nets under the olive tree, in the sun'),
  ulivetoReti: vid('uliveto-reti', 'L’uliveto con le reti e le montagne', 'The olive grove, the nets and the mountains'),
  ulivetoMontagne: vid('uliveto-montagne', 'L’uliveto e le montagne all’orizzonte', 'The olive grove with the mountains on the horizon'),
}

// Sfondo della hero: foto e video alternati. Sul desktop foto orizzontali; sul telefono
// i video verticali e le foto che reggono il taglio centrale.
const HERO_LANDSCAPE: RaccoltaItem[] = [
  r.ulivoControluce, r.olioAlFrantoio,
  r.abbacchiatura, r.oliveAlNastro,
  r.bn08, r.ramiControluce,
  r.bn07, r.ulivetoReti,
  r.oliveSulRamo, r.ulivoNelSole,
  r.bn05, r.ulivetoMontagne,
]

const HERO_PORTRAIT: RaccoltaItem[] = [
  r.tramonto, r.olioAlFrantoio,
  r.abbacchiatura, r.reti02,
  r.bn08, r.oliveAlNastro,
  r.ulivoControluce, r.ramiControluce,
  r.bn07, r.ulivoNelSole,
  r.oliveSulRamo, r.ulivetoReti,
]

export function heroPlaylist(orientation: Orientation): RaccoltaItem[] {
  return orientation === 'portrait' ? HERO_PORTRAIT : HERO_LANDSCAPE
}

// Galleria della sezione «Raccolta 2026», in ordine di lettura.
export const galleryItems: RaccoltaItem[] = [
  r.ulivoControluce, r.olioAlFrantoio, r.bn08,
  r.bn01, r.reti02, r.abbacchiatura,
  r.oliveAlNastro, r.bn05, r.bn06,
  r.ramiControluce, r.bn03, r.bn07,
  r.tramonto, r.bn04, r.ulivetoMontagne,
  r.bn02, r.oliveSulRamo, r.reti01,
  r.ulivetoReti, r.ulivoNelSole,
]
