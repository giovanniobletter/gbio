'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useTranslations, useLocale } from 'next-intl'

const slides = [
  '/images/lifestyle/pasta-6-formati.jpg',
  '/images/lifestyle/pasta-mezzemaniche.jpg',
  '/images/lifestyle/farine.jpg',
  '/images/lifestyle/olio.jpg',
  '/images/lifestyle/passata.jpg',
]

export function CallToAction() {
  const t = useTranslations('callToAction')
  const locale = useLocale()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="relative min-h-[80vh] flex items-center py-24 sm:py-32 border-t border-b border-gold/20 overflow-hidden">
      {/* Background slideshow */}
      <div className="absolute inset-0 bg-nero">
        <AnimatePresence mode="sync">
          <motion.div
            key={slides[index]}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="absolute inset-0"
          >
            <Image
              src={slides[index]}
              alt=""
              fill
              className="object-cover object-[center_25%] scale-110 blur-[3px]"
              priority={index === 0}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-nero/65" />
        <div className="absolute inset-0 bg-gradient-to-b from-nero/40 via-transparent to-nero/40" />
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-bianco mb-6 drop-shadow-lg">
            {t('title')}
          </h2>

          <p className="font-sans text-sm sm:text-base text-bianco/80 mb-10 drop-shadow">
            {t('subtitle')}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`/${locale}/#prodotti`}
              className="px-8 py-4 bg-gold text-nero font-sans text-xs uppercase tracking-[0.2em] hover:bg-gold-light transition-all duration-300"
            >
              {t('buyNow')}
            </a>
            <a
              href={`/${locale}/#contatti`}
              className="px-8 py-4 border border-gold/70 text-gold font-sans text-xs uppercase tracking-[0.2em] hover:border-gold hover:bg-gold/10 transition-all duration-300 backdrop-blur-sm bg-nero/30"
            >
              {t('contactUs')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
