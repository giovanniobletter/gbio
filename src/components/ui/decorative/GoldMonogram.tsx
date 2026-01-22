'use client'

import { motion } from 'framer-motion'
import { luxuryScaleIn } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface GoldMonogramProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  animated?: boolean
  variant?: 'simple' | 'ornate' | 'minimal'
}

export function GoldMonogram({
  size = 'md',
  className,
  animated = true,
  variant = 'ornate',
}: GoldMonogramProps) {
  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
    xl: 'w-48 h-48',
  }

  const MonogramSVG = () => (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
    >
      {variant === 'ornate' && (
        <>
          {/* Outer decorative ring */}
          <circle
            cx="50"
            cy="50"
            r="48"
            stroke="url(#goldGradient)"
            strokeWidth="0.5"
            fill="none"
          />
          {/* Inner decorative ring */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="url(#goldGradient)"
            strokeWidth="0.3"
            fill="none"
            strokeDasharray="4 4"
          />
          {/* Corner accents */}
          <path d="M50 2L54 10H46L50 2Z" fill="url(#goldGradient)" />
          <path d="M50 98L54 90H46L50 98Z" fill="url(#goldGradient)" />
          <path d="M2 50L10 54V46L2 50Z" fill="url(#goldGradient)" />
          <path d="M98 50L90 54V46L98 50Z" fill="url(#goldGradient)" />
        </>
      )}

      {variant === 'minimal' && (
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#goldGradient)"
          strokeWidth="1"
          fill="none"
        />
      )}

      {/* GB Letters */}
      <text
        x="50"
        y="58"
        textAnchor="middle"
        className="font-serif"
        fontSize="32"
        fill="url(#goldGradient)"
        fontWeight="400"
        letterSpacing="2"
      >
        GB
      </text>

      {/* Gradient definition */}
      <defs>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#b89a52" />
          <stop offset="25%" stopColor="#c9a961" />
          <stop offset="50%" stopColor="#f7e7ce" />
          <stop offset="75%" stopColor="#c9a961" />
          <stop offset="100%" stopColor="#b89a52" />
        </linearGradient>
      </defs>
    </svg>
  )

  if (animated) {
    return (
      <motion.div
        variants={luxuryScaleIn}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className={cn(sizeClasses[size], className)}
      >
        <MonogramSVG />
      </motion.div>
    )
  }

  return (
    <div className={cn(sizeClasses[size], className)}>
      <MonogramSVG />
    </div>
  )
}
