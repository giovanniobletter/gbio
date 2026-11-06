'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { heroPlaylist } from '@/data/raccolta2026'

// Sfondo della hero: foto e video della raccolta 2026 alternati, con dissolvenza.
// Le foto restano PHOTO_SECONDS con una lenta zoomata; i video durano fino alla fine
// (o VIDEO_MAX_SECONDS se l'autoplay è bloccato). Con «riduci movimento» resta la prima foto.
const PHOTO_SECONDS = 6
const VIDEO_MAX_SECONDS = 11
const FADE_SECONDS = 1.4

export function HeroBackdrop() {
  const reduced = useReducedMotion()
  const [portrait, setPortrait] = useState(false)
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const mq = window.matchMedia('(max-aspect-ratio: 4/5)')
    const update = () => setPortrait(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const items = heroPlaylist(portrait ? 'portrait' : 'landscape')
  const current = items[index % items.length]

  // Avanza solo se nessun altro evento (fine video, timer) lo ha già fatto.
  const advanceFrom = (from: number) =>
    setIndex((n) => (n === from ? (n + 1) % items.length : n))

  useEffect(() => {
    if (reduced) return
    const ms = (current.type === 'image' ? PHOTO_SECONDS : VIDEO_MAX_SECONDS) * 1000
    const t = setTimeout(() => advanceFrom(index), ms)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, current, reduced])

  // Precarica l'elemento successivo per una dissolvenza senza buchi.
  useEffect(() => {
    const next = items[(index + 1) % items.length]
    if (next.type === 'image') {
      const im = new window.Image()
      im.src = next.src
    } else {
      const v = document.createElement('video')
      v.preload = 'auto'
      v.muted = true
      v.src = next.src
      v.load()
    }
  }, [index, items])

  if (reduced) {
    const still = items.find((i) => i.type === 'image') ?? items[0]
    return (
      <div className="absolute inset-0 overflow-hidden">
        <Image src={still.type === 'image' ? still.src : still.poster} alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
    )
  }

  return (
    <div className="absolute inset-0 overflow-hidden bg-nero">
      <AnimatePresence mode="sync">
        <motion.div
          key={`${current.src}-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: FADE_SECONDS, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {current.type === 'image' ? (
            <motion.div
              initial={{ scale: 1 }}
              animate={{ scale: 1.08 }}
              transition={{ duration: PHOTO_SECONDS + FADE_SECONDS * 2, ease: 'linear' }}
              className="absolute inset-0"
            >
              <Image
                src={current.src}
                alt=""
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <video
              src={current.src}
              poster={current.poster}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={() => advanceFrom(index)}
              onError={() => advanceFrom(index)}
              className="absolute inset-0 h-full w-full object-cover"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
