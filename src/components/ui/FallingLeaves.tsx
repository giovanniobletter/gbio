'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Leaf {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  rotation: number
  type: 'olive' | 'wheat'
}

export function FallingLeaves({ count = 15 }: { count?: number }) {
  const [leaves, setLeaves] = useState<Leaf[]>([])

  useEffect(() => {
    const newLeaves: Leaf[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 8 + Math.random() * 8,
      size: 12 + Math.random() * 10,
      rotation: Math.random() * 360,
      type: Math.random() > 0.5 ? 'olive' : 'wheat',
    }))
    setLeaves(newLeaves)
  }, [count])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute"
          style={{
            left: `${leaf.x}%`,
            top: -30,
          }}
          animate={{
            y: ['0vh', '110vh'],
            x: [0, Math.sin(leaf.id) * 100],
            rotate: [leaf.rotation, leaf.rotation + 360],
          }}
          transition={{
            duration: leaf.duration,
            delay: leaf.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {leaf.type === 'olive' ? (
            // Olive leaf SVG
            <svg
              width={leaf.size}
              height={leaf.size * 2}
              viewBox="0 0 20 40"
              fill="none"
              style={{ opacity: 0.3 }}
            >
              <path
                d="M10 0 C5 10, 2 20, 10 40 C18 20, 15 10, 10 0"
                fill="#c9a961"
              />
              <path
                d="M10 5 L10 35"
                stroke="#a08540"
                strokeWidth="0.5"
              />
            </svg>
          ) : (
            // Wheat grain SVG
            <svg
              width={leaf.size}
              height={leaf.size * 1.5}
              viewBox="0 0 20 30"
              fill="none"
              style={{ opacity: 0.25 }}
            >
              <ellipse
                cx="10"
                cy="15"
                rx="5"
                ry="12"
                fill="#c9a961"
              />
              <line
                x1="10"
                y1="27"
                x2="10"
                y2="30"
                stroke="#a08540"
                strokeWidth="1"
              />
            </svg>
          )}
        </motion.div>
      ))}
    </div>
  )
}
