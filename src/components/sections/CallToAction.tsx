'use client'

import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'

export function CallToAction() {
  const t = useTranslations('callToAction')
  const locale = useLocale()

  return (
    <section className="py-24 sm:py-32 bg-nero border-t border-b border-gold/20">
      <div className="container-custom">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto"
        >
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-bianco mb-6">
            {t('title')}
          </h2>

          <p className="font-sans text-sm sm:text-base text-bianco/60 mb-10">
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
              className="px-8 py-4 border border-gold/50 text-gold font-sans text-xs uppercase tracking-[0.2em] hover:border-gold hover:bg-gold/10 transition-all duration-300"
            >
              {t('contactUs')}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
