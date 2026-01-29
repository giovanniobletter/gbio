'use client'

import { motion } from 'framer-motion'
import { Leaf, Bird, Mountain, Flower2 } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { luxuryStaggerContainer, luxuryStaggerItem } from '@/lib/animations'
import { MountainSilhouette } from '@/components/ui/decorative/MountainSilhouette'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'
import { OrnateRule } from '@/components/ui/decorative/OrnateRule'

const stats = [
  { icon: Leaf, value: '36%', label: 'Territorio protetto' },
  { icon: Bird, value: '75%', label: 'Biodiversità europea' },
  { icon: Mountain, value: '3', label: 'Parchi nazionali' },
  { icon: Flower2, value: '2.300', label: 'Specie vegetali' },
]

export function Territory() {
  return (
    <section
      id="territorio"
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
          eyebrow="Territorio"
          title="Dove il Gran Sasso Incontra l'Adriatico"
          subtitle=""
        />

        {/* BLOCCO 1 - Abruzzo */}
        <motion.div
          variants={luxuryStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <motion.p
            variants={luxuryStaggerItem}
            className="font-serif text-2xl md:text-3xl text-bianco mb-12"
          >
            L&apos;Abruzzo è la regione più verde d&apos;Europa.
          </motion.p>

          {/* Stats Grid */}
          <motion.div
            variants={luxuryStaggerItem}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12"
          >
            {stats.map((stat) => (
              <div key={stat.label} className="text-center group">
                <div className="w-12 h-12 mx-auto mb-4 border border-gold/30 flex items-center justify-center group-hover:bg-gold/10 transition-colors">
                  <stat.icon size={24} className="text-gold" />
                </div>
                <span className="font-serif text-3xl md:text-4xl text-gold">{stat.value}</span>
                <p className="font-sans text-xs text-bianco/60 mt-2 uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </motion.div>

          <motion.p
            variants={luxuryStaggerItem}
            className="font-sans text-bianco/60 max-w-2xl mx-auto"
          >
            Un terzo della regione è protetto. Tre quarti della biodiversità del continente vive qui.
          </motion.p>
        </motion.div>

        <OrnateRule variant="fleur" className="my-16" />

        {/* BLOCCO 2 - I nostri prodotti */}
        <motion.div
          variants={luxuryStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center space-y-8"
        >
          <motion.div variants={luxuryStaggerItem}>
            <p className="font-serif text-xl md:text-2xl text-bianco leading-relaxed">
              <span className="text-gold">Il nostro grano</span> cresce su colline tra i 200 e i 400 metri, in un suolo argilloso-calcareo che trattiene l&apos;acqua quanto basta. Senatore Cappelli e Gentilrosso — varietà antiche che l&apos;industria ha abbandonato.
            </p>
          </motion.div>

          <motion.div variants={luxuryStaggerItem}>
            <p className="font-serif text-xl md:text-2xl text-bianco leading-relaxed">
              <span className="text-gold">Il nostro olio</span> nasce nel Triangolo d&apos;Oro: Moscufo, Pianella, Loreto Aprutino. DOP Aprutino Pescarese dal 1996. Cultivar Dritta — esiste solo qui.
            </p>
          </motion.div>

          <OrnateRule variant="diamond" className="py-4" />

          <motion.div variants={luxuryStaggerItem}>
            <p className="font-sans text-sm text-gold uppercase tracking-[0.3em]">
              50 ettari biologici. Una terra che fa il lavoro per noi.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
