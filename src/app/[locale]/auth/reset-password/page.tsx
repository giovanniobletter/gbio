'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Loader2, ArrowLeft, Mail, Check } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'

export default function ResetPasswordPage() {
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Inserisci un indirizzo email valido')
      setIsSubmitting(false)
      return
    }

    const result = await resetPassword(email)

    if (result.success) {
      setIsSubmitted(true)
    } else {
      setError(result.error || 'Errore durante la richiesta')
    }
    setIsSubmitting(false)
  }

  const inputStyles = `
    w-full bg-transparent border border-gold/30 px-4 py-3
    font-sans text-bianco placeholder:text-bianco/30
    focus:border-gold focus:outline-none transition-colors duration-300
  `

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="w-16 h-16 mx-auto mb-6 border-2 border-gold rounded-full flex items-center justify-center"
        >
          <Mail size={32} className="text-gold" />
        </motion.div>
        <h1 className="font-serif text-3xl text-bianco mb-4">
          Controlla la tua email
        </h1>
        <p className="font-sans text-bianco/60 mb-8">
          Se l&apos;indirizzo <span className="text-gold">{email}</span> è
          registrato, riceverai le istruzioni per reimpostare la password.
        </p>
        <Link
          href="/auth/login"
          className="btn-primary inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Torna al Login</span>
        </Link>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
      className="w-full max-w-md"
    >
      <motion.div variants={staggerItem}>
        <Link
          href="/auth/login"
          className="inline-flex items-center gap-2 font-sans text-xs uppercase tracking-[0.2em] text-gold/60 hover:text-gold transition-colors mb-8"
        >
          <ArrowLeft size={14} />
          Torna al login
        </Link>
      </motion.div>

      <motion.div variants={staggerItem} className="text-center mb-8">
        <h1 className="font-serif text-3xl lg:text-4xl text-bianco mb-2">
          Password dimenticata?
        </h1>
        <p className="font-sans text-bianco/60">
          Inserisci la tua email e ti invieremo le istruzioni per reimpostarla.
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
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (error) setError('')
            }}
            required
            className={inputStyles}
            placeholder="nome@email.it"
            autoComplete="email"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={cn(
            'btn-primary w-full flex items-center justify-center gap-2',
            isSubmitting && 'opacity-50 cursor-not-allowed'
          )}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span>Invio in corso...</span>
            </>
          ) : (
            <span>Invia Istruzioni</span>
          )}
        </button>
      </motion.form>

      <motion.div variants={staggerItem} className="mt-8 text-center">
        <p className="font-sans text-bianco/60">
          Hai ricordato la password?{' '}
          <Link
            href="/auth/login"
            className="text-gold hover:text-gold-light transition-colors"
          >
            Accedi
          </Link>
        </p>
      </motion.div>
    </motion.div>
  )
}
