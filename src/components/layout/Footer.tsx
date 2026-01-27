'use client'

import { motion } from 'framer-motion'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { MountainSilhouette } from '@/components/ui/decorative/MountainSilhouette'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-nero border-t border-gold/20 relative overflow-hidden">
      {/* Mountain Silhouette - Background */}
      <div className="absolute top-0 left-0 right-0 z-0 opacity-30">
        <MountainSilhouette variant="footer" animated={false} />
      </div>
      <div className="container-custom py-16 md:py-24 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12"
        >
          <motion.div variants={staggerItem} className="space-y-6">
            <h3 className="font-serif text-3xl text-gold">GBiO</h3>
            <p className="font-sans text-sm text-bianco/60 leading-relaxed">
              Azienda Agricola G.B. Obletter.
              Via Sicilia 2/A, 65012 Cepagatti (PE).
            </p>
            <p className="font-serif text-sm text-gold/60 italic mt-4">
              {`"Non vendo prodotti. Condivido ciò in cui credo."`}
            </p>
            <p className="font-sans text-xs text-bianco/40">
              P.IVA IT02773610692
            </p>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
              Contatti
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="mailto:gb.obletter@gmail.com"
                  className="flex items-center gap-3 text-bianco/60 hover:text-gold transition-colors"
                >
                  <Mail size={16} />
                  <span className="text-sm">gb.obletter@gmail.com</span>
                </a>
              </li>
              <li>
                <a
                  href="tel:+393926362254"
                  className="flex items-center gap-3 text-bianco/60 hover:text-gold transition-colors"
                >
                  <Phone size={16} />
                  <span className="text-sm">+39 392 636 2254</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-bianco/60">
                  <MapPin size={16} className="mt-1 flex-shrink-0" />
                  <span className="text-sm">
                    Via Sicilia 2/A
                    <br />
                    65012 Cepagatti (PE)
                  </span>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
              Navigazione
            </h4>
            <ul className="space-y-3">
              {['Heritage', 'Prodotti', 'Territorio', 'Certificazioni', 'Contatti'].map(
                (item) => (
                  <li key={item}>
                    <a
                      href={`#${item.toLowerCase()}`}
                      className="text-sm text-bianco/60 hover:text-gold transition-colors"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
              Seguici
            </h4>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/gbio_farm"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-nero transition-all duration-300"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-nero transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
            </div>

            <div className="pt-4">
              <h5 className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">
                Certificazioni
              </h5>
              <div className="flex gap-4">
                <div className="px-3 py-2 border border-forest text-forest text-xs font-sans uppercase tracking-wider">
                  Bio
                </div>
                <div className="px-3 py-2 border border-gold text-gold text-xs font-sans uppercase tracking-wider">
                  DOP
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-16 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4"
        >
          <p className="text-xs text-bianco/40">
            &copy; {currentYear} GBiO - Azienda Agricola G.B. Obletter | Via Sicilia 2/A, 65012 Cepagatti (PE) | P.IVA IT02773610692 | Biologico ICEA IT-BIO-006
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-bianco/40 hover:text-gold transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-xs text-bianco/40 hover:text-gold transition-colors">
              Cookie Policy
            </a>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
