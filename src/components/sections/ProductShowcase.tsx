'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'
import {
  luxuryFadeUp,
  luxuryStaggerContainer,
  luxuryStaggerItem,
} from '@/lib/animations'

export function ProductShowcase() {
  const t = useTranslations('showcase')
  const locale = useLocale()

  const pairs: Array<{ src: string; altKey: string }[]> = [
    [
      { src: '/images/lifestyle/olio.jpg', altKey: 'altOlio' },
      { src: '/images/lifestyle/pasta-mezzemaniche.jpg', altKey: 'altMezzemaniche' },
    ],
    [
      { src: '/images/lifestyle/pasta-6-formati.jpg', altKey: 'altFormati' },
      { src: '/images/lifestyle/farine.jpg', altKey: 'altFarine' },
    ],
    [
      { src: '/images/lifestyle/olio-bottiglia.jpg', altKey: 'altOlioBottiglia' },
      { src: '/images/lifestyle/passata.jpg', altKey: 'altPassata' },
    ],
  ]

  return (
    <section id="vetrina" className="section-padding bg-nero relative overflow-hidden border-t border-b border-gold/20">
      <div className="container-custom">
        {/* Header */}
        <motion.div
          variants={luxuryFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="text-center mb-16 max-w-3xl mx-auto"
        >
          <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold/70 mb-4 block">
            {t('eyebrow')}
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-bianco mb-6">
            {t('title')}
          </h2>
          <p className="font-sans text-sm sm:text-base text-bianco/60">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Image grid */}
        <motion.div
          variants={luxuryStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          className="space-y-6 lg:space-y-8"
        >
          {pairs.map((pair, rowIdx) => (
            <div
              key={rowIdx}
              className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8"
            >
              {pair.map((img) => (
                <motion.div
                  key={img.src}
                  variants={luxuryStaggerItem}
                  className="relative aspect-[4/5] overflow-hidden border border-gold/20 group"
                >
                  <Image
                    src={img.src}
                    alt={t(img.altKey)}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                </motion.div>
              ))}
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          variants={luxuryFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 lg:mt-20 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={`/${locale}/#prodotti`}
            className="px-8 py-4 bg-gold text-nero font-sans text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-all duration-300"
          >
            {t('buyNow')}
          </a>
          <a
            href={`/${locale}/#contatti`}
            className="px-8 py-4 border border-gold/50 text-gold font-sans text-xs uppercase tracking-[0.2em] hover:border-gold hover:bg-gold/10 transition-all duration-300"
          >
            {t('contactUs')}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
