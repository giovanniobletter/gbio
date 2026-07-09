'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations, useLocale } from 'next-intl'
import { X } from 'lucide-react'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

function loadGA() {
  if (!GA_ID || typeof window === 'undefined') return

  // Load gtag script
  const script = document.createElement('script')
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.async = true
  document.head.appendChild(script)

  // Initialize gtag
  window.dataLayer = window.dataLayer || []
  function gtag(...args: unknown[]) {
    window.dataLayer.push(args)
  }
  gtag('js', new Date())
  gtag('config', GA_ID)
}

declare global {
  interface Window {
    dataLayer: unknown[]
  }
}

// Revoca del consenso (GDPR art. 7.3: revocare dev'essere facile quanto
// consentire): rimuove la scelta e i cookie GA, poi riapre il banner.
function clearGACookies() {
  const domain = window.location.hostname.replace(/^www\./, '')
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim()
    if (name === '_ga' || name.startsWith('_ga_') || name === '_gid') {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=.${domain}`
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
    }
  })
}

export function reopenCookieBanner() {
  localStorage.removeItem('cookie-consent')
  clearGACookies()
  window.dispatchEvent(new Event('gbio:cookie-banner-open'))
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const t = useTranslations('cookies')
  const locale = useLocale()

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent')
    if (consent === 'accepted') {
      loadGA()
    } else if (consent === null) {
      // No choice made yet — show banner after a short delay
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    const open = () => setVisible(true)
    window.addEventListener('gbio:cookie-banner-open', open)
    return () => window.removeEventListener('gbio:cookie-banner-open', open)
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
    loadGA()
  }

  const reject = () => {
    localStorage.setItem('cookie-consent', 'rejected')
    setVisible(false)
    clearGACookies()
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-0 left-0 right-0 z-[9999] p-4 md:p-6"
        >
          <div className="container-custom max-w-4xl mx-auto bg-nero/95 backdrop-blur-md border border-gold/30 p-6 md:p-8 shadow-2xl">
            <button
              onClick={reject}
              className="absolute top-4 right-4 text-bianco/40 hover:text-gold transition-colors"
              aria-label={t('close')}
            >
              <X size={18} />
            </button>

            <div className="flex flex-col md:flex-row md:items-center gap-6">
              <div className="flex-1">
                <h3 className="font-serif text-lg text-gold mb-2">
                  {t('title')}
                </h3>
                <p className="font-sans text-sm text-bianco/60 leading-relaxed">
                  {t('message')}{' '}
                  <a href={`/${locale}/cookies`} className="text-gold hover:underline">
                    {t('policy')}
                  </a>{' '}
                  {t('andOur')}{' '}
                  <a href={`/${locale}/privacy`} className="text-gold hover:underline">
                    Privacy Policy
                  </a>.
                </p>
              </div>

              <div className="flex gap-3 flex-shrink-0">
                <button
                  onClick={reject}
                  className="px-5 py-2.5 border border-gold/30 text-bianco/60 font-sans text-xs uppercase tracking-[0.15em] hover:border-gold hover:text-bianco transition-all duration-300"
                >
                  {t('reject')}
                </button>
                <button
                  onClick={accept}
                  className="px-5 py-2.5 bg-gold text-nero font-sans text-xs uppercase tracking-[0.15em] hover:bg-gold-light transition-all duration-300"
                >
                  {t('accept')}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
