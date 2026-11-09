'use client'

import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import { useRef } from 'react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

const productImages = [
  '/images/pasta-penne.jpg',
  '/images/olio-05l.jpg',
  '/images/pasta-tagliatelle.jpg',
  '/images/passata-pomodoro.jpg',
  '/images/olio-latta-5l.jpg',
  '/images/pasta-mezzemaniche.jpg',
  '/images/semolato-cappelli.jpg',
  '/images/olio-3l.jpg',
  '/images/pasta-quadrucci.jpg',
  '/images/pasta-fettuccine.jpg',
  '/images/farina-gentilrosso.jpg',
]

export function Hero() {
  const t = useTranslations('hero')
  const sectionRef = useRef<HTMLElement>(null)
  // Le animazioni infinite (carosello, invito allo scroll) sono in CSS e si
  // fermano quando la hero esce dallo schermo: niente lavoro per frame mentre
  // l'utente scorre il resto della pagina.
  const inView = useInView(sectionRef, { amount: 0 })

  return (
    <section
      ref={sectionRef}
      id="hero"
      className={cn('relative h-screen w-full overflow-hidden bg-nero', !inView && 'anim-paused')}
    >
      {/* Main container */}
      <div className="relative h-full w-full overflow-hidden">

        {/* Background - Scrolling product carousel */}
        <div className="absolute inset-0 flex overflow-hidden">
          <div className="flex gap-8 anim-marquee">
            {[...productImages, ...productImages].map((img, idx) => (
              <div
                key={idx}
                className="relative w-[300px] h-screen flex-shrink-0 opacity-50"
                style={{
                  maskImage: 'radial-gradient(ellipse 70% 60% at center, black 30%, transparent 70%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at center, black 30%, transparent 70%)',
                }}
              >
                <Image
                  src={img}
                  alt=""
                  fill
                  sizes="300px"
                  className="object-contain object-center"
                  priority={idx < 4}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-nero/70 via-nero/50 to-nero/70 pointer-events-none" />

        {/* Logo - Centered and prominent */}
        <motion.div
          className="absolute inset-x-0 top-[15%] z-20 flex flex-col items-center"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src="/logo-gbio.svg"
            alt="GBiO - Azienda Agricola G.B. Obletter"
            width={600}
            height={120}
            className="w-[280px] md:w-[400px] lg:w-[500px] h-auto mb-8"
            priority
          />

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-serif text-3xl md:text-4xl lg:text-5xl text-gold text-center mt-40"
          >
            {t('tagline')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="font-sans text-sm md:text-base lg:text-lg text-bianco/80 text-center mt-4 tracking-wide"
          >
            {t('subtitle')}
          </motion.p>

          <motion.a
            href="#prodotti"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 1 }}
            className="mt-8 px-8 py-3 border border-gold text-gold font-sans text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-nero transition-all duration-300"
          >
            {t('cta')}
          </motion.a>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1, ease: [0.16, 1, 0.3, 1] }}
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-32 bg-gradient-to-b from-gold/50 to-transparent origin-top"
        />

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-2 text-gold/60 anim-float">
            <span className="font-sans text-[10px] uppercase tracking-[0.3em]">
              {t('scroll')}
            </span>
            <svg width="20" height="30" viewBox="0 0 20 30" className="text-gold/40">
              <rect x="1" y="1" width="18" height="28" rx="9" stroke="currentColor" strokeWidth="1" fill="none" />
              <circle cx="10" cy="8" r="3" fill="currentColor" className="anim-float" />
            </svg>
          </div>
        </motion.div>

        {/* Side text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/30 writing-vertical">
            {t('sideLeft')}
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block"
        >
          <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold/30 writing-vertical">
            {t('sideRight')}
          </span>
        </motion.div>
      </div>
    </section>
  )
}
