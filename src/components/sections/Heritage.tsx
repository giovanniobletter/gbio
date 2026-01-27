'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Image from 'next/image'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { luxuryFadeUp, luxurySlideIn, luxurySlideInRight, luxuryStaggerContainer, luxuryStaggerItem } from '@/lib/animations'
import { OrnateRule } from '@/components/ui/decorative/OrnateRule'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'

export function Heritage() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const imageY = useTransform(scrollYProgress, [0, 1], ['10%', '-10%'])

  return (
    <section
      id="heritage"
      ref={containerRef}
      className="section-padding bg-nero relative overflow-hidden"
    >
      {/* Subtle texture overlay */}
      <TextureOverlay variant="linen" opacity={0.02} />

      <div className="container-custom relative">
        <SectionTitle
          eyebrow="La Nostra Storia"
          title="Tradizione e Innovazione"
          subtitle="In ogni raccolto"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
          className="text-center mt-6 max-w-2xl mx-auto"
        >
          <span className="font-serif text-xl md:text-2xl italic text-bianco/80 leading-relaxed">
            {`"Non vendo prodotti. Condivido ciò in cui credo."`}
          </span>
          <span className="block mt-3 font-sans text-sm text-gold/60 tracking-wide">
            — Giovanni Battista Obletter
          </span>
        </motion.p>

        <div className="mt-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            variants={luxurySlideIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <motion.div style={{ y: imageY }} className="absolute inset-0">
              <Image
                src="/images/founder.jpg"
                alt="Giovanni Battista Obletter"
                fill
                className="object-cover grayscale"
              />
            </motion.div>
            <div className="absolute inset-0 border border-gold/20" />

            {/* Decorative element - enhanced */}
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold glow-gold"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={luxurySlideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <motion.div
              variants={luxuryStaggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="space-y-6"
            >
              <motion.h3
                variants={luxuryStaggerItem}
                className="font-serif text-2xl md:text-3xl lg:text-4xl text-bianco text-shadow-luxe"
              >
                Giovanni Battista Obletter
              </motion.h3>

              <motion.p
                variants={luxuryStaggerItem}
                className="font-sans text-xs uppercase tracking-luxe text-gold"
              >
                Fondatore
              </motion.p>

              <motion.p
                variants={luxuryStaggerItem}
                className="font-sans text-bianco/70 leading-relaxed"
              >
                Giovanni Battista Obletter, classe 1996, ha scelto di non seguire il percorso
                più facile. In un&apos;epoca in cui molti giovani lasciano la terra, lui ha deciso
                di tornare a coltivarla — ma in modo diverso.
              </motion.p>

              <motion.p
                variants={luxuryStaggerItem}
                className="font-sans text-bianco/70 leading-relaxed"
              >
                Sui 50 ettari tra Cepagatti, Moscufo e Pianella, Giovanni pratica un&apos;agricoltura
                che guarda al futuro riscoprendo il passato: varietà antiche come il Senatore Cappelli
                e il Gentilrosso, cultivar autoctone come la Dritta, metodi biologici certificati
                che rigenerano il suolo invece di impoverirlo.
              </motion.p>

              <motion.p
                variants={luxuryStaggerItem}
                className="font-sans text-bianco/70 leading-relaxed"
              >
                La filosofia è semplice: produrre alimenti che facciano davvero bene. Ogni bottiglia
                d&apos;olio, ogni pacco di pasta porta con sé non solo il sapore dell&apos;Abruzzo, ma i
                valori di un giovane imprenditore che crede che il cibo possa essere medicina,
                piacere e rispetto per la terra — tutto insieme.
              </motion.p>
            </motion.div>

            {/* Ornate divider before stats */}
            <OrnateRule variant="diamond" className="py-4" />

            <motion.div
              variants={luxuryFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-3 gap-6 pt-4"
            >
              <div>
                <span className="font-serif text-4xl text-gold">50</span>
                <p className="font-sans text-xs uppercase tracking-wider text-bianco/50 mt-2">
                  Ettari Bio
                </p>
              </div>
              <div>
                <span className="font-serif text-4xl text-gold">43</span>
                <p className="font-sans text-xs uppercase tracking-wider text-bianco/50 mt-2">
                  Seminativi
                </p>
              </div>
              <div>
                <span className="font-serif text-4xl text-gold">6</span>
                <p className="font-sans text-xs uppercase tracking-wider text-bianco/50 mt-2">
                  Uliveto DOP
                </p>
              </div>
            </motion.div>

            {/* Certification Badge */}
            <motion.div
              variants={luxuryFadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="flex items-center gap-4 pt-6"
            >
              <div className="px-4 py-2 border border-forest text-forest text-xs font-sans uppercase tracking-luxe hover:glow-gold hover:border-gold hover:text-gold transition-all duration-700">
                Bio ICEA
              </div>
              <div className="px-4 py-2 border border-gold text-gold text-xs font-sans uppercase tracking-luxe hover:glow-gold transition-all duration-700">
                DOP Aprutino Pescarese
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
