'use client'

import { useLocale } from 'next-intl'
import { Product } from '@/types'
import { productsEn } from '@/data/products.en'

/**
 * Returns the product with name/subtitle/description localized to the
 * current locale. Italian values stay as-is on /it. On /en we merge in
 * the English overrides from products.en.ts (if defined).
 */
export function useProductT(product: Product): Product {
  const locale = useLocale()
  if (locale === 'en') {
    const overrides = productsEn[product.id]
    if (overrides) {
      return { ...product, ...overrides }
    }
  }
  return product
}
