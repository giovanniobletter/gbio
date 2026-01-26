'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
  opacity: number
}

interface GoldenParticlesProps {
  count?: number
  className?: string
}

export function GoldenParticles({ count = 30, className }: GoldenParticlesProps) {
  const [particles, setParticles] = useState<Particle[]>([])

  useEffect(() => {
    const newParticles: Particle[] = []
    for (let i = 0; i < count; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 10 + 15,
        delay: Math.random() * 5,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }
    setParticles(newParticles)
  }, [count])

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            left: `${particle.x}%`,
            width: particle.size,
            height: particle.size,
            background: `radial-gradient(circle, rgba(201, 169, 97, ${particle.opacity}) 0%, rgba(201, 169, 97, 0) 70%)`,
            boxShadow: `0 0 ${particle.size * 2}px rgba(201, 169, 97, ${particle.opacity * 0.5})`,
          }}
          initial={{ y: '100vh', opacity: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, particle.opacity, particle.opacity, 0],
          }}
          transition={{
            duration: particle.duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      {/* Larger accent particles */}
      {particles.slice(0, 8).map((particle) => (
        <motion.div
          key={`accent-${particle.id}`}
          className="absolute"
          style={{
            left: `${(particle.x + 20) % 100}%`,
            width: particle.size * 2,
            height: particle.size * 2,
          }}
          initial={{ y: '100vh', opacity: 0, rotate: 0 }}
          animate={{
            y: '-10vh',
            opacity: [0, particle.opacity * 0.8, particle.opacity * 0.8, 0],
            rotate: 360,
          }}
          transition={{
            duration: particle.duration * 1.2,
            delay: particle.delay + 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          <svg viewBox="0 0 20 20" className="w-full h-full">
            <polygon
              points="10,0 12,8 20,10 12,12 10,20 8,12 0,10 8,8"
              fill={`rgba(201, 169, 97, ${particle.opacity * 0.6})`}
            />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
