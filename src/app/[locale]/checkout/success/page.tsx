'use client'

import { Suspense, useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { Check, Package, Mail, ArrowRight, AlertTriangle } from 'lucide-react'
import { useCart } from '@/context/CartContext'

function SuccessContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const locale = params.locale as string
  const t = useTranslations('checkout')
  const { clearCart } = useCart()

  const paymentIntent = searchParams.get('payment_intent')
  const redirectStatus = searchParams.get('redirect_status')
  // Also support old session_id param from legacy Checkout flow
  const sessionId = searchParams.get('session_id')

  const isSuccess = redirectStatus === 'succeeded' || sessionId
  const isFailed = redirectStatus && redirectStatus !== 'succeeded'

  const [orderNumber] = useState(() =>
    `GBO-${Date.now().toString(36).toUpperCase()}`
  )

  // Clear cart on successful payment
  useEffect(() => {
    if (isSuccess) {
      clearCart()
    }
  }, [clearCart, isSuccess])

  if (isFailed) {
    return (
      <div className="min-h-screen bg-nero flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-24 h-24 mx-auto mb-8 border-2 border-red-400 rounded-full flex items-center justify-center bg-red-400/10"
          >
            <AlertTriangle size={48} className="text-red-400" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-4xl md:text-5xl text-bianco mb-4"
          >
            {t('paymentFailed')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="font-sans text-bianco/60 mb-8"
          >
            {t('paymentFailedMessage')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Link
              href={`/${locale}/checkout`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <span>{t('retryPayment')}</span>
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nero flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center max-w-lg"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-8 border-2 border-gold rounded-full flex items-center justify-center bg-gold/10"
        >
          <Check size={48} className="text-gold" />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="font-serif text-4xl md:text-5xl text-bianco mb-4"
        >
          {t('orderThanks')}
        </motion.h1>

        {/* Order Number */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <p className="font-sans text-bianco/60 mb-2">{t('orderNumberLabel')}</p>
          <p className="font-mono text-xl text-gold">{orderNumber}</p>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-4 mb-10"
        >
          <div className="p-4 border border-gold/20 flex items-start gap-4 text-left">
            <Mail size={20} className="text-gold mt-1 flex-shrink-0" />
            <div>
              <p className="font-sans text-bianco text-sm">
                {t('successEmailMessage')}
              </p>
            </div>
          </div>

          <div className="p-4 border border-gold/20 flex items-start gap-4 text-left">
            <Package size={20} className="text-gold mt-1 flex-shrink-0" />
            <div>
              <p className="font-sans text-bianco text-sm">
                {t('successShipMessage')}
              </p>
            </div>
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <Link
            href={`/${locale}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>{t('backToHome')}</span>
            <ArrowRight size={16} />
          </Link>
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 font-sans text-xs text-bianco/40"
        >
          {t('footerNotePre')}{' '}
          <a href="mailto:customerservice@gbio.it" className="text-gold hover:underline">
            customerservice@gbio.it
          </a>
        </motion.p>
      </motion.div>
    </div>
  )
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-nero flex items-center justify-center">
        <div className="text-gold font-sans">Loading…</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  )
}
