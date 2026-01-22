'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { ChevronDown } from 'lucide-react'
import { useRef } from 'react'
import Image from 'next/image'
import { MountainSilhouette } from '@/components/ui/decorative/MountainSilhouette'

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%'])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2])

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-nero"
    >
      {/* Olive Tree Background */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center opacity-10"
        style={{ scale }}
      >
        <Image
          src="/olive-tree.svg"
          alt=""
          width={600}
          height={750}
          className="h-[90vh] w-auto"
          priority
        />
      </motion.div>

      {/* Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6"
        style={{ y, opacity }}
      >
        {/* Logo GBO */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="mb-8"
        >
          <Image
            src="/logo-gbo.svg"
            alt="GBO - Azienda Agricola G.B. Obletter"
            width={400}
            height={430}
            className="w-64 md:w-80 lg:w-96 h-auto logo-gold"
            priority
          />
        </motion.div>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="w-24 h-px bg-gold mb-8"
        />

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="font-sans text-xs md:text-sm uppercase tracking-[0.3em] text-gold/80 mb-2"
        >
          Triangolo d&apos;Oro dell&apos;Olio
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="font-sans text-xs uppercase tracking-[0.2em] text-bianco/50"
        >
          Castellana · Abruzzo
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.4 }}
          className="mt-12"
        >
          <a
            href="#prodotti"
            className="btn-primary"
          >
            <span>Esplora</span>
          </a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.a
          href="#heritage"
          className="flex flex-col items-center gap-2 text-gold"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-sans text-xs uppercase tracking-[0.2em]">
            Esplora
          </span>
          <ChevronDown size={20} />
        </motion.a>
      </motion.div>

      {/* Side Text */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute left-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block"
      >
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold/60 writing-vertical">
          Castellana • Abruzzo
        </span>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute right-6 top-1/2 -translate-y-1/2 z-10 hidden lg:block"
      >
        <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold/60 writing-vertical">
          Est. 1700
        </span>
      </motion.div>

      {/* Mountain Silhouette - Bella Addormentata */}
      <div className="absolute bottom-0 left-0 right-0 z-0">
        <MountainSilhouette variant="hero" />
      </div>
    </section>
  )
}
