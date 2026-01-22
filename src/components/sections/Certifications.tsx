'use client'

import { motion } from 'framer-motion'
import { Leaf, Award, Shield, CheckCircle } from 'lucide-react'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'

const certifications = [
  {
    icon: Leaf,
    title: 'Biologico Certificato ICEA',
    code: 'IT-BIO-006',
    description: 'Tutti i nostri prodotti sono certificati biologici ICEA secondo il Reg. UE 2018/848. Nessun pesticida, nessun OGM, solo natura.',
    features: [
      'Coltivazione senza pesticidi chimici',
      'Fertilizzazione naturale',
      'Rispetto della biodiversità',
      'Rotazione delle colture',
    ],
  },
  {
    icon: Award,
    title: 'DOP Aprutino Pescarese',
    code: 'Reg. CE 1263/96',
    description: 'Il nostro olio extravergine è certificato DOP, a garanzia dell\'origine e della qualità superiore riconosciuta a livello europeo.',
    features: [
      'Origine garantita',
      'Disciplinare di produzione rigoroso',
      'Controlli di qualità continui',
      'Tracciabilità completa',
    ],
  },
]

export function Certifications() {
  return (
    <section id="certificazioni" className="section-padding bg-nero relative">
      {/* Decorative line */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-24 bg-gradient-to-b from-transparent via-gold to-transparent" />

      <div className="container-custom">
        <SectionTitle
          eyebrow="Garanzia di Qualità"
          title="Le Nostre Certificazioni"
          subtitle="La qualità non è un caso, ma il risultato di scelte consapevoli e standard rigorosi."
        />

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-20 grid md:grid-cols-2 gap-8 lg:gap-12"
        >
          {certifications.map((cert, index) => (
            <motion.article
              key={cert.title}
              variants={staggerItem}
              className="relative group"
            >
              <div className="border border-gold/30 p-8 lg:p-12 h-full bg-gradient-to-br from-nero to-forest-dark/30 group-hover:border-gold/60 transition-colors duration-500">
                {/* Icon */}
                <div className="w-16 h-16 border border-gold flex items-center justify-center mb-8">
                  <cert.icon size={32} className="text-gold" />
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

                {/* Corner decoration */}
                <div className="absolute top-0 right-0 w-16 h-16">
                  <div className="absolute top-4 right-4 w-full h-full border-t border-r border-gold/20 group-hover:border-gold/40 transition-colors duration-500" />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {/* Additional badges */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 flex flex-wrap justify-center gap-8"
        >
          <div className="flex items-center gap-3 px-6 py-3 border border-gold/30">
            <Shield size={20} className="text-gold" />
            <span className="font-sans text-xs uppercase tracking-wider text-bianco/60">
              Filiera Controllata
            </span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 border border-gold/30">
            <Award size={20} className="text-gold" />
            <span className="font-sans text-xs uppercase tracking-wider text-bianco/60">
              Made in Italy
            </span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 border border-gold/30">
            <Leaf size={20} className="text-gold" />
            <span className="font-sans text-xs uppercase tracking-wider text-bianco/60">
              Zero Residui
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
