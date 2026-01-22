'use client'

import { motion } from 'framer-motion'
import { lineDrawFromCenter } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface OrnateRuleProps {
  variant?: 'simple' | 'diamond' | 'fleur'
  className?: string
  animated?: boolean
}

export function OrnateRule({
  variant = 'diamond',
  className,
  animated = true,
}: OrnateRuleProps) {
  const CenterElement = () => {
    switch (variant) {
      case 'diamond':
        return (
          <svg viewBox="0 0 24 24" className="w-6 h-6 text-gold/60">
            <path
              d="M12 2L22 12L12 22L2 12L12 2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
            <path
              d="M12 6L18 12L12 18L6 12L12 6Z"
              fill="currentColor"
              fillOpacity="0.3"
            />
          </svg>
        )
      case 'fleur':
        return (
          <svg viewBox="0 0 32 32" className="w-8 h-8 text-gold/60">
            <path
              d="M16 4C16 4 12 8 12 12C12 14 14 16 16 16C18 16 20 14 20 12C20 8 16 4 16 4Z"
              fill="currentColor"
              fillOpacity="0.3"
            />
            <path
              d="M16 28C16 28 20 24 20 20C20 18 18 16 16 16C14 16 12 18 12 20C12 24 16 28 16 28Z"
              fill="currentColor"
              fillOpacity="0.3"
            />
            <circle cx="16" cy="16" r="2" fill="currentColor" />
          </svg>
        )
      default:
        return <span className="w-2 h-2 bg-gold/40 rotate-45" />
    }
  }

  const content = (
    <div className={cn('flex items-center justify-center w-full', className)}>
      <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gold/30 to-gold/30" />
      <div className="mx-4">
        <CenterElement />
      </div>
      <div className="flex-1 h-px bg-gradient-to-l from-transparent via-gold/30 to-gold/30" />
    </div>
  )

  if (animated) {
    return (
      <motion.div
        variants={lineDrawFromCenter}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="overflow-hidden"
      >
        {content}
      </motion.div>
    )
  }

  return content
}
