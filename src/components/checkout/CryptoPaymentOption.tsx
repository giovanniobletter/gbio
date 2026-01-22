'use client'

import { motion } from 'framer-motion'
import { Bitcoin, Coins } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CryptoPaymentOptionProps {
  isSelected: boolean
  onSelect: () => void
  disabled?: boolean
}

export function CryptoPaymentOption({
  isSelected,
  onSelect,
  disabled = false,
}: CryptoPaymentOptionProps) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.01 }}
      whileTap={{ scale: disabled ? 1 : 0.99 }}
      className={cn(
        'w-full p-4 border text-left transition-all duration-300 flex items-start gap-4',
        isSelected
          ? 'border-gold bg-gold/10'
          : 'border-gold/30 hover:border-gold/50',
        disabled && 'opacity-50 cursor-not-allowed'
      )}
    >
      <div
        className={cn(
          'w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors flex-shrink-0',
          isSelected ? 'border-gold' : 'border-gold/40'
        )}
      >
        {isSelected && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="w-2.5 h-2.5 rounded-full bg-gold"
          />
        )}
      </div>

      <div className="flex-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Bitcoin size={20} className="text-gold" />
            <span className="font-sans text-bianco font-medium">
              Criptovalute
            </span>
          </div>
        </div>
        <p className="font-sans text-xs text-bianco/50 mt-1">
          BTC, SOL, DOGE, USDT, USDC
        </p>
      </div>

      {/* Crypto icons */}
      <div className="flex -space-x-1">
        {['#F7931A', '#9945FF', '#C2A633', '#26A17B', '#2775CA'].map(
          (color, i) => (
            <div
              key={i}
              className="w-6 h-6 rounded-full border border-nero flex items-center justify-center"
              style={{ backgroundColor: color }}
            >
              <Coins size={12} className="text-white" />
            </div>
          )
        )}
      </div>
    </motion.button>
  )
}
