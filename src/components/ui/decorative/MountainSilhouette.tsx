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
            <stop offset="20%" stopColor="var(--gold)" stopOpacity="0.5" />
            <stop offset="50%" stopColor="var(--gold)" stopOpacity="0.8" />
            <stop offset="80%" stopColor="var(--gold)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--gold)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Gran Sasso silhouette - elegant mountain range */}
        <motion.path
          d="M0 300
             L0 240
             Q100 235, 180 220
             Q260 205, 340 180
             Q400 160, 450 130
             Q500 100, 540 75
             Q570 55, 600 50
             Q630 55, 660 75
             Q700 100, 750 130
             Q800 160, 860 180
             Q940 205, 1020 220
             Q1100 235, 1200 240
             L1200 300
             Z"
          fill="url(#mountainGradient)"
          stroke="url(#mountainStroke)"
          strokeWidth="1.5"
          initial={animated ? { pathLength: 0, opacity: 0 } : undefined}
          animate={animated ? { pathLength: 1, opacity: 1 } : undefined}
          transition={{ duration: 2, ease: 'easeOut' }}
        />

        {/* Secondary layer for depth */}
        <motion.path
          d="M0 300
             L0 260
             Q150 255, 300 240
             Q450 220, 550 190
             Q600 175, 650 190
             Q750 220, 900 240
             Q1050 255, 1200 260
             L1200 300
             Z"
          fill="url(#mountainGradient)"
          opacity="0.5"
          initial={animated ? { opacity: 0 } : undefined}
          animate={animated ? { opacity: 0.5 } : undefined}
          transition={{ duration: 2, delay: 0.3 }}
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
