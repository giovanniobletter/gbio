// Foto e video della raccolta delle olive 2026, serviti da public/raccolta-2026.
// Usati come sfondo fisso della hero (heroStill) e nello slideshow del Territorio.

export type SlideImage = { type: 'image'; src: string; alt?: string }
export type SlideVideo = { type: 'video'; src: string; poster: string; alt?: string }
export type SlideItem = SlideImage | SlideVideo

const img = (slug: string, alt: string): SlideImage => ({ type: 'image', src: `/raccolta-2026/${slug}.jpg`, alt })
const vid = (slug: string, alt: string): SlideVideo => ({
  type: 'video',
  src: `/raccolta-2026/${slug}.mp4`,
  poster: `/raccolta-2026/${slug}.jpg`,
  alt,
})

const r = {
  ulivoControluce: img('ulivo-controluce', 'Ulivo secolare in controluce al mattino'),
  oliveSulRamo: img('olive-sul-ramo', 'Olive mature sul ramo'),
  tramonto: img('tramonto', 'Tramonto sulla montagna'),
  bn01: img('bn-01-uliveto', 'L’uliveto in bianco e nero'),
  bn02: img('bn-02-tra-i-rami', 'Tra i rami dell’ulivo'),
  bn03: img('bn-03-trattore', 'Tra gli ulivi, il trattore sullo sfondo'),
  bn04: img('bn-04-cassette', 'Le cassette di olive sul rimorchio'),
  bn05: img('bn-05-in-cammino', 'In cammino tra gli ulivi'),
  bn06: img('bn-06-sotto-l-ulivo', 'Una pausa sotto l’ulivo'),
  bn07: img('bn-07-sulle-reti', 'Sulle reti stese per la raccolta'),
  bn08: img('bn-08-forcone', 'Con il forcone tra gli ulivi'),
  olioAlFrantoio: vid('olio-al-frantoio', 'L’olio nuovo esce dal separatore al frantoio'),
  oliveAlNastro: vid('olive-al-nastro', 'Le olive sul nastro del frantoio'),
  reti02: vid('reti-02', 'Le reti sotto l’ulivo, al sole'),
}

// Sfondo fisso della hero.
export const heroStill = r.ulivoControluce

// Slideshow della sezione Territorio: foto e video alternati finché ci sono video,
// poi le foto restanti. Solo inquadrature ferme: niente panoramiche né soggetti che
// escono dal campo. Le foto storiche del territorio vengono accodate dalla sezione.
export const territorySlides: SlideItem[] = [
  r.oliveSulRamo, r.olioAlFrantoio,
  r.bn08, r.oliveAlNastro,
  r.bn07, r.reti02,
  r.bn05, r.tramonto, r.bn06,
  r.bn01, r.bn03, r.bn04, r.bn02,
]
