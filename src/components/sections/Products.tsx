'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingBag, Check } from 'lucide-react'
import { products, getProductsByCategory } from '@/data/products'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useTranslations } from 'next-intl'

type Category = 'all' | 'olio' | 'pasta' | 'farina' | 'conserve'

const categoryIds: Category[] = ['all', 'olio', 'pasta', 'farina', 'conserve']

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const t = useTranslations('products')

  const handleAddToCart = () => {
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <motion.article
      variants={staggerItem}
      layout
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-forest/20 mb-6">
        {/* Product Image Placeholder */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
        >
          <span className="font-serif text-8xl text-gold/10">
            {index + 1}
          </span>
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-nero/0 group-hover:bg-nero/40 transition-colors duration-500" />

        {/* Add to Cart Button */}
        <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <motion.button
            onClick={handleAddToCart}
            className="w-full py-3 bg-gold text-nero font-sans text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gold-light transition-colors"
            whileTap={{ scale: 0.95 }}
          >
            <AnimatePresence mode="wait">
              {isAdded ? (
                <motion.span
                  key="added"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <Check size={16} />
                  {t('added')}
                </motion.span>
              ) : (
                <motion.span
                  key="add"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag size={16} />
                  {t('addToCart')}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* Certification Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {product.details.certification.map((cert) => (
            <span
              key={cert}
              className="px-2 py-1 text-[10px] font-sans uppercase tracking-wider bg-nero/80 text-gold border border-gold/30"
            >
              {cert.includes('DOP') ? 'DOP' : 'Bio'}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold">
          {product.subtitle}
        </span>
        <h3 className="font-serif text-2xl text-bianco group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>
        <p className="font-sans text-sm text-bianco/60 leading-relaxed line-clamp-2">
          {product.description}
        </p>

        <div className="flex items-center justify-between pt-4">
          <span className="font-serif text-2xl text-gold">
            {formatPrice(product.price)}
          </span>
          <span className="font-sans text-xs text-bianco/40">
            {product.details.weight}
          </span>
        </div>

        {/* Mobile Add to Cart */}
        <button
          onClick={handleAddToCart}
          className="lg:hidden w-full mt-4 py-3 border border-gold text-gold font-sans text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gold hover:text-nero transition-all"
        >
          <AnimatePresence mode="wait">
            {isAdded ? (
              <motion.span
                key="added-mobile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <Check size={16} />
                {t('added')}
              </motion.span>
            ) : (
              <motion.span
                key="add-mobile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center gap-2"
              >
                <ShoppingBag size={16} />
                {t('add')}
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* Decorative corner */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />
    </motion.article>
  )
}

export function Products() {
  const { openCart, itemCount } = useCart()
  const [activeCategory, setActiveCategory] = useState<Category>('all')
  const t = useTranslations('products')

  const filteredProducts = activeCategory === 'all'
    ? products
    : getProductsByCategory(activeCategory as Product['category'])

  return (
    <section id="prodotti" className="section-padding bg-nero">
      <div className="container-custom">
        <SectionTitle
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 flex justify-center"
        >
          <div className="flex items-center gap-8 border-b border-gold/20">
            {categoryIds.map((catId) => (
              <button
                key={catId}
                onClick={() => setActiveCategory(catId)}
                className={`relative py-4 font-sans text-xs uppercase tracking-[0.3em] transition-colors duration-300 ${
                  activeCategory === catId
                    ? 'text-gold'
                    : 'text-bianco/50 hover:text-bianco/80'
                }`}
              >
                {t(`categories.${catId}.label`)}
                {activeCategory === catId && (
                  <motion.div
                    layoutId="activeCategory"
                    className="absolute bottom-0 left-0 right-0 h-px bg-gold"
                    transition={{ duration: 0.3 }}
                  />
                )}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Category Description */}
        <AnimatePresence mode="wait">
          {activeCategory !== 'all' && (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mt-12 text-center max-w-2xl mx-auto"
            >
              <h3 className="font-serif text-2xl text-gold mb-3">
                {t(`categories.${activeCategory}.title`)}
              </h3>
              <p className="font-sans text-sm text-bianco/60 leading-relaxed">
                {t(`categories.${activeCategory}.description`)}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.div
          layout
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </AnimatePresence>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <a
            href="#contatti"
            className="inline-flex items-center gap-3 font-sans text-sm uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors group"
          >
            <span>{t('requestCatalog')}</span>
            <ArrowRight
              size={16}
              className="group-hover:translate-x-2 transition-transform"
            />
          </a>

          {itemCount > 0 && (
            <button
              onClick={openCart}
              className="btn-primary"
            >
              <span className="flex items-center gap-2">
                <ShoppingBag size={16} />
                {t('goToCart')} ({itemCount})
              </span>
            </button>
          )}
        </motion.div>
      </div>
    </section>
  )
}
