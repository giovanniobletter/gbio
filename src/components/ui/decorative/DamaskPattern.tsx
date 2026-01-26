'use client'

import { motion } from 'framer-motion'

interface DamaskPatternProps {
  className?: string
  opacity?: number
}

export function DamaskPattern({ className = '', opacity = 0.06 }: DamaskPatternProps) {
  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      <svg
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {/* Classic Damask/Baroque pattern - single motif */}
          <pattern
            id="damaskMotif"
            x="0"
            y="0"
            width="200"
            height="280"
            patternUnits="userSpaceOnUse"
          >
            <g fill="var(--gold)" opacity={opacity}>
              {/* Central ornate medallion */}
              <g transform="translate(100, 140)">
                {/* Main vertical flourish */}
                <path d="M0,-120
                  C8,-110 12,-100 10,-85
                  C8,-70 15,-60 25,-55
                  C35,-50 40,-40 35,-30
                  C30,-20 35,-10 45,0
                  C35,10 30,20 35,30
                  C40,40 35,50 25,55
                  C15,60 8,70 10,85
                  C12,100 8,110 0,120
                  C-8,110 -12,100 -10,85
                  C-8,70 -15,60 -25,55
                  C-35,50 -40,40 -35,30
                  C-30,20 -35,10 -45,0
                  C-35,-10 -30,-20 -35,-30
                  C-40,-40 -35,-50 -25,-55
                  C-15,-60 -8,-70 -10,-85
                  C-12,-100 -8,-110 0,-120Z"
                />

                {/* Inner decorative element */}
                <ellipse cx="0" cy="0" rx="18" ry="35" fill="var(--nero)" />
                <ellipse cx="0" cy="0" rx="12" ry="25" fill="var(--gold)" opacity="0.5" />

                {/* Top flourish */}
                <path d="M0,-60 C-15,-50 -20,-40 -15,-30 C-10,-35 -5,-38 0,-35 C5,-38 10,-35 15,-30 C20,-40 15,-50 0,-60Z" />

                {/* Bottom flourish */}
                <path d="M0,60 C-15,50 -20,40 -15,30 C-10,35 -5,38 0,35 C5,38 10,35 15,30 C20,40 15,50 0,60Z" />

                {/* Side curls - left */}
                <path d="M-45,0 C-55,-15 -50,-30 -35,-35 C-40,-25 -38,-15 -45,0Z" />
                <path d="M-45,0 C-55,15 -50,30 -35,35 C-40,25 -38,15 -45,0Z" />

                {/* Side curls - right */}
                <path d="M45,0 C55,-15 50,-30 35,-35 C40,-25 38,-15 45,0Z" />
                <path d="M45,0 C55,15 50,30 35,35 C40,25 38,15 45,0Z" />
              </g>
            </g>
          </pattern>

          {/* Subtle vignette for depth */}
          <radialGradient id="vignette" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="100%" stopColor="black" stopOpacity="0.4" />
          </radialGradient>
        </defs>

        {/* Pattern layer */}
        <motion.rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#damaskMotif)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 3 }}
        />

        {/* Vignette overlay */}
        <rect
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#vignette)"
        />
      </svg>

      {/* Center fade to keep logo area clean */}
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0) 100%)'
        }}
      />
    </div>
  )
}
