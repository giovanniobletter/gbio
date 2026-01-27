'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Leaf, Award, Shield, CheckCircle } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { luxuryFadeUp, luxuryStaggerContainer, luxuryStaggerItem } from '@/lib/animations'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'
import { OrnateRule } from '@/components/ui/decorative/OrnateRule'

const certifications = [
  {
    icon: Award,
    logo: '/images/logo-dop.png',
    title: 'Denominazione di Origine Protetta',
    code: 'DOP Aprutino Pescarese • Reg. CE 1263/96',
    description: 'Una delle prime DOP italiane per l\'olio, riconosciuta dal 1996. Garantisce che ogni goccia sia prodotta, trasformata e confezionata esclusivamente nei 34 comuni della provincia di Pescara, seguendo un disciplinare rigoroso che tutela duemila anni di tradizione olivicola.',
    features: [
      'Prodotto nei 34 comuni della provincia di Pescara',
      'Disciplinare di produzione rigoroso',
      'Duemila anni di tradizione olivicola',
      'Tracciabilità completa',
    ],
  },
  {
    icon: Leaf,
    logo: '/images/logo-bio-eu.png',
    title: 'Certificazione Biologica IT-BIO-006',
    code: 'Biologico ICEA • Operatore S2451',
    description: 'Operatore ICEA S2451. Zero pesticidi, zero fertilizzanti chimici, zero OGM. Controlli annuali in campo e analisi di laboratorio garantiscono la purezza assoluta dei nostri prodotti.',
    features: [
      'Zero pesticidi chimici',
      'Zero fertilizzanti chimici',
      'Zero OGM',
      'Controlli annuali in campo',
    ],
  },
]

export function Certifications() {
  return (
    <section id="certificazioni" className="section-padding bg-nero relative">
      {/* Subtle texture overlay */}
      <TextureOverlay variant="paper" opacity={0.02} />

      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-gold to-transparent" />

      <div className="container-custom">
        <SectionTitle
          eyebrow="Certificazioni"
          title="Garanzie di Eccellenza"
          subtitle="Certificazioni che parlano per noi"
        />

        {/* Ornate divider */}
        <div className="mt-12">
          <OrnateRule variant="diamond" />
        </div>

        <motion.div
          variants={luxuryStaggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-12 grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {certifications.map((cert, index) => (
            <motion.article
              key={cert.title}
              variants={luxuryStaggerItem}
              className="relative group"
            >
              <div className="border border-gold/30 p-8 lg:p-12 h-full bg-gradient-to-br from-nero to-forest-dark/30 group-hover:border-gold/60 group-hover:glow-gold transition-all duration-700">
                {/* Logo */}
                <div className="w-56 h-44 mb-8 relative -ml-2">
                  <Image
                    src={cert.logo}
                    alt={cert.title}
                    fill
                    className="object-contain object-left"
                  />
                </div>

                {/* Header */}
                <div className="mb-6">
                  <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold/60">
                    {cert.code}
                  </span>
                  <h3 className="font-serif text-2xl lg:text-3xl text-bianco mt-2">
                    {cert.title}
                  </h3>
                </div>

                {/* Description */}
                <p className="font-sans text-bianco/70 leading-relaxed mb-8">
                  {cert.description}
                </p>

                {/* Features */}
                <ul className="space-y-3">
                  {cert.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <CheckCircle size={16} className="text-gold flex-shrink-0" />
                      <span className="font-sans text-sm text-bianco/60">
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Additional badges */}
        <motion.div
          variants={luxuryFadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          <div className="flex items-center gap-3 px-6 py-3 border border-gold/30 hover:border-gold/60 hover:glow-gold transition-all duration-700 cursor-default">
            <Shield size={20} className="text-gold" />
            <span className="font-sans text-xs uppercase tracking-luxe text-bianco/60">
              Filiera Controllata
            </span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 border border-gold/30 hover:border-gold/60 hover:glow-gold transition-all duration-700 cursor-default">
            <Award size={20} className="text-gold" />
            <span className="font-sans text-xs uppercase tracking-luxe text-bianco/60">
              Made in Italy
            </span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 border border-gold/30 hover:border-gold/60 hover:glow-gold transition-all duration-700 cursor-default">
            <Leaf size={20} className="text-gold" />
            <span className="font-sans text-xs uppercase tracking-luxe text-bianco/60">
              Zero Residui
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
