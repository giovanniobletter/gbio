'use client'

import { Minus, Plus } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@/lib/utils'

interface QuantitySelectorProps {
  quantity: number
  onQuantityChange: (quantity: number) => void
  min?: number
  max?: number
  className?: string
}

export function QuantitySelector({
  quantity,
  onQuantityChange,
  min = 1,
  max = 99,
  className,
}: QuantitySelectorProps) {
  const t = useTranslations('cart')
  return (
    <div className={cn('flex items-center border border-gold/30', className)}>
      <button
        onClick={() => onQuantityChange(Math.max(min, quantity - 1))}
        disabled={quantity <= min}
        className="p-3 text-gold hover:bg-gold/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label={t('decreaseQuantity')}
      >
        <Minus size={16} />
      </button>
      <span className="w-12 text-center font-sans text-sm text-bianco tabular-nums">
        {quantity}
      </span>
      <button
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="p-3 text-gold hover:bg-gold/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label={t('increaseQuantity')}
      >
        <Plus size={16} />
      </button>
    </div>
  )
}
