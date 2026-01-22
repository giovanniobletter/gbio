'use client'

import { motion } from 'framer-motion'
import { letterAnimation } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface AnimatedTextProps {
  text: string
  className?: string
  delay?: number
}

export function AnimatedText({ text, className, delay = 0 }: AnimatedTextProps) {
  const letters = text.split('')

  return (
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      className={cn('inline-block', className)}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={i}
          custom={i + delay * 10}
          variants={letterAnimation}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter}
        </motion.span>
      ))}
    </motion.span>
  )
}
