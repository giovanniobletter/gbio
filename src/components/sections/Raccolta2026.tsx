'use client'

import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { useLocale, useTranslations } from 'next-intl'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'
import { galleryItems, type RaccoltaVideo } from '@/data/raccolta2026'

// Video della galleria: parte solo quando è visibile e si ferma quando esce dallo schermo.
function InViewVideo({ item, label }: { item: RaccoltaVideo; label: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {})
        else video.pause()
      },
      { threshold: 0.25 }
    )
    io.observe(video)
    return () => io.disconnect()
  }, [])

  return (
    <video
      ref={ref}
      src={item.src}
      poster={item.poster}
      width={item.width}
      height={item.height}
      muted
      loop
      playsInline
      preload="none"
      aria-label={label}
      className="block w-full h-auto"
    />
  )
}

export function Raccolta2026() {
  const t = useTranslations('raccolta')
  const locale = useLocale() === 'en' ? 'en' : 'it'

  return (
    <section id="raccolta" className="section-padding bg-nero relative overflow-hidden">
      <TextureOverlay variant="paper" opacity={0.015} />

      <div className="container-custom relative z-10">
        <SectionTitle eyebrow={t('eyebrow')} title={t('title')} subtitle={t('subtitle')} />

        <div className="mt-16 columns-2 md:columns-3 gap-4 md:gap-6">
          {galleryItems.map((item, idx) => (
            <motion.figure
              key={item.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 0.9, delay: (idx % 3) * 0.12, ease: [0.25, 0.1, 0.25, 1] }}
              className="mb-4 md:mb-6 break-inside-avoid overflow-hidden border border-gold/10 bg-nero"
            >
              {item.type === 'image' ? (
                <Image
                  src={item.src}
                  alt={item.alt[locale]}
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 768px) 50vw, 33vw"
                  className="block w-full h-auto transition-transform duration-[1500ms] ease-out hover:scale-[1.03]"
                />
              ) : (
                <InViewVideo item={item} label={item.alt[locale]} />
              )}
            </motion.figure>
          ))}
        </div>

        <p className="mt-10 text-center font-sans text-[10px] uppercase tracking-[0.3em] text-gold/50">
          {t('caption')}
        </p>
      </div>
    </section>
  )
}
