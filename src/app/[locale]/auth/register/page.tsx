'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams, useParams } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Eye, EyeOff, Loader2, ArrowRight, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { fadeUp, staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

function RegisterForm() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const searchParams = useSearchParams()
  const returnUrl = searchParams.get('returnUrl') || `/${locale}`
  const { register, isLoading } = useAuth()

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [showPassword, setShowPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptNewsletter, setAcceptNewsletter] = useState(false)
  const [error, setError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Obbligatorio'
    if (!formData.lastName.trim()) newErrors.lastName = 'Obbligatorio'
    if (!formData.email.trim()) newErrors.email = 'Obbligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email non valida'
    }
    if (!formData.password) newErrors.password = 'Obbligatorio'
    else if (formData.password.length < 8) {
      newErrors.password = 'Minimo 8 caratteri'
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Le password non coincidono'
    }
    if (!acceptTerms) {
      newErrors.terms = 'Devi accettare i termini'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return

    setIsSubmitting(true)

    const result = await register({
      email: formData.email,
      password: formData.password,
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone || undefined,
    })

    if (result.success) {
      router.push(returnUrl)
    } else {
      setError(result.error || 'Errore durante la registrazione')
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
    if (error) setError('')
  }

  const inputStyles = `
    w-full bg-transparent border border-gold/30 px-4 py-3
    font-sans text-bianco placeholder:text-bianco/30
    focus:border-gold focus:outline-none transition-colors duration-300
  `

  const passwordStrength = () => {
    const password = formData.password
    if (!password) return { strength: 0, label: '' }

    let strength = 0
    if (password.length >= 8) strength++
    if (/[A-Z]/.test(password)) strength++
    if (/[0-9]/.test(password)) strength++
    if (/[^A-Za-z0-9]/.test(password)) strength++

    const labels = ['', 'Debole', 'Media', 'Buona', 'Forte']
    const colors = ['', 'bg-red-400', 'bg-yellow-400', 'bg-gold', 'bg-green-400']

    return { strength, label: labels[strength], color: colors[strength] }
  }

  const { strength, label, color } = passwordStrength()

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full max-w-md"
    >
      <motion.div variants={staggerItem} className="text-center mb-8">
        <h1 className="font-serif text-3xl lg:text-4xl text-bianco mb-2">
          Crea il tuo account
        </h1>
        <p className="font-sans text-bianco/60">
          Unisciti alla famiglia GBiO
        </p>
      </motion.div>

      <motion.form
        variants={staggerItem}
        onSubmit={handleSubmit}
        className="space-y-5"
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

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
              Nome *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={cn(inputStyles, errors.firstName && 'border-red-400')}
              placeholder="Mario"
              autoComplete="given-name"
            />
            {errors.firstName && (
              <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
            )}
          </div>
          <div>
            <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
              Cognome *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={cn(inputStyles, errors.lastName && 'border-red-400')}
              placeholder="Rossi"
              autoComplete="family-name"
            />
            {errors.lastName && (
              <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={cn(inputStyles, errors.email && 'border-red-400')}
            placeholder="nome@email.it"
            autoComplete="email"
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
            Telefono
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputStyles}
            placeholder="+39 333 123 4567"
            autoComplete="tel"
          />
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
            Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={cn(inputStyles, 'pr-12', errors.password && 'border-red-400')}
              placeholder="Minimo 8 caratteri"
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-bianco/40 hover:text-gold transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {formData.password && (
            <div className="mt-2">
              <div className="flex gap-1 mb-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      'h-1 flex-1 rounded-full transition-colors',
                      i <= strength ? color : 'bg-bianco/10'
                    )}
                  />
                ))}
              </div>
              <p className="text-xs text-bianco/50">
                Sicurezza: <span className="text-bianco">{label}</span>
              </p>
            </div>
          )}
          {errors.password && (
            <p className="text-red-400 text-xs mt-1">{errors.password}</p>
          )}
        </div>

        <div>
          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
            Conferma Password *
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={cn(
                inputStyles,
                'pr-12',
                errors.confirmPassword && 'border-red-400',
                formData.confirmPassword &&
                  formData.password === formData.confirmPassword &&
                  'border-green-400'
              )}
              placeholder="Ripeti la password"
              autoComplete="new-password"
            />
            {formData.confirmPassword &&
              formData.password === formData.confirmPassword && (
                <Check
                  size={18}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-green-400"
                />
              )}
          </div>
          {errors.confirmPassword && (
            <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>
          )}
        </div>

        <div className="space-y-3 pt-2">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptTerms}
              onChange={(e) => setAcceptTerms(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-gold"
            />
            <span className="font-sans text-sm text-bianco/60">
              Accetto i{' '}
              <a href="#contatti" className="text-gold hover:underline">
                Termini e Condizioni
              </a>{' '}
              e la{' '}
              <a href="#contatti" className="text-gold hover:underline">
                Privacy Policy
              </a>{' '}
              *
            </span>
          </label>
          {errors.terms && (
            <p className="text-red-400 text-xs ml-7">{errors.terms}</p>
          )}

          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={acceptNewsletter}
              onChange={(e) => setAcceptNewsletter(e.target.checked)}
              className="w-4 h-4 mt-0.5 accent-gold"
            />
            <span className="font-sans text-sm text-bianco/60">
              Desidero ricevere novità e offerte esclusive via email
            </span>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className={cn(
            'btn-primary w-full flex items-center justify-center gap-2 mt-6',
            (isSubmitting || isLoading) && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting || isLoading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Registrazione in corso...</span>
            </>
          ) : (
            <>
              <span>Crea Account</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>
      </motion.form>

      <motion.div variants={staggerItem} className="mt-8 text-center">
        <p className="font-sans text-bianco/60">
          Hai già un account?{' '}
          <Link
            href={`/${locale}/auth/login${returnUrl !== `/${locale}` ? `?returnUrl=${encodeURIComponent(returnUrl)}` : ''}`}
            className="text-gold hover:text-gold-light transition-colors"
          >
            Accedi
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={null}>
      <RegisterForm />
    </Suspense>
  )
}
