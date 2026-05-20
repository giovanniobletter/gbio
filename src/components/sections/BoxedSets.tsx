'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { ShoppingBag, Check, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useLocale, useTranslations } from 'next-intl'
import { products } from '@/data/products'
import { useCart } from '@/context/CartContext'
import { useProductT } from '@/lib/useProductT'
import { TextureOverlay } from '@/components/ui/decorative/TextureOverlay'
import { OrnateRule } from '@/components/ui/decorative/OrnateRule'

function BoxCard({ id }: { id: string }) {
  const rawProduct = products.find((p) => p.id === id)
  const locale = useLocale()
  const { addItem } = useCart()
  const [isAdded, setIsAdded] = useState(false)
  const t = useTranslations('products')

  const product = useProductT(rawProduct as never)
  if (!rawProduct) return null

  const handleAdd = () => {
    addItem(product)
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR' }).format(price)

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative bg-nero/60 backdrop-blur-sm border border-gold/20 hover:border-gold/50 transition-all duration-500 overflow-hidden"
    >
      {/* Image */}
      <Link href={`/${locale}/prodotti/${product.id}`} className="block relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-700"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nero/60 via-transparent to-transparent" />
        {/* Certification badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 z-10">
          {product.details.certification.map((cert) => (
            <span
              key={cert}
              className="px-2 py-1 text-[10px] font-sans uppercase tracking-wider bg-nero/80 text-gold border border-gold/30"
            >
              {cert.includes('DOP') ? 'DOP' : cert.includes('conversione') ? 'Conv. Bio' : 'Bio'}
            </span>
          ))}
        </div>
      </Link>

      {/* Content */}
      <div className="p-6 md:p-8 space-y-4">
        <div className="space-y-2">
          <span className="font-sans text-[10px] sm:text-xs uppercase tracking-[0.2em] text-gold/70">
            {product.subtitle}
          </span>
          <h3 className="font-serif text-2xl md:text-3xl text-bianco group-hover:text-gold transition-colors">
            <Link href={`/${locale}/prodotti/${product.id}`}>{product.name}</Link>
          </h3>
          <p className="font-sans text-sm md:text-base text-bianco/60 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="flex items-end justify-between pt-4 border-t border-gold/10">
          <div>
            <span className="block font-sans text-[10px] uppercase tracking-wider text-bianco/40 mb-1">
              {product.details.weight}
            </span>
            <span className="font-serif text-3xl md:text-4xl text-gold">
              {formatPrice(product.price)}
            </span>
          </div>
        </div>

        <button
          onClick={handleAdd}
          className="w-full py-3 px-4 border border-gold text-gold font-sans text-xs uppercase tracking-[0.2em] hover:bg-gold hover:text-nero transition-all duration-300 active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            {isAdded ? (
              <>
                <Check size={16} />
                {t('added')}
              </>
            ) : (
              <>
                <ShoppingBag size={16} />
                {t('addToCart')}
              </>
            )}
          </span>
        </button>
      </div>

      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-gold/0 group-hover:border-gold/60 transition-colors duration-500" />
      <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-gold/0 group-hover:border-gold/60 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-gold/0 group-hover:border-gold/60 transition-colors duration-500" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-gold/0 group-hover:border-gold/60 transition-colors duration-500" />
    </motion.article>
  )
}

export function BoxedSets() {
  const t = useTranslations('boxedSets')

  return (
    <section
      id="cofanetti"
      className="section-padding bg-nero relative overflow-hidden"
    >
      <TextureOverlay variant="paper" opacity={0.02} />

      <div className="container-custom relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12 md:mb-16"
        >
          <p className="font-sans text-xs uppercase tracking-[0.5em] text-gold/60 mb-6">
            {t('eyebrow')}
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-gold mb-6">
            {t('title')}
          </h2>
          <p className="font-serif text-lg md:text-xl text-bianco/70 max-w-2xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>
        </motion.div>

        <OrnateRule variant="diamond" className="mb-12 md:mb-16" />

        {/* Box grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-6xl mx-auto">
          <BoxCard id="box-olio-6" />
          <BoxCard id="box-pasta-6" />
        </div>

        {/* CTA secondario */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-12 md:mt-16 text-center"
        >
          <a
            href="#prodotti"
            className="inline-flex items-center gap-3 font-sans text-sm uppercase tracking-[0.2em] text-gold/80 hover:text-gold transition-colors group"
          >
            <span>{t('exploreAll')}</span>
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
