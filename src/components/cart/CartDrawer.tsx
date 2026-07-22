'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useCart } from '@/context/CartContext'
import { CartUpsell } from '@/components/cart/CartUpsell'
import { Button } from '@/components/ui/Button'
import Link from 'next/link'
import { useParams } from 'next/navigation'

export function CartDrawer() {
  const params = useParams()
  const locale = params.locale as string || 'it'
  const t = useTranslations('cartDrawer')
  const tCart = useTranslations('cart')
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    itemCount,
    subtotal,
    shipping,
    total,
    shippingZone,
  } = useCart()

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-nero/80 backdrop-blur-sm z-[200]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-nero border-l border-gold/20 z-[201] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gold/20">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-gold" />
                <h2 className="font-serif text-xl text-bianco">
                  {tCart('title')}
                  {itemCount > 0 && (
                    <span className="text-gold ml-2">({itemCount})</span>
                  )}
                </h2>
              </div>
              <button
                onClick={closeCart}
                className="text-bianco/60 hover:text-gold transition-colors p-2"
                aria-label={tCart('close')}
              >
                <X size={24} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {items.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center">
                  <ShoppingBag size={48} className="text-gold/30 mb-4" />
                  <p className="font-serif text-xl text-bianco mb-2">
                    {tCart('empty')}
                  </p>
                  <p className="font-sans text-sm text-bianco/50 mb-6">
                    {tCart('emptyDescription')}
                  </p>
                  <Button onClick={closeCart} href={`/${locale}/#prodotti`}>
                    {tCart('goToProducts')}
                  </Button>
                </div>
              ) : (
                <ul className="space-y-6">
                  {items.map((item) => (
                    <motion.li
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 pb-6 border-b border-gold/10"
                    >
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-nero flex-shrink-0 relative overflow-hidden border border-gold/10">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-contain"
                          sizes="80px"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-serif text-lg text-bianco truncate">
                          {item.product.name}
                        </h3>
                        <p className="font-sans text-xs text-gold/60 mb-2">
                          {item.product.details.weight}
                        </p>
                        <p className="font-serif text-lg text-gold">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex flex-col items-end justify-between">
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-bianco/40 hover:text-red-400 transition-colors p-1"
                          aria-label={tCart('removeItem')}
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-8 h-8 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-nero transition-all"
                            aria-label={tCart('decreaseQuantity')}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="font-sans text-bianco w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-8 h-8 border border-gold/30 flex items-center justify-center text-gold hover:bg-gold hover:text-nero transition-all"
                            aria-label={tCart('increaseQuantity')}
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gold/20 bg-nero">
                <CartUpsell />

                {/* Subtotals */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-bianco/60">{t('subtotal')}</span>
                    <span className="text-bianco">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between font-sans text-sm">
                    <span className="text-bianco/60">{t('shipping')}</span>
                    <span className="text-bianco">
                      {shipping === 0 ? (
                        <span className="text-forest">{t('free')}</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>
                  {shippingZone === 'extra_eu' && (
                    <p className="font-sans text-xs text-bianco/40 text-center py-2 border border-gold/20">
                      {t('extraEuShipping')}
                    </p>
                  )}
                  <div className="flex justify-between font-serif text-xl pt-3 border-t border-gold/20">
                    <span className="text-bianco">{t('total')}</span>
                    <span className="text-gold">{formatPrice(total)}</span>
                  </div>
                  <p className="font-sans text-[10px] text-bianco/30 text-center pt-1">
                    {shippingZone === 'italia' ? t('shippingItaly') : shippingZone === 'europa' ? t('shippingEurope') : t('shippingExtraEu')} {t('changeCountry')}
                  </p>
                </div>

                {/* Checkout Button */}
                <Link
                  href={`/${locale}/checkout`}
                  onClick={closeCart}
                  className="btn-primary w-full flex items-center justify-center gap-2"
                >
                  <span>{t('proceedCheckout')}</span>
                  <ArrowRight size={16} />
                </Link>

                <button
                  onClick={closeCart}
                  className="w-full mt-3 py-3 font-sans text-xs uppercase tracking-[0.2em] text-bianco/50 hover:text-gold transition-colors"
                >
                  {t('continueShopping')}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
