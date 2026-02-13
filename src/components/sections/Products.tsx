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
      {/* Card unificata con altezza responsive */}
      <div className="relative h-[420px] sm:h-[580px] lg:h-[780px] bg-nero/60 backdrop-blur-sm border border-gold/20 group-hover:border-gold/40 transition-all duration-500 overflow-hidden flex flex-col">

        {/* Zona immagine - altezza responsive */}
        <div className="relative h-[240px] sm:h-[360px] lg:h-[520px] flex-shrink-0 overflow-hidden">
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
                className="object-contain object-center p-4"
                style={product.imagePosition ? {
                  transform: product.imagePosition,
                  transformOrigin: 'center center'
                } : undefined}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <CategoryIcon size={64} className="text-gold/20 mx-auto mb-4" strokeWidth={1} />
                  <span className="font-serif text-lg text-gold/30">{product.details.weight}</span>
                </div>
              </div>
            )}
          </motion.div>

          {/* Overlay hover */}
          <div className="absolute inset-0 bg-nero/0 group-hover:bg-nero/30 transition-colors duration-500 pointer-events-none" />

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

          {/* Certification Badges */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 pointer-events-none">
            {product.details.certification.map((cert) => (
              <span
                key={cert}
                className="px-2 py-1 text-[10px] font-sans uppercase tracking-wider bg-nero/80 text-gold border border-gold/30"
              >
                {cert.includes('DOP') ? 'DOP' : cert.includes('conversione') ? 'Conv. Bio' : 'Bio'}
              </span>
            ))}
          </div>
        </div>

        {/* Linea divisoria dorata */}
        <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

        {/* Zona testo - flex grow per occupare lo spazio rimanente */}
        <div className="flex-1 p-3 sm:p-5 flex flex-col justify-between">
          <div className="space-y-1 sm:space-y-2">
            <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.2em] text-gold/70">
              {product.subtitle}
            </span>
            <h3 className="font-serif text-sm sm:text-lg lg:text-xl text-bianco group-hover:text-gold transition-colors duration-300">
              {product.name}
            </h3>
            <p className="font-sans text-xs sm:text-sm text-bianco/60 leading-relaxed line-clamp-2 hidden sm:block">
              {product.description}
            </p>
          </div>

          <div className="space-y-2 sm:space-y-4 mt-2 sm:mt-4">
            <div className="flex items-center justify-between">
              <span className="font-serif text-base sm:text-xl lg:text-2xl text-gold">
                {formatPrice(product.price)}
              </span>
              <span className="font-sans text-[10px] sm:text-xs text-bianco/40">
                {product.details.weight}
              </span>
            </div>

            {/* Add to Cart Button */}
            <motion.button
              onClick={handleAddToCart}
              className="w-full py-2 sm:py-3 px-2 border border-gold text-gold font-sans text-[10px] sm:text-xs uppercase tracking-normal sm:tracking-wider flex items-center justify-center gap-1 sm:gap-2 hover:bg-gold hover:text-nero transition-all duration-300 overflow-visible"
              whileTap={{ scale: 0.98 }}
            >
              <AnimatePresence mode="wait">
                {isAdded ? (
                  <motion.span
                    key="added"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <Check size={14} className="flex-shrink-0" />
                    <span>{t('added')}</span>
                  </motion.span>
                ) : (
                  <motion.span
                    key="add"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex items-center justify-center gap-1 whitespace-nowrap"
                  >
                    <ShoppingBag size={14} className="flex-shrink-0" />
                    <span>{t('addToCart')}</span>
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Angoli decorativi */}
        <div className="absolute top-0 left-0 w-6 h-6 border-l-2 border-t-2 border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />
        <div className="absolute top-0 right-0 w-6 h-6 border-r-2 border-t-2 border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />
        <div className="absolute bottom-0 left-0 w-6 h-6 border-l-2 border-b-2 border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />
        <div className="absolute bottom-0 right-0 w-6 h-6 border-r-2 border-b-2 border-gold/0 group-hover:border-gold/50 transition-colors duration-500" />
      </div>

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

      {/* Gradient overlay for text readability */}
      <AnimatePresence>
        {videoSrc && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-[1] pointer-events-none"
          >
            <div className="absolute inset-x-0 top-0 h-[500px] bg-gradient-to-b from-nero via-nero/80 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-t from-nero to-transparent" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="container-custom relative z-10">
        <SectionTitle
          eyebrow={t('eyebrow')}
          title={t('title')}
          subtitle={t('subtitle')}
        />

        {/* Trust Badge */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 flex flex-wrap justify-center items-center gap-4 sm:gap-6 text-bianco/50"
        >
          <span className="flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-wider">
            <span className="text-forest">✓</span> Biologico ICEA
          </span>
          <span className="flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-wider">
            <span className="text-gold">✓</span> DOP Aprutino Pescarese
          </span>
          <span className="flex items-center gap-2 text-[10px] sm:text-xs font-sans uppercase tracking-wider">
            <span className="text-bianco/60">✓</span> Spedizione in Italia
          </span>
        </motion.div>

        {/* Category Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 w-full overflow-x-auto scrollbar-hide"
        >
          <div className="flex items-center justify-center gap-4 sm:gap-8 border-b border-gold/20 px-4 min-w-max mx-auto">
            {categoryIds.map((catId) => (
              <button
                key={catId}
                onClick={() => setActiveCategory(catId)}
                className={`relative py-4 font-sans text-[10px] sm:text-xs uppercase tracking-[0.15em] sm:tracking-[0.3em] transition-colors duration-300 whitespace-nowrap ${
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
              <div className="border border-gold/20 p-8 bg-nero/70 backdrop-blur-sm">
                <h3 className="font-serif text-2xl md:text-3xl text-gold mb-4">
                  {t(`categories.${activeCategory}.title`)}
                </h3>
                <p className="font-sans text-bianco/70 leading-relaxed">
                  {t.rich(`categories.${activeCategory}.description`, {
                    em: (chunks) => <em>{chunks}</em>
                  })}
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
            className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8"
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
