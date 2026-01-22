'use client'

import { motion } from 'framer-motion'
import { cornerReveal } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface ArtDecoCornerProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
  size?: 'sm' | 'md' | 'lg'
  className?: string
  animated?: boolean
}

export function ArtDecoCorner({
  position,
  size = 'md',
  className,
  animated = true,
}: ArtDecoCornerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  }

  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0 rotate-90',
    'bottom-left': 'bottom-0 left-0 -rotate-90',
    'bottom-right': 'bottom-0 right-0 rotate-180',
  }

  const CornerSVG = () => (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {/* Main corner lines */}
      <path
        d="M0 48V0H48"
        stroke="currentColor"
        strokeWidth="1"
        fill="none"
        className="text-gold/40"
      />
      {/* Inner decorative line */}
      <path
        d="M8 48V8H48"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
        className="text-gold/20"
      />
      {/* Art Deco diamond */}
      <path
        d="M12 12L16 8L20 12L16 16L12 12Z"
        fill="currentColor"
        className="text-gold/30"
      />
      {/* Small accent lines */}
      <line
        x1="0"
        y1="24"
        x2="6"
        y2="24"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-gold/30"
      />
      <line
        x1="24"
        y1="0"
        x2="24"
        y2="6"
        stroke="currentColor"
        strokeWidth="0.5"
        className="text-gold/30"
      />
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        variants={cornerReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn(
          'absolute pointer-events-none',
          sizeClasses[size],
          positionClasses[position],
          className
        )}
      >
        <CornerSVG />
      </motion.div>
    )
  }

  return (
    <div
      className={cn(
        'absolute pointer-events-none',
        sizeClasses[size],
        positionClasses[position],
        className
      )}
    >
      <CornerSVG />
    </div>
  )
}
