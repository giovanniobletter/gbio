'use client'

import { motion } from 'framer-motion'
import { luxuryFadeIn } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface EmbossedBorderProps {
  children: React.ReactNode
  className?: string
  animated?: boolean
  variant?: 'subtle' | 'prominent'
}

export function EmbossedBorder({
  children,
  className,
  animated = true,
  variant = 'subtle',
}: EmbossedBorderProps) {
  const borderStyles = {
    subtle: {
      boxShadow: `
        inset 0 1px 0 rgba(255, 255, 255, 0.05),
        inset 0 -1px 0 rgba(0, 0, 0, 0.2),
        0 0 0 1px rgba(201, 169, 97, 0.1)
      `,
    },
    prominent: {
      boxShadow: `
        inset 0 2px 0 rgba(255, 255, 255, 0.08),
        inset 0 -2px 0 rgba(0, 0, 0, 0.3),
        0 0 0 1px rgba(201, 169, 97, 0.2),
        0 4px 12px rgba(0, 0, 0, 0.2)
      `,
    },
  }

  if (animated) {
    return (
      <motion.div
        variants={luxuryFadeIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn('relative', className)}
        style={borderStyles[variant]}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={cn('relative', className)} style={borderStyles[variant]}>
      {children}
    </div>
  )
}
