'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, ArrowRight } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

function LoginForm() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || `/${locale}`
  const { login, isLoading } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = await login(formData.email, formData.password)

    if (result.success) {
      router.push(returnUrl)
    } else {
      setError(result.error || 'Errore durante il login')
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    if (error) setError('')
  }

  const inputStyles = `
    w-full bg-transparent border border-gold/30 px-4 py-3
    font-sans text-bianco placeholder:text-bianco/30
    focus:border-gold focus:outline-none transition-colors duration-300
  `

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full max-w-md"
    >
      <motion.div variants={staggerItem} className="text-center mb-8">
        <h1 className="font-serif text-3xl lg:text-4xl text-bianco mb-2">
          Bentornato
        </h1>
        <p className="font-sans text-bianco/60">
          Accedi al tuo account GBiO
        </p>
      </motion.div>

      <motion.form
        variants={staggerItem}
        onSubmit={handleSubmit}
        className="space-y-6"
      >
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 border border-red-400/50 bg-red-400/10 text-red-400 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <div>
          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className={inputStyles}
            placeholder="nome@email.it"
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className={cn(inputStyles, 'pr-12')}
              placeholder="La tua password"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-bianco/40 hover:text-gold transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="w-4 h-4 accent-gold"
            />
            <span className="font-sans text-sm text-bianco/60">Ricordami</span>
          </label>
          <Link
            href={`/${locale}/auth/reset-password`}
            className="font-sans text-sm text-gold hover:text-gold-light transition-colors"
          >
            Password dimenticata?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={cn(
            'btn-primary w-full flex items-center justify-center gap-2',
            (isSubmitting || isLoading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Accesso in corso...</span>
            </>
          ) : (
            <>
              <span>Accedi</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </motion.form>

      <motion.div variants={staggerItem} className="mt-8 text-center">
        <p className="font-sans text-bianco/60">
          Non hai un account?{' '}
          <Link
            href={`/${locale}/auth/register${returnUrl !== `/${locale}` ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
            className="text-gold hover:text-gold-light transition-colors"
          >
            Registrati
          </Link>
        </p>
      </motion.div>

      <motion.div variants={staggerItem} className="mt-8">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gold/20" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-4 bg-nero font-sans text-xs text-bianco/40">
              oppure
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button className="w-full py-3 border border-gold/30 text-bianco font-sans text-sm flex items-center justify-center gap-3 hover:border-gold/60 transition-colors">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continua con Google
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}
