'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingBag, Check, Droplets, Wheat, Salad, Expand } from 'lucide-react'
import Image from 'next/image'
import { products, getProductsByCategory } from '@/data/products'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { ProductGalleryModal } from '@/components/ui/ProductGalleryModal'
import { luxuryStaggerContainer, luxuryStaggerItem } from '@/lib/animations'
import { OrnateRule } from '@/components/ui/decorative/OrnateRule'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { useTranslations } from 'next-intl'

type Category = 'all' | 'olio' | 'pasta' | 'farina' | 'conserve'

const categoryIds: Category[] = ['all', 'olio', 'pasta', 'farina', 'conserve']

const categoryIcons = {
  olio: Droplets,
  pasta: Wheat,
  farina: Wheat,
  conserve: Salad,
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const t = useTranslations('products')

  const CategoryIcon = categoryIcons[product.category] || Droplets

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
      variants={luxuryStaggerItem}
      layout
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-6 product-image-clean">
        {/* Product Image or Fallback */}
        <motion.div
          className="absolute inset-0 cursor-pointer"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.6 }}
          onClick={() => setIsGalleryOpen(true)}
        >
          {!imageError ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              className={`object-contain ${product.id.includes('3l') || product.id.includes('5l') ? 'scale-125 -translate-y-4' : product.id === 'olio-dop-50cl' ? 'scale-125' : ''}`}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-forest/30 to-nero">
              <div className="text-center">
                <CategoryIcon size={64} className="text-gold/20 mx-auto mb-4" strokeWidth={1} />
                <span className="font-serif text-lg text-gold/30">{product.details.weight}</span>
              </div>
            </div>
          )}
        </motion.div>

        {/* Overlay */}
        <div className="absolute inset-0 bg-nero/0 group-hover:bg-nero/40 transition-colors duration-500 pointer-events-none" />

        {/* Zoom indicator */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsGalleryOpen(true)
          }}
          className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
        >
          <div className="p-2 bg-nero/60 border border-gold/30 hover:bg-gold/20 transition-colors">
            <Expand size={16} className="text-gold" />
          </div>
        </button>

        {/* Add to Cart Button */}
        <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <motion.button
            onClick={(e) => {
              e.stopPropagation()
              handleAddToCart()
            }}
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
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 pointer-events-none">
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
        <h3 className="font-serif text-xl text-bianco group-hover:text-gold transition-colors duration-300">
          {product.name}
        </h3>

        <div className="flex items-center justify-between pt-2">
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

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />

      {/* Product Gallery Modal */}
      <ProductGalleryModal
        product={product}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
      />
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

  // Get video source based on category
  const getVideoSrc = () => {
    if (activeCategory === 'olio') return '/videos/olio.mp4'
    if (activeCategory === 'pasta') return '/videos/grano.mp4'
    if (activeCategory === 'farina') return '/videos/farina.mp4'
    if (activeCategory === 'conserve') return '/videos/conserve.mp4'
    return null
  }

  const videoSrc = getVideoSrc()

  return (
    <section id="prodotti" className="section-padding bg-nero relative overflow-hidden">
      {/* Subtle texture overlay */}
      <TextureOverlay variant="paper" opacity={0.015} />

      {/* Video Background */}
      <AnimatePresence>
        {videoSrc && (
          <motion.div
            key={videoSrc}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 z-0"
          >
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover blur-[0.5px] scale-105"
            >
              <source src={videoSrc} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-nero/20" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-custom relative z-10">
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
              className="mt-12 text-center max-w-3xl mx-auto"
            >
              <div className="border border-gold/20 p-8 bg-nero/50 backdrop-blur-sm">
                <h3 className="font-serif text-2xl md:text-3xl text-gold mb-4">
                  {t(`categories.${activeCategory}.title`)}
                </h3>
                <p className="font-sans text-bianco/70 leading-relaxed">
                  {t(`categories.${activeCategory}.description`)}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ornate divider */}
        <div className="mt-12">
          <OrnateRule variant="diamond" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            variants={luxuryStaggerContainer}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="mt-12 grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

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
