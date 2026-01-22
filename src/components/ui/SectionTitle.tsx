'use client'

import { motion } from 'framer-motion'
import { fadeUp, lineReveal } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface SectionTitleProps {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  className?: string
  light?: boolean
}

export function SectionTitle({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
  light = false,
}: SectionTitleProps) {
  const alignClasses = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
      className={cn('flex flex-col gap-4', alignClasses[align], className)}
    >
      {eyebrow && (
        <motion.span
          variants={fadeUp}
          className="text-gold font-sans text-xs uppercase tracking-[0.3em]"
        >
          {eyebrow}
        </motion.span>
      )}

      <motion.h2
        variants={fadeUp}
        className={cn(
          'font-serif text-title',
          light ? 'text-nero' : 'text-bianco'
        )}
      >
        {title}
      </motion.h2>

      <motion.div
        variants={lineReveal}
        className="w-16 h-px bg-gold"
      />

      {subtitle && (
        <motion.p
          variants={fadeUp}
          className={cn(
            'font-sans text-lg max-w-2xl leading-relaxed',
            light ? 'text-nero/70' : 'text-bianco/70'
          )}
        >
          {subtitle}
        </motion.p>
      )}
    </motion.div>
  )
}
