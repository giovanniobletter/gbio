'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface ButtonProps {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  href?: string
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  href,
  onClick,
  className,
  disabled = false,
}: ButtonProps) {
  const baseStyles = `
    relative inline-flex items-center justify-center
    font-sans uppercase tracking-[0.2em] overflow-hidden
    transition-all duration-500 group
  `

  const variants = {
    primary: 'bg-transparent border border-gold text-gold hover:text-nero',
    secondary: 'bg-gold text-nero border border-gold hover:bg-gold-light',
    ghost: 'bg-transparent text-gold hover:text-gold-light',
  }

  const sizes = {
    sm: 'px-6 py-3 text-xs',
    md: 'px-8 py-4 text-sm',
    lg: 'px-10 py-5 text-sm',
  }

  const Component = href ? motion.a : motion.button

  return (
    <Component
      href={href}
      onClick={onClick}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {variant === 'primary' && (
        <span className="absolute inset-0 bg-gold transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]" />
      )}
      <span className="relative z-10">{children}</span>
    </Component>
  )
}
