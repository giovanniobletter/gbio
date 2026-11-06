'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import type { SlideItem, SlideVideo } from '@/data/raccolta2026'

// Slideshow a tutto schermo di foto e video con dissolvenza.
// - foto: restano `photoSeconds` con una lenta zoomata
// - video: muti, in autoplay, avanzano alla fine (o dopo `videoMaxSeconds`)
// - `active` falso (sezione fuori schermo): tutto fermo
// - «riduci movimento»: resta la prima foto
// - se l'autoplay è bloccato (iPhone in risparmio energetico) il video è sostituito
//   dal suo poster, così non compare il tasto play.
type Props = {
  items: SlideItem[]
  active?: boolean
  photoSeconds?: number
  videoMaxSeconds?: number
  fadeSeconds?: number
  className?: string
}

// React non scrive l'attributo `muted` nell'HTML: Safari lo esige per l'autoplay.
function SlideVideoEl({ item, onDone, onBlocked }: { item: SlideVideo; onDone: () => void; onBlocked: () => void }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    el.muted = true
    el.defaultMuted = true
    el.setAttribute('muted', '')
    const p = el.play()
    if (p && typeof p.catch === 'function') p.catch(() => onBlocked())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [item.src])

  return (
    <video
      ref={ref}
      src={item.src}
      poster={item.poster}
      autoPlay
      muted
      playsInline
      preload="auto"
      aria-label={item.alt}
      onEnded={onDone}
      onError={onBlocked}
      className="absolute inset-0 h-full w-full object-cover"
    />
  )
}

export function MediaSlideshow({
  items,
  active = true,
  photoSeconds = 5,
  videoMaxSeconds = 11,
  fadeSeconds = 1.6,
  className = '',
}: Props) {
  const reduced = useReducedMotion()
  const [index, setIndex] = useState(0)
  const [blocked, setBlocked] = useState<Record<string, true>>({})
  const current = items[index % items.length]
  const showAsPhoto = current.type === 'image' || blocked[current.src]

  const advanceFrom = (from: number) =>
    setIndex((n) => (n === from ? (n + 1) % items.length : n))

  useEffect(() => {
    if (reduced || !active) return
    const ms = (showAsPhoto ? photoSeconds : videoMaxSeconds) * 1000
    const t = setTimeout(() => advanceFrom(index), ms)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index, active, reduced, showAsPhoto])

  // Precarica l'elemento successivo.
  useEffect(() => {
    if (!active) return
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
  }, [index, items, active])

  if (reduced) {
    const still = items.find((i) => i.type === 'image')
    const src = still ? still.src : current.type === 'video' ? current.poster : current.src
    return (
      <div className={`absolute inset-0 overflow-hidden ${className}`}>
        <Image src={src} alt="" fill sizes="(orientation: portrait) 250vw, 100vw" className="object-cover" />
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 overflow-hidden bg-nero ${className}`}>
      <AnimatePresence mode="sync">
        <motion.div
          key={`${current.src}-${index}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: fadeSeconds, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          {showAsPhoto ? (
            <motion.div
              initial={{ scale: 1.06 }}
              animate={{ scale: 1 }}
              transition={{ duration: photoSeconds + fadeSeconds * 2, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <Image
                src={current.type === 'video' ? current.poster : current.src}
                alt=""
                fill
                priority={index === 0}
                quality={85}
                sizes="(orientation: portrait) 250vw, 100vw"
                className="object-cover"
              />
            </motion.div>
          ) : (
            <SlideVideoEl
              item={current as SlideVideo}
              onDone={() => advanceFrom(index)}
              onBlocked={() => setBlocked((b) => ({ ...b, [current.src]: true }))}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
