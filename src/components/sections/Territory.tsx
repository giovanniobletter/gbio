'use client'

import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Sun, Droplets, Mountain, MapPin } from 'lucide-react'
import { cn } from '@/lib/utils'

const slides = [
  '/images/territory/05-albero-tramonto.jpg',
  '/images/territory/12-spighe-grano.jpg',
  '/images/territory/09-fiore-mandorlo.jpg',
  '/images/territory/11-albero-fiorito.jpg',
  '/images/territory/04-germogli.jpg',
  '/images/territory/08-alberi-nebbia.jpg',
  '/images/territory/07-edificio-nebbia.jpg',
  '/images/territory/10-prato-erba.jpg',
  '/images/territory/14-campo-verde.jpg',
  '/images/territory/03-seminatrice.jpg',
  '/images/territory/02-trattore.jpg',
  '/images/territory/01-grano-sacchi.jpg',
  '/images/territory/13-cane-prato.jpg',
  '/images/territory/06-piante-muro.jpg',
]

export function Territory() {
  const t = useTranslations('territory')
  const sectionRef = useRef<HTMLElement>(null)
  const [slideIdx, setSlideIdx] = useState(0)
  // Slideshow e nebbie girano solo mentre la sezione è sullo schermo
  const inView = useInView(sectionRef, { amount: 0 })
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  })

  useEffect(() => {
    if (!inView) return
    const id = setInterval(() => {
      setSlideIdx((i) => (i + 1) % slides.length)
    }, 4500)
    return () => clearInterval(id)
  }, [inView])

  // Parallax transforms
  const fogOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 0.6, 0.3])

  // Animazione lenta, contemplativa
  const slowReveal = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
        delayChildren: 0.3
      }
    }
  }

  const features = [
    {
      icon: Sun,
      value: '300+',
      label: t('features.sunLabel'),
      description: t('features.sunDesc'),
    },
    {
      icon: Droplets,
      value: '',
      label: t('features.waterLabel'),
      description: t('features.waterDesc'),
    },
    {
      icon: Mountain,
      value: '200-400',
      label: t('features.altitudeLabel'),
      description: t('features.altitudeDesc'),
    },
    {
      icon: MapPin,
      value: '',
      label: t('features.terroirLabel'),
      description: t('features.terroirDesc'),
    },
  ]

  return (
    <section
      ref={sectionRef}
      id="territorio"
      className={cn('relative min-h-[200vh] bg-nero overflow-hidden', !inView && 'anim-paused')}
    >
      {/* Sticky slideshow background */}
      <div className="sticky top-0 h-screen w-full overflow-hidden z-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={slides[slideIdx]}
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1 }}
            transition={{
              opacity: { duration: 2, ease: 'easeInOut' },
              scale: { duration: 6, ease: 'easeOut' },
            }}
            className="absolute inset-0"
          >
            <Image
              src={slides[slideIdx]}
              alt=""
              fill
              className="object-cover"
              priority={slideIdx === 0}
              sizes="100vw"
            />
          </motion.div>
        </AnimatePresence>
        {/* Dark overlay for legibility */}
        <div className="absolute inset-0 bg-nero/70" />
        <div className="absolute inset-0 bg-gradient-to-b from-nero/50 via-nero/30 to-nero/80" />
      </div>

      {/* Gradiente che respira (animazione CSS: solo opacity, sul compositor) */}
      <div className="absolute inset-0 z-[1] pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-nero/40 via-forest-dark/20 to-nero/40 anim-breathe" />
      </div>

      {/* Nebbia - layer 1: il gradiente è già morbido, senza filtro blur
          (un blur di 64px su un livello alto 200vh costava un raster a ogni frame) */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: fogOpacity }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-bianco/5 to-transparent" />
      </motion.div>

      {/* Nebbia - layer 2: deriva orizzontale in CSS, bordi morbidi con un
          gradiente radiale al posto del blur */}
      <div className="absolute inset-0 pointer-events-none anim-drift">
        <div
          className="absolute top-1/3 left-0 right-0 h-96"
          style={{
            background:
              'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(201, 169, 97, 0.04), transparent 70%)',
          }}
        />
      </div>


      {/* Contenuto - offset sopra il bg sticky */}
      <div className="relative z-10 -mt-[100vh] flex flex-col items-center justify-center px-8">

        {/* BLOCCO 1 - Apertura */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          className="text-center max-w-4xl mx-auto py-32 min-h-screen flex flex-col justify-center"
        >
          <motion.p
            variants={slowReveal}
            className="font-sans text-xs uppercase tracking-[0.5em] text-gold/60 mb-12"
          >
            Il Nostro Territorio
          </motion.p>

          <motion.h2
            variants={slowReveal}
            className="font-serif text-4xl md:text-6xl lg:text-7xl text-bianco leading-tight mb-8"
          >
            49 Ettari
            <br />
            <span className="text-gold">di Biodiversità</span>
          </motion.h2>

          <motion.p
            variants={slowReveal}
            className="font-serif text-xl md:text-2xl text-bianco/60 italic"
          >
            Dove il Gran Sasso incontra l&apos;Adriatico, nasce l&apos;eccellenza.
          </motion.p>

          <motion.div
            variants={slowReveal}
            className="w-px h-24 bg-gradient-to-b from-transparent via-gold/50 to-transparent mx-auto mt-16"
          />
        </motion.div>

        {/* BLOCCO 2 - Stats ettari */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          className="text-center max-w-4xl mx-auto py-24"
        >
          <div className="flex justify-center gap-16 md:gap-32">
            <motion.div variants={slowReveal} className="text-center">
              <span className="font-serif text-7xl md:text-9xl text-gold/30">43 <span className="text-4xl md:text-5xl">ha</span></span>
              <p className="font-sans text-sm text-bianco/50 mt-4 tracking-widest uppercase">
                Seminativi
              </p>
            </motion.div>

            <motion.div variants={slowReveal} className="text-center">
              <span className="font-serif text-7xl md:text-9xl text-gold/30">6 <span className="text-4xl md:text-5xl">ha</span></span>
              <p className="font-sans text-sm text-bianco/50 mt-4 tracking-widest uppercase">
                Uliveto
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* BLOCCO 3 - Features grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-10%" }}
          className="max-w-5xl mx-auto py-32 w-full"
        >
          <div className="grid md:grid-cols-2 gap-16 md:gap-24">
            {features.map((feature, index) => (
              <motion.div
                key={feature.label}
                variants={slowReveal}
                className="text-center md:text-left group"
              >
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                  <div className="w-16 h-16 border border-gold/20 flex items-center justify-center group-hover:border-gold/50 group-hover:bg-gold/5 transition-all duration-700">
                    <feature.icon size={28} className="text-gold/70" strokeWidth={1} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 justify-center md:justify-start">
                      {feature.value && (
                        <span className="font-serif text-4xl text-gold">{feature.value}</span>
                      )}
                      <span className="font-sans text-sm uppercase tracking-[0.2em] text-bianco/80">
                        {feature.label}
                      </span>
                    </div>
                    <p className="font-serif text-lg text-bianco/50 mt-3 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* BLOCCO 4 - Chiusura poetica */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-20%" }}
          className="text-center max-w-3xl mx-auto py-32 relative"
        >
          {/* Sistema sole-luna-foglia */}
          <div className="relative w-32 h-32 mx-auto mb-16">
            {/* Sole - orbita con scroll */}
            <motion.div
              className="absolute inset-0"
              style={{
                rotate: useTransform(scrollYProgress, [0.5, 1], [0, 360]),
              }}
            >
              <div
                className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-gold"
                style={{
                  boxShadow: '0 0 20px rgba(201, 169, 97, 0.8)',
                }}
              />
            </motion.div>

            {/* Luna - orbita opposta */}
            <motion.div
              className="absolute inset-0"
              style={{
                rotate: useTransform(scrollYProgress, [0.5, 1], [180, 540]),
              }}
            >
              <div
                className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-bianco/90"
                style={{
                  boxShadow: '0 0 12px rgba(255, 255, 255, 0.6)',
                }}
              />
            </motion.div>

            {/* Logo GBiO al centro */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5 }}
            >
              <img
                src="/logo-gbo-short.svg"
                alt="GBiO"
                className="w-16 h-16 object-contain"
              />
            </motion.div>
          </div>

          <motion.p
            variants={slowReveal}
            className="font-serif text-2xl md:text-3xl text-bianco/80 leading-relaxed"
          >
            Una terra che lavora in silenzio.
          </motion.p>

          <motion.p
            variants={slowReveal}
            className="font-sans text-xs text-gold/40 mt-12 tracking-[0.4em] uppercase"
          >
            Noi raccogliamo.
          </motion.p>
        </motion.div>

      </div>

      {/* Gradiente finale verso nero */}
      <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-nero to-transparent z-20 pointer-events-none" />
    </section>
  )
}
