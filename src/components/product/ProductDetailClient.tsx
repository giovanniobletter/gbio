'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingBag, Check, Expand, MapPin, Award, Scale, CalendarDays } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale } from 'next-intl'
import { Product } from '@/types'
import { useCart } from '@/context/CartContext'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/cart/CartDrawer'
import { ProductGalleryModal } from '@/components/ui/ProductGalleryModal'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { QuantitySelector } from '@/components/product/QuantitySelector'
import { OrnateRule } from '@/components/ui/decorative/OrnateRule'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'
import { luxuryFadeUp, luxurySlideIn, luxurySlideInRight, luxuryStaggerContainer, luxuryStaggerItem } from '@/lib/animations'

interface ProductDetailClientProps {
  product: Product
  relatedProducts: Product[]
}

const categoryLabels: Record<Product['category'], string> = {
  olio: 'Olio',
  pasta: 'Pasta',
  farina: 'Farine',
  conserve: 'Conserve',
}

function formatPrice(price: number) {
  return new Intl.NumberFormat('it-IT', {
    style: 'currency',
    currency: 'EUR',
  }).format(price)
}

function RelatedProductCard({ product }: { product: Product }) {
  const locale = useLocale()
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <motion.article variants={luxuryStaggerItem} className="group relative">
      <Link href={`/${locale}/prodotti/${product.id}`}>
        <div className="relative bg-nero/60 backdrop-blur-sm border border-gold/20 group-hover:border-gold/40 transition-all duration-500 overflow-hidden">
          <div className="relative h-[240px] sm:h-[300px] overflow-hidden">
            <Image
              src={product.image}
              alt={product.name}
              fill
              className="object-contain object-center p-4 group-hover:scale-105 transition-transform duration-600"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
          <div className="p-4 space-y-2">
            <span className="font-sans text-[10px] uppercase tracking-[0.15em] text-gold/70">
              {product.subtitle}
            </span>
            <h3 className="font-serif text-lg text-bianco group-hover:text-gold transition-colors duration-300">
              {product.name}
            </h3>
            <div className="flex items-center justify-between pt-2">
              <span className="font-serif text-xl text-gold">
                {formatPrice(product.price)}
              </span>
              <span className="font-sans text-xs text-bianco/40">
                {product.details.weight}
              </span>
            </div>
          </div>
        </div>
      </Link>
      <button
        onClick={handleAddToCart}
        className="absolute bottom-4 right-4 p-2 border border-gold/30 text-gold hover:bg-gold hover:text-nero transition-all duration-300"
        aria-label="Aggiungi al carrello"
      >
        {isAdded ? <Check size={16} /> : <ShoppingBag size={16} />}
      </button>
    </motion.article>
  )
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const locale = useLocale()
  const { addItem } = useCart()
  const [quantity, setQuantity] = useState(1)
  const [isAdded, setIsAdded] = useState(false)
  const [isGalleryOpen, setIsGalleryOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [imageError, setImageError] = useState(false)

  const allImages = product.images?.length ? product.images : [product.image]

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem(product)
    }
    setIsAdded(true)
    setTimeout(() => {
      setIsAdded(false)
      setQuantity(1)
    }, 2000)
  }

  const breadcrumbItems = [
    { label: 'Prodotti', href: `/${locale}/#prodotti` },
    { label: categoryLabels[product.category], href: `/${locale}/#prodotti` },
    { label: product.name },
  ]

  const details = [
    { icon: MapPin, label: 'Origine', value: product.details.origin },
    { icon: Award, label: 'Certificazioni', value: product.details.certification.join(', ') },
    { icon: Scale, label: 'Peso', value: product.details.weight },
    ...(product.details.harvest ? [{ icon: CalendarDays, label: 'Raccolta', value: product.details.harvest }] : []),
  ]

  return (
    <>
      <Header />
      <CartDrawer />

      <main className="min-h-screen bg-nero pt-28 pb-20 relative">
        <TextureOverlay variant="paper" opacity={0.015} />

        <div className="container-custom relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Breadcrumb items={breadcrumbItems} className="mb-10" />
          </motion.div>

          {/* Product Detail Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Left: Images */}
            <motion.div
              variants={luxurySlideIn}
              initial="hidden"
              animate="visible"
              className="space-y-4"
            >
              {/* Main Image */}
              <div
                className="relative aspect-square bg-nero/60 border border-gold/20 overflow-hidden cursor-pointer group"
                onClick={() => {
                  setIsGalleryOpen(true)
                }}
              >
                {!imageError ? (
                  <Image
                    src={allImages[selectedImageIndex]}
                    alt={`${product.name} - ${product.subtitle}`}
                    fill
                    className="object-contain p-8 group-hover:scale-105 transition-transform duration-600"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    priority
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="font-serif text-2xl text-gold/30">{product.name}</span>
                  </div>
                )}

                {/* Zoom indicator */}
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="p-2 bg-nero/60 border border-gold/30">
                    <Expand size={16} className="text-gold" />
                  </div>
                </div>

                {/* Certification badges */}
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

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex gap-3">
                  {allImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 border-2 transition-all overflow-hidden ${
                        index === selectedImageIndex
                          ? 'border-gold'
                          : 'border-gold/20 hover:border-gold/50'
                      }`}
                    >
                      <Image
                        src={img}
                        alt={`${product.name} - ${index === 0 ? 'Fronte' : 'Retro'}`}
                        fill
                        className="object-contain p-1"
                        sizes="80px"
                      />
                      <span className="absolute bottom-0 left-0 right-0 bg-nero/80 text-[9px] text-center text-gold py-0.5">
                        {index === 0 ? 'Fronte' : 'Retro'}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Right: Product Info */}
            <motion.div
              variants={luxurySlideInRight}
              initial="hidden"
              animate="visible"
              className="flex flex-col"
            >
              {/* Category + Subtitle */}
              <span className="font-sans text-xs uppercase tracking-[0.2em] text-gold/70">
                {product.subtitle}
              </span>

              {/* Name */}
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-bianco mt-3">
                {product.name}
              </h1>

              {/* Price */}
              <div className="mt-6 flex items-baseline gap-4">
                <span className="font-serif text-3xl md:text-4xl text-gold">
                  {formatPrice(product.price)}
                </span>
                <span className="font-sans text-sm text-bianco/40">
                  {product.details.weight}
                </span>
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

              {/* Description */}
              <p className="font-sans text-base text-bianco/70 leading-relaxed">
                {product.description}
              </p>

              {/* Product Details */}
              <div className="mt-8 space-y-4">
                {details.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-start gap-3">
                    <Icon size={18} className="text-gold/60 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-sans text-xs uppercase tracking-wider text-bianco/40">{label}</span>
                      <p className="font-sans text-sm text-bianco/80 mt-0.5">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Divider */}
              <div className="my-8 h-px bg-gradient-to-r from-gold/30 via-gold/10 to-transparent" />

              {/* Quantity + Add to Cart */}
              <div className="flex items-center gap-4">
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                />
                <motion.button
                  onClick={handleAddToCart}
                  className="flex-1 py-4 px-6 border border-gold text-gold font-sans text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-gold hover:text-nero transition-all duration-300"
                  whileTap={{ scale: 0.98 }}
                >
                  <AnimatePresence mode="wait">
                    {isAdded ? (
                      <motion.span
                        key="added"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <Check size={18} />
                        Aggiunto
                      </motion.span>
                    ) : (
                      <motion.span
                        key="add"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-center gap-2"
                      >
                        <ShoppingBag size={18} />
                        Aggiungi al carrello
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <motion.section
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="mt-24"
            >
              <OrnateRule variant="diamond" className="mb-12" />

              <div className="text-center mb-12">
                <span className="font-sans text-xs uppercase tracking-[0.3em] text-gold/60">
                  Collezione
                </span>
                <h2 className="font-serif text-3xl md:text-4xl text-bianco mt-3">
                  Potrebbe interessarti
                </h2>
              </div>

              <motion.div
                variants={luxuryStaggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
              >
                {relatedProducts.map((p) => (
                  <RelatedProductCard key={p.id} product={p} />
                ))}
              </motion.div>

              {/* Back to all products */}
              <div className="mt-12 text-center">
                <Link
                  href={`/${locale}/#prodotti`}
                  className="inline-flex items-center gap-2 font-sans text-sm uppercase tracking-[0.2em] text-gold hover:text-gold-light transition-colors"
                >
                  Tutti i Prodotti
                </Link>
              </div>
            </motion.section>
          )}
        </div>
      </main>

      <Footer />

      {/* Gallery Modal */}
      <ProductGalleryModal
        product={product}
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        initialIndex={selectedImageIndex}
      />
    </>
  )
}
