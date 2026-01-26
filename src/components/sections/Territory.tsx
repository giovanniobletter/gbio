'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { MapPin, Sun, Droplets, Mountain } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { luxuryFadeUp, luxuryStaggerContainer, luxuryStaggerItem } from '@/lib/animations'
import { MountainSilhouette } from '@/components/ui/decorative/MountainSilhouette'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'
import { OrnateRule } from '@/components/ui/decorative/OrnateRule'

const features = [
  {
    icon: Sun,
    title: '300+ giorni di sole',
    description: 'Il clima mediterraneo abruzzese garantisce una maturazione ottimale.',
  },
  {
    icon: Droplets,
    title: 'Irrigazione naturale',
    description: 'Le sorgenti appenniniche nutrono i nostri terreni.',
  },
  {
    icon: Mountain,
    title: 'Altitudine perfetta',
    description: 'Tra i 200 e i 400 metri, ideale per olive e grani antichi.',
  },
  {
    icon: MapPin,
    title: 'Terroir unico',
    description: 'Suoli argilloso-calcarei ricchi di minerali.',
  },
]

export function Territory() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const mapScale = useTransform(scrollYProgress, [0, 0.5], [0.9, 1])
  const mapOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1])

  return (
    <section
      id="territorio"
      ref={containerRef}
      className="section-padding bg-forest-dark relative overflow-hidden"
    >
      {/* Subtle texture overlay */}
      <TextureOverlay variant="linen" opacity={0.025} />

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      {/* Mountain Silhouette - Top */}
      <div className="absolute top-0 left-0 right-0 z-0 rotate-180 opacity-50">
        <MountainSilhouette variant="section" animated={false} />
      </div>

      <div className="container-custom relative z-10">
        <SectionTitle
          eyebrow="Il Nostro Territorio"
          title="49 Ettari di Biodiversità"
          subtitle="Dove il Gran Sasso incontra l'Adriatico, nasce l'eccellenza."
        />

        <div className="mt-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Map / Image Area */}
          <motion.div
            style={{ scale: mapScale, opacity: mapOpacity }}
            className="relative aspect-[2/3]"
          >
            <div className="absolute inset-0 border border-gold/30 overflow-hidden">
              <Image
                src="/images/mappa-abruzzo.png"
                alt="Mappa storica dell'Abruzzo - Castellana"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>

            {/* Stats overlay */}
            <motion.div
              variants={luxuryFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="absolute -bottom-8 -right-8 bg-nero border border-gold p-6 glow-gold"
            >
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <span className="font-serif text-3xl text-gold">43</span>
                  <p className="font-sans text-xs text-bianco/60 mt-1">Ha Seminativi</p>
                </div>
                <div className="text-center">
                  <span className="font-serif text-3xl text-gold">6</span>
                  <p className="font-sans text-xs text-bianco/60 mt-1">Ha Uliveto</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features */}
          <motion.div
            variants={luxuryStaggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={luxuryStaggerItem}
                className="flex gap-6 items-start group"
              >
                <div className="flex-shrink-0 w-14 h-14 border border-gold/50 flex items-center justify-center group-hover:bg-gold group-hover:border-gold transition-colors duration-300">
                  <feature.icon
                    size={24}
                    className="text-gold group-hover:text-nero transition-colors duration-300"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-bianco mb-2">
                    {feature.title}
                  </h3>
                  <p className="font-sans text-sm text-bianco/60 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </motion.div>
            ))}

            {/* Ornate divider before quote */}
            <OrnateRule variant="fleur" className="py-4" />

            <motion.div
              variants={luxuryStaggerItem}
              className="pt-4"
            >
              <p className="font-sans text-bianco/70 leading-relaxed italic text-shadow-luxe">
                &ldquo;La vera eccellenza non si coltiva, si custodisce.
                Ogni olivo secolare, ogni spiga di grano Cappelli, è il
                risultato di scelte precise e rispetto assoluto per la terra.&rdquo;
              </p>
              <p className="font-sans text-xs text-gold mt-4 uppercase tracking-luxe glow-gold-text">
                — Giovanni Battista Obletter
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
