'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { cn } from '@/lib/utils'

interface MountainSilhouetteProps {
  className?: string
  variant?: 'hero' | 'section' | 'footer'
  animated?: boolean
}

/**
 * Bella Addormentata (Sleeping Beauty) - Gran Sasso mountain silhouette
 * Iconic profile of the Abruzzo mountains
 */
export function MountainSilhouette({
  className,
  variant = 'section',
  animated = true,
}: MountainSilhouetteProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.3, 1, 1, 0.3])

  const variants = {
    hero: 'h-[40vh] md:h-[50vh]',
    section: 'h-32 md:h-48',
    footer: 'h-24 md:h-32',
  }

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full overflow-hidden pointer-events-none', className)}
    >
      <motion.svg
        viewBox="0 0 1200 300"
        className={cn('w-full', variants[variant])}
        preserveAspectRatio="xMidYMax slice"
        style={animated ? { y, opacity } : undefined}
        initial={animated ? { opacity: 0 } : undefined}
        animate={animated ? { opacity: 1 } : undefined}
        transition={{ duration: 1.5 }}
      >
        <defs>
          <linearGradient id="mountainGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0.15" />
            <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.08" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0.02" />
          </linearGradient>
          <linearGradient id="mountainStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0" />
            <stop offset="20%" stopColor="var(--gold)" stopOpacity="0.3" />
            <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.5" />
            <stop offset="80%" stopColor="var(--gold)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gran Sasso / Bella Addormentata silhouette */}
        <motion.path
          d="M0 300
             L50 280
             L100 265
             L150 270
             L200 250
             L280 220
             L320 200
             L380 180
             L420 150
             L460 120
             L500 95
             L540 75
             L580 60
             L620 50
             L660 55
             L700 70
             L740 90
             L780 115
             L820 140
             L860 160
             L900 175
             L940 185
             L980 200
             L1020 220
             L1060 240
             L1100 255
             L1150 270
             L1200 280
             L1200 300
             Z"
          fill="url(#mountainGradient)"
          stroke="url(#mountainStroke)"
          strokeWidth="1"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 2, ease: 'easeOut' }}
        />

        {/* Secondary ridge - creates depth */}
        <motion.path
          d="M0 300
             L100 290
             L200 275
             L300 260
             L400 230
             L480 200
             L540 175
             L600 155
             L660 145
             L720 150
             L780 165
             L840 185
             L900 210
             L1000 245
             L1100 270
             L1200 285
             L1200 300
             Z"
          fill="url(#mountainGradient)"
          opacity="0.5"
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 0.5 } : undefined}
          transition={{ duration: 2, delay: 0.5 }}
        />
      </motion.svg>
    </div>
  )
}

/**
 * Horizontal mountain divider - subtle separator between sections
 */
export function MountainDivider({ className }: { className?: string }) {
  return (
    <div className={cn('relative w-full h-16 md:h-24 overflow-hidden', className)}>
      <svg
        viewBox="0 0 1200 100"
        className="w-full h-full"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="dividerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--gold)" stopOpacity="0" />
            <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path
          d="M0 100 L300 80 L500 60 L600 40 L700 60 L900 80 L1200 100"
          fill="none"
          stroke="url(#dividerGradient)"
          strokeWidth="1"
        />
      </svg>
    </div>
  )
}
