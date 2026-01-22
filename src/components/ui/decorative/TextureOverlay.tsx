'use client'

import { cn } from '@/lib/utils'

interface TextureOverlayProps {
  variant?: 'linen' | 'paper' | 'noise'
  opacity?: number
  className?: string
}

export function TextureOverlay({
  variant = 'paper',
  opacity = 0.03,
  className,
}: TextureOverlayProps) {
  const textureClasses = {
    linen: 'texture-linen',
    paper: 'texture-paper',
    noise: '',
  }

  if (variant === 'noise') {
    return (
      <div
        className={cn(
          'absolute inset-0 pointer-events-none z-10',
          className
        )}
        style={{
          opacity,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.7' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    )
  }

  return (
    <div
      className={cn(
        'absolute inset-0 pointer-events-none z-10',
        textureClasses[variant],
        className
      )}
      style={{ opacity }}
    />
  )
}
