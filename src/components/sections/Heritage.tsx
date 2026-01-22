'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { fadeUp, slideInLeft, slideInRight } from '@/lib/animations'

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
      <div className="container-custom">
        <SectionTitle
          eyebrow="La Nostra Storia"
          title="Heritage"
          subtitle="Tre generazioni di dedizione alla terra, una passione che si tramanda di padre in figlio."
        />

        <div className="mt-20 grid lg:grid-cols-2 gap-16 items-center">
          {/* Image */}
          <motion.div
            variants={slideInLeft}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative aspect-[4/5] overflow-hidden"
          >
            <motion.div style={{ y: imageY }} className="absolute inset-0">
              <div className="w-full h-[120%] bg-forest/30 flex items-center justify-center">
                <span className="font-serif text-6xl text-gold/20">O</span>
              </div>
              {/* Replace with actual image */}
              {/* <Image src="/images/heritage.jpg" alt="Famiglia Obletter" fill className="object-cover" /> */}
            </motion.div>
            <div className="absolute inset-0 border border-gold/20" />

            {/* Decorative elements */}
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="absolute -bottom-6 -right-6 w-32 h-32 border border-gold"
            />
          </motion.div>

          {/* Content */}
          <motion.div
            variants={slideInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="space-y-6">
              <motion.div variants={fadeUp} className="flex items-center gap-4">
                <span className="font-serif text-6xl text-gold">2023</span>
                <div className="h-px flex-1 bg-gold/30" />
              </motion.div>

              <motion.h3
                variants={fadeUp}
                className="font-serif text-2xl md:text-3xl text-bianco"
              >
                Giovanni Battista Obletter
              </motion.h3>

              <motion.p
                variants={fadeUp}
                className="font-sans text-bianco/70 leading-relaxed"
              >
                GBiO nasce dalla passione per la terra e dalla volontà di portare
                sulla tavola prodotti autentici e genuini. Una scelta consapevole
                verso l&apos;agricoltura biologica, nel rispetto dell&apos;ambiente
                e delle tradizioni abruzzesi.
              </motion.p>

              <motion.p
                variants={fadeUp}
                className="font-sans text-bianco/70 leading-relaxed"
              >
                I nostri 43 ettari di seminativi e 6 ettari di uliveto a Cepagatti,
                nel cuore dell&apos;Abruzzo, producono grani antichi, olio extravergine
                DOP e ortaggi biologici certificati ICEA.
              </motion.p>
            </div>

            <motion.div
              variants={fadeUp}
              className="grid grid-cols-3 gap-6 pt-8 border-t border-gold/20"
            >
              <div>
                <span className="font-serif text-4xl text-gold">49</span>
                <p className="font-sans text-xs uppercase tracking-wider text-bianco/50 mt-2">
                  Ettari Totali
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
                  Uliveto
                </p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
