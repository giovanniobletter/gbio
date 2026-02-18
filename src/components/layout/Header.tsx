'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useLocale } from 'next-intl'
import { navigation } from '@/data/navigation'
import { useCart } from '@/context/CartContext'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { cn } from '@/lib/utils'

export function Header() {
  const locale = useLocale()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { openCart, itemCount } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
          isScrolled
            ? 'bg-nero/90 backdrop-blur-md py-4'
            : 'bg-transparent py-6'
        )}
      >
        <div className="container-custom flex items-center justify-between">
          <Link href={`/${locale}`} className="flex flex-col items-center">
            <Image
              src="/logo-gbo-short.svg"
              alt="GBO - Home"
              width={105}
              height={62}
              className="h-10 md:h-12 w-auto"
              priority
            />
            {/* Italian flag - subtle underline */}
            <div className="flex mt-1 opacity-60">
              <div className="w-5 h-[2px] bg-gradient-to-r from-transparent to-[#009246]" />
              <div className="w-4 h-[2px] bg-white" />
              <div className="w-5 h-[2px] bg-gradient-to-r from-[#CE2B37] to-transparent" />
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={`/${locale}${item.href}`}
                className="font-sans text-xs uppercase tracking-[0.2em] text-bianco/80 hover:text-gold transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            
            {/* Language Switcher */}
            <LanguageSwitcher className="hidden lg:block" />

            {/* Cart Button */}
            <button
              onClick={openCart}
              className="relative p-2 text-gold hover:text-gold-light transition-colors"
              aria-label="Apri carrello"
            >
              <ShoppingBag size={22} />
              <AnimatePresence>
                {itemCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 w-5 h-5 bg-gold text-nero text-xs font-sans font-semibold flex items-center justify-center rounded-full"
                  >
                    {itemCount > 9 ? '9+' : itemCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden text-gold p-2"
              aria-label="Apri menu"
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </motion.header>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] lg:hidden"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-nero/95 backdrop-blur-lg"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            <motion.nav
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-nero border-l border-gold/20 flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-gold/20">
                <Image
                  src="/logo-gbo.svg"
                  alt="GBO"
                  width={80}
                  height={86}
                  className="h-8 w-auto"
                  style={{ filter: 'brightness(0) saturate(100%) invert(75%) sepia(30%) saturate(500%) hue-rotate(5deg) brightness(95%)' }}
                />
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gold p-2"
                  aria-label="Chiudi menu"
                >
                  <X size={24} />
                </button>
              </div>

              
              <div className="flex-1 flex flex-col justify-center p-6">
                {navigation.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-3xl text-bianco hover:text-gold transition-colors duration-300 py-4 border-b border-gold/10"
                  >
                    {item.label}
                  </motion.a>
                ))}

                
                {/* Cart link in mobile menu */}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: navigation.length * 0.1 }}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    openCart()
                  }}
                  className="font-serif text-3xl text-gold hover:text-gold-light transition-colors duration-300 py-4 border-b border-gold/10 text-left flex items-center gap-3"
                >
                  <ShoppingBag size={28} />
                  Carrello
                  {itemCount > 0 && (
                    <span className="text-lg">({itemCount})</span>
                  )}
                </motion.button>

                {/* Language Switcher in mobile menu */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navigation.length + 1) * 0.1 }}
                  className="pt-6"
                >
                  <LanguageSwitcher />
                </motion.div>
              </div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
