'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { Instagram, Facebook, Mail, Phone, MapPin } from 'lucide-react'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { MountainSilhouette } from '@/components/ui/decorative/MountainSilhouette'
import { reopenCookieBanner } from '@/components/ui/CookieBanner'
import { company } from '@/data/company'

export function Footer() {
  const currentYear = new Date().getFullYear()
  const t = useTranslations('footer')
  const locale = useLocale()

  const navItems = [
    { labelKey: 'heritage', href: '#heritage' },
    { labelKey: 'products', href: '#prodotti' },
    { labelKey: 'territory', href: '#territorio' },
    { labelKey: 'certifications', href: '#certificazioni' },
    { labelKey: 'contact', href: '#contatti' },
  ] as const

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
            <Image
              src="/logo-gbio.svg"
              alt="GBiO"
              width={120}
              height={48}
              className="h-12 w-auto"
            />
            <p className="font-sans text-sm text-bianco/60 leading-relaxed">
              {t('tagline')}
            </p>
            <p className="font-serif text-sm text-gold/60 italic mt-4">
              {t('quote')}
            </p>
            {/* Dati identificativi obbligatori: art. 7 D.Lgs. 70/2003, art. 35 DPR 633/72 */}
            <p className="font-sans text-xs text-bianco/40 leading-relaxed">
              {company.legalName}
              <br />
              {company.address.street}, {company.address.postalCode} {company.address.city} ({company.address.province})
              <br />
              P.IVA {company.vatNumber}
              {company.rea && <><br />REA {company.rea}</>}
              {company.pec && <><br />PEC: {company.pec}</>}
            </p>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
              {t('contactTitle')}
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href={`mailto:${company.email}`}
                  className="flex items-center gap-3 text-bianco/60 hover:text-gold transition-colors"
                >
                  <Mail size={16} />
                  <span className="text-sm">{company.email}</span>
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
                    Via Sicilia, Fraz. Villanova 2/a
                    <br />
                    65012 Cepagatti (PE)
                  </span>
                </div>
              </li>
            </ul>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
              {t('navTitle')}
            </h4>
            <ul className="space-y-3">
              {navItems.map((item) => (
                <li key={item.labelKey}>
                  <a
                    href={`/${locale}/${item.href}`}
                    className="text-sm text-bianco/60 hover:text-gold transition-colors"
                  >
                    {t(`links.${item.labelKey}`)}
                  </a>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div variants={staggerItem} className="space-y-6">
            <h4 className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
              {t('followTitle')}
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
                href="https://www.facebook.com/profile.php?id=61588334991528"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 border border-gold/40 flex items-center justify-center text-gold hover:bg-gold hover:text-nero transition-all duration-300"
              >
                <Facebook size={18} />
              </a>
            </div>

            <div className="pt-4">
              <h5 className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">
                {t('certTitle')}
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
            {t('copyright', { year: currentYear })}
          </p>
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2">
            <a href={`/${locale}/termini`} className="text-xs text-bianco/40 hover:text-gold transition-colors">
              {t('termsLink')}
            </a>
            <a href={`/${locale}/recesso`} className="text-xs text-bianco/40 hover:text-gold transition-colors">
              {t('withdrawalLink')}
            </a>
            <a href={`/${locale}/privacy`} className="text-xs text-bianco/40 hover:text-gold transition-colors">
              {t('privacyPolicy')}
            </a>
            <a href={`/${locale}/cookies`} className="text-xs text-bianco/40 hover:text-gold transition-colors">
              {t('cookiePolicy')}
            </a>
            <button
              onClick={reopenCookieBanner}
              className="text-xs text-bianco/40 hover:text-gold transition-colors"
            >
              {t('manageCookies')}
            </button>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
