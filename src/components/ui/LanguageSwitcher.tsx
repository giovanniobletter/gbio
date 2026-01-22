'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale } from 'next-intl'
import { useRouter, usePathname } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronDown } from 'lucide-react'
import { locales, localeNames, localeFlags, type Locale } from '@/i18n/config'
import { cn } from '@/lib/utils'

interface LanguageSwitcherProps {
  variant?: 'default' | 'minimal'
  className?: string
}

export function LanguageSwitcher({ variant = 'default', className }: LanguageSwitcherProps) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLocaleChange = (newLocale: Locale) => {
    // Get the path without the locale prefix
    const pathWithoutLocale = pathname.replace(`/${locale}`, '') || '/'

    // Navigate to the new locale path
    router.push(`/${newLocale}${pathWithoutLocale}`)
    setIsOpen(false)
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('relative', className)} ref={dropdownRef}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gold hover:text-gold-light transition-colors"
          aria-label="Change language"
        >
          <Globe size={20} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-40 bg-nero border border-gold/20 shadow-xl z-50"
            >
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                    loc === locale
                      ? 'bg-gold/10 text-gold'
                      : 'text-bianco/70 hover:text-gold hover:bg-gold/5'
                  )}
                >
                  <span className="text-base">{localeFlags[loc]}</span>
                  <span className="font-sans">{localeNames[loc]}</span>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    )
  }

  return (
    <div className={cn('relative', className)} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 text-gold hover:text-gold-light transition-colors"
      >
        <span className="text-base">{localeFlags[locale]}</span>
        <span className="hidden sm:inline font-sans text-xs uppercase tracking-[0.1em]">
          {locale.toUpperCase()}
        </span>
        <ChevronDown
          size={14}
          className={cn('transition-transform', isOpen && 'rotate-180')}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 bg-nero border border-gold/20 shadow-xl z-50"
          >
            <div className="py-2">
              {locales.map((loc) => (
                <button
                  key={loc}
                  onClick={() => handleLocaleChange(loc)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors',
                    loc === locale
                      ? 'bg-gold/10 text-gold'
                      : 'text-bianco/70 hover:text-gold hover:bg-gold/5'
                  )}
                >
                  <span className="text-lg">{localeFlags[loc]}</span>
                  <span className="font-sans">{localeNames[loc]}</span>
                  {loc === locale && (
                    <span className="ml-auto text-gold text-xs">&#10003;</span>
                  )}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
