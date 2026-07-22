'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Plus, Check } from 'lucide-react'
import { useLocale, useTranslations } from 'next-intl'
import { products } from '@/data/products'
import { productsEn } from '@/data/products.en'
import { useCart } from '@/context/CartContext'
import { Product } from '@/types'

function formatPrice(price: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

// Suggerisce i prodotti che avvicinano alla soglia di spedizione gratuita:
// prima il più economico che la sblocca da solo, poi i più vicini al divario.
// Esclude ciò che è già nel carrello.
function suggestForGap(gap: number, excludeIds: Set<string>): Product[] {
  const candidates = products.filter((p) => !excludeIds.has(p.id))
  const closing = candidates
    .filter((p) => p.price >= gap)
    .sort((a, b) => a.price - b.price)
  const below = candidates
    .filter((p) => p.price < gap)
    .sort((a, b) => b.price - a.price)
  return [...closing.slice(0, 1), ...below, ...closing.slice(1)].slice(0, 3)
}

export function CartUpsell() {
  const t = useTranslations('cartDrawer')
  const locale = useLocale()
  const { items, subtotal, freeShippingThreshold, addItem } = useCart()

  if (freeShippingThreshold === null || items.length === 0) return null

  const gap = freeShippingThreshold - subtotal
  const progress = Math.min(100, (subtotal / freeShippingThreshold) * 100)
  const inCart = new Set(items.map((i) => i.product.id))
  const suggestions = gap > 0 ? suggestForGap(gap, inCart) : []

  const displayName = (p: Product) =>
    locale === 'en' ? (productsEn[p.id]?.name ?? p.name) : p.name

  return (
    <div className="mb-4">
      {gap > 0 ? (
        <p className="font-sans text-xs text-gold mb-2">
          {t('addForFreeShipping', { amount: formatPrice(gap) })}
        </p>
      ) : (
        <p className="font-sans text-xs text-forest mb-2 flex items-center gap-1.5">
          <Check size={13} /> {t('freeShippingUnlocked')}
        </p>
      )}

      {/* Avanzamento verso la soglia */}
      <div className="h-1 bg-gold/10 overflow-hidden mb-4">
        <motion.div
          className="h-full bg-gold"
          initial={false}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
        />
      </div>

      {suggestions.length > 0 && (
        <>
          <p className="font-sans text-[10px] uppercase tracking-[0.2em] text-bianco/40 mb-2">
            {t('upsellTitle')}
          </p>
          <div className="grid grid-cols-3 gap-2">
            {suggestions.map((p) => (
              <button
                key={p.id}
                onClick={() => addItem(p)}
                className="group border border-gold/15 hover:border-gold/50 transition-colors p-2 text-left"
                aria-label={`${t('upsellAdd')} ${displayName(p)}`}
              >
                <div className="relative w-full aspect-square mb-1.5 overflow-hidden">
                  <Image
                    src={p.image}
                    alt={displayName(p)}
                    fill
                    className="object-contain"
                    sizes="120px"
                  />
                </div>
                <p className="font-sans text-[10px] text-bianco/80 truncate mb-1">
                  {displayName(p)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-serif text-xs text-gold">
                    {formatPrice(p.price)}
                  </span>
                  <span className="w-5 h-5 border border-gold/40 flex items-center justify-center text-gold group-hover:bg-gold group-hover:text-nero transition-all">
                    <Plus size={11} />
                  </span>
                </div>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
