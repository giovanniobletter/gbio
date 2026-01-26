'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X, ShoppingBag, User, LogOut, Package, MapPin, ChevronDown, Globe } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useLocale, useTranslations } from 'next-intl'
import { navigation } from '@/data/navigation'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { cn } from '@/lib/utils'

export function Header() {
  const router = useRouter()
  const locale = useLocale()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const userMenuRef = useRef<HTMLDivElement>(null)

  const { openCart, itemCount } = useCart()
  const { user, isAuthenticated, isLoading, logout } = useAuth()

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

  // Close user menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsUserMenuOpen(false)
    router.push(`/${locale}`)
  }

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
          <Link href={`/${locale}`} className="flex items-center">
            <Image
              src="/logo-gbo-short.svg"
              alt="GBO - Home"
              width={105}
              height={62}
              className="h-10 md:h-12 w-auto"
              priority
            />
          </Link>

          <nav className="hidden lg:flex items-center gap-10">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-sans text-xs uppercase tracking-[0.2em] text-bianco/80 hover:text-gold transition-colors duration-300"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* User Menu */}
            {!isLoading && (
              <div className="relative" ref={userMenuRef}>
                {isAuthenticated && user ? (
                  <>
                    <button
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center gap-2 p-2 text-gold hover:text-gold-light transition-colors"
                    >
                      <div className="w-8 h-8 rounded-full bg-gold/20 flex items-center justify-center">
                        <span className="font-sans text-sm text-gold">
                          {user.firstName.charAt(0)}
                        </span>
                      </div>
                      <ChevronDown
                        size={14}
                        className={cn(
                          'hidden sm:block transition-transform',
                          isUserMenuOpen && 'rotate-180'
                        )}
                      />
                    </button>

                    <AnimatePresence>
                      {isUserMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-56 bg-nero border border-gold/20 shadow-xl"
                        >
                          <div className="p-4 border-b border-gold/10">
                            <p className="font-sans text-sm text-bianco">
                              {user.firstName} {user.lastName}
                            </p>
                            <p className="font-sans text-xs text-bianco/50 truncate">
                              {user.email}
                            </p>
                          </div>
                          <div className="py-2">
                            <Link
                              href={`/${locale}/account`}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-bianco/70 hover:text-gold hover:bg-gold/5 transition-colors"
                            >
                              <User size={16} />
                              Il mio Profilo
                            </Link>
                            <Link
                              href={`/${locale}/account?tab=orders`}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-bianco/70 hover:text-gold hover:bg-gold/5 transition-colors"
                            >
                              <Package size={16} />
                              I miei Ordini
                            </Link>
                            <Link
                              href={`/${locale}/account?tab=addresses`}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-bianco/70 hover:text-gold hover:bg-gold/5 transition-colors"
                            >
                              <MapPin size={16} />
                              I miei Indirizzi
                            </Link>
                          </div>
                          <div className="border-t border-gold/10 py-2">
                            <button
                              onClick={handleLogout}
                              className="flex items-center gap-3 px-4 py-2 text-sm text-red-400 hover:bg-red-400/5 transition-colors w-full"
                            >
                              <LogOut size={16} />
                              Esci
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </>
                ) : (
                  <Link
                    href={`/${locale}/auth/login`}
                    className="p-2 text-gold hover:text-gold-light transition-colors"
                  >
                    <User size={22} />
                  </Link>
                )}
              </div>
            )}

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

              {/* User info in mobile menu */}
              {isAuthenticated && user && (
                <div className="p-6 border-b border-gold/10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gold/20 flex items-center justify-center">
                      <span className="font-serif text-xl text-gold">
                        {user.firstName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-sans text-bianco">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="font-sans text-xs text-bianco/50">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex-1 flex flex-col justify-center p-6">
                {navigation.map((item, i) => (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-serif text-3xl text-bianco hover:text-gold transition-colors duration-300 py-4 border-b border-gold/10"
                  >
                    {item.label}
                  </motion.a>
                ))}

                {/* Auth links in mobile menu */}
                {isAuthenticated ? (
                  <>
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: navigation.length * 0.1 }}
                    >
                      <Link
                        href={`/${locale}/account`}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="font-serif text-3xl text-gold hover:text-gold-light transition-colors duration-300 py-4 border-b border-gold/10 flex items-center gap-3"
                      >
                        <User size={28} />
                        Account
                      </Link>
                    </motion.div>
                    <motion.button
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (navigation.length + 1) * 0.1 }}
                      onClick={() => {
                        handleLogout()
                        setIsMobileMenuOpen(false)
                      }}
                      className="font-serif text-3xl text-red-400 hover:text-red-300 transition-colors duration-300 py-4 border-b border-gold/10 text-left flex items-center gap-3"
                    >
                      <LogOut size={28} />
                      Esci
                    </motion.button>
                  </>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: navigation.length * 0.1 }}
                  >
                    <Link
                      href={`/${locale}/auth/login`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="font-serif text-3xl text-gold hover:text-gold-light transition-colors duration-300 py-4 border-b border-gold/10 flex items-center gap-3"
                    >
                      <User size={28} />
                      Accedi
                    </Link>
                  </motion.div>
                )}

                {/* Cart link in mobile menu */}
                <motion.button
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navigation.length + 2) * 0.1 }}
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
                  transition={{ delay: (navigation.length + 3) * 0.1 }}
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
