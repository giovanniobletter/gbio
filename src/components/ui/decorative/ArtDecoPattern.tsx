'use client'

import { motion } from 'framer-motion'

interface ArtDecoPatternProps {
  className?: string
  opacity?: number
}

export function ArtDecoPattern({ className = '', opacity = 0.15 }: ArtDecoPatternProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Main geometric pattern */}
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Art Deco fan pattern */}
          <pattern
            id="artDecoFan"
            x="0"
            y="0"
            width="120"
            height="120"
            patternUnits="userSpaceOnUse"
          >
            {/* Radiating lines */}
            <g stroke="var(--gold)" strokeWidth="0.5" fill="none" opacity={opacity}>
              {/* Central fan */}
              <path d="M60,120 L60,60" />
              <path d="M60,120 L30,60" />
              <path d="M60,120 L90,60" />
              <path d="M60,120 L15,75" />
              <path d="M60,120 L105,75" />
              <path d="M60,120 L0,90" />
              <path d="M60,120 L120,90" />

              {/* Arc lines */}
              <path d="M20,90 Q60,50 100,90" fill="none" />
              <path d="M30,100 Q60,70 90,100" fill="none" />
              <path d="M40,110 Q60,90 80,110" fill="none" />
            </g>
          </pattern>

          {/* Diamond grid pattern */}
          <pattern
            id="artDecoDiamond"
            x="0"
            y="0"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <g stroke="var(--gold)" strokeWidth="0.3" fill="none" opacity={opacity * 0.7}>
              <path d="M30,0 L60,30 L30,60 L0,30 Z" />
              <circle cx="30" cy="30" r="8" />
              <circle cx="30" cy="30" r="3" fill="var(--gold)" fillOpacity={opacity * 0.5} />
            </g>
          </pattern>

          {/* Chevron pattern */}
          <pattern
            id="artDecoChevron"
            x="0"
            y="0"
            width="40"
            height="20"
            patternUnits="userSpaceOnUse"
          >
            <g stroke="var(--gold)" strokeWidth="0.5" fill="none" opacity={opacity * 0.5}>
              <path d="M0,20 L20,10 L40,20" />
            </g>
          </pattern>

          {/* Radial gradient for center fade */}
          <radialGradient id="centerFade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="black" stopOpacity="1" />
            <stop offset="70%" stopColor="black" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Layer 1: Diamond grid - full coverage */}
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#artDecoDiamond)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 0.5 }}
        />

        {/* Layer 2: Fan pattern - corners */}
        <motion.g
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 2, delay: 1 }}
        >
          {/* Top left fan */}
          <rect x="0" y="0" width="40%" height="40%" fill="url(#artDecoFan)" />
          {/* Top right fan - mirrored */}
          <g transform="translate(100%, 0) scale(-1, 1)">
            <rect x="0" y="0" width="40%" height="40%" fill="url(#artDecoFan)" />
          </g>
          {/* Bottom left fan - mirrored */}
          <g transform="translate(0, 100%) scale(1, -1)">
            <rect x="0" y="0" width="40%" height="40%" fill="url(#artDecoFan)" />
          </g>
          {/* Bottom right fan - mirrored */}
          <g transform="translate(100%, 100%) scale(-1, -1)">
            <rect x="0" y="0" width="40%" height="40%" fill="url(#artDecoFan)" />
          </g>
        </motion.g>
      </svg>

      {/* Corner ornaments */}
      <motion.div
        className="absolute top-8 left-8 w-32 h-32"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.3 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <g stroke="var(--gold)" strokeWidth="1" fill="none" opacity={opacity * 2}>
            <path d="M0,0 L0,40 M0,0 L40,0" />
            <path d="M5,5 L5,30 M5,5 L30,5" />
            <circle cx="0" cy="0" r="3" fill="var(--gold)" />
            <path d="M0,0 L20,20" />
          </g>
        </svg>
      </motion.div>

      <motion.div
        className="absolute top-8 right-8 w-32 h-32"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.4 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full transform scale-x-[-1]">
          <g stroke="var(--gold)" strokeWidth="1" fill="none" opacity={opacity * 2}>
            <path d="M0,0 L0,40 M0,0 L40,0" />
            <path d="M5,5 L5,30 M5,5 L30,5" />
            <circle cx="0" cy="0" r="3" fill="var(--gold)" />
            <path d="M0,0 L20,20" />
          </g>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-8 left-8 w-32 h-32"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full transform scale-y-[-1]">
          <g stroke="var(--gold)" strokeWidth="1" fill="none" opacity={opacity * 2}>
            <path d="M0,0 L0,40 M0,0 L40,0" />
            <path d="M5,5 L5,30 M5,5 L30,5" />
            <circle cx="0" cy="0" r="3" fill="var(--gold)" />
            <path d="M0,0 L20,20" />
          </g>
        </svg>
      </motion.div>

      <motion.div
        className="absolute bottom-8 right-8 w-32 h-32"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.6 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full transform scale-[-1]">
          <g stroke="var(--gold)" strokeWidth="1" fill="none" opacity={opacity * 2}>
            <path d="M0,0 L0,40 M0,0 L40,0" />
            <path d="M5,5 L5,30 M5,5 L30,5" />
            <circle cx="0" cy="0" r="3" fill="var(--gold)" />
            <path d="M0,0 L20,20" />
          </g>
        </svg>
      </motion.div>

      {/* Center fade mask to keep logo area clean */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 50% 60% at 50% 45%, rgba(10,10,10,1) 0%, rgba(10,10,10,0) 100%)'
        }}
      />
    </div>
  )
}
