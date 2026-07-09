'use client'

import { useState } from 'react'
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { loadStripe, type StripeElementsOptions } from '@stripe/stripe-js'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
)

// Stripe appearance matching GBiO nero/oro theme
const appearance: StripeElementsOptions['appearance'] = {
  theme: 'night',
  variables: {
    colorPrimary: '#c9a961',
    colorBackground: '#1a1a1a',
    colorText: '#ffffff',
    colorTextSecondary: '#ffffff99',
    colorTextPlaceholder: '#ffffff4d',
    colorDanger: '#ef4444',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSizeBase: '16px',
    spacingUnit: '4px',
    borderRadius: '0px',
    colorIcon: '#c9a961',
  },
  rules: {
    '.Input': {
      border: '1px solid rgba(201, 169, 97, 0.3)',
      boxShadow: 'none',
      padding: '12px 16px',
    },
    '.Input:focus': {
      border: '1px solid #c9a961',
      boxShadow: 'none',
    },
    '.Label': {
      fontSize: '11px',
      fontWeight: '400',
      textTransform: 'uppercase',
      letterSpacing: '0.2em',
      color: 'rgba(201, 169, 97, 0.6)',
      marginBottom: '8px',
    },
    '.Tab': {
      border: '1px solid rgba(201, 169, 97, 0.3)',
      backgroundColor: 'transparent',
    },
    '.Tab:hover': {
      border: '1px solid rgba(201, 169, 97, 0.6)',
    },
    '.Tab--selected': {
      border: '1px solid #c9a961',
      backgroundColor: 'rgba(201, 169, 97, 0.05)',
    },
  },
}

function PaymentForm({
  total,
  locale,
  returnUrl,
}: {
  total: string
  locale: string
  returnUrl: string
}) {
  const stripe = useStripe()
  const elements = useElements()
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!stripe || !elements) return

    setIsProcessing(true)
    setErrorMessage('')

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: returnUrl,
      },
    })

    // This point is only reached if there's an immediate error
    // (payment redirect handles success)
    if (error) {
      if (error.type === 'card_error' || error.type === 'validation_error') {
        setErrorMessage(error.message || 'Errore nel pagamento.')
      } else {
        setErrorMessage('Si è verificato un errore imprevisto. Riprova.')
      }
    }

    setIsProcessing(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement
        options={{
          layout: 'tabs',
        }}
      />

      <button
        type="submit"
        disabled={!stripe || isProcessing}
        className={cn(
          'btn-primary w-full flex items-center justify-center gap-2',
          (!stripe || isProcessing) && 'opacity-50 cursor-not-allowed'
        )}
      >
        {isProcessing ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            <span>{locale === 'en' ? 'Processing...' : 'Elaborazione...'}</span>
          </>
        ) : (
          // Formulazione "ordine con obbligo di pagare" (art. 51 c.2 Cod. Consumo)
          <span>{locale === 'en' ? `Pay ${total}` : `Paga ${total}`}</span>
        )}
      </button>

      <p className="font-sans text-xs text-bianco/40 text-center">
        {locale === 'en' ? (
          <>By paying you place an order with an obligation to pay and accept the{' '}
            <a href={`/${locale}/termini`} className="text-gold/70 hover:text-gold underline" target="_blank">terms and conditions of sale</a>.</>
        ) : (
          <>Pagando invii un ordine con obbligo di pagare e accetti i{' '}
            <a href={`/${locale}/termini`} className="text-gold/70 hover:text-gold underline" target="_blank">termini e condizioni di vendita</a>.</>
        )}
      </p>

      {errorMessage && (
        <div className="p-4 border border-red-400/50 bg-red-400/10">
          <p className="font-sans text-sm text-red-400">{errorMessage}</p>
        </div>
      )}
    </form>
  )
}

export default function StripePaymentForm({
  clientSecret,
  total,
  locale,
  returnUrl,
}: {
  clientSecret: string
  total: string
  locale: string
  returnUrl: string
}) {
  const options: StripeElementsOptions = {
    clientSecret,
    appearance,
    locale: locale === 'it' ? 'it' : 'en',
  }

  return (
    <Elements stripe={stripePromise} options={options}>
      <PaymentForm total={total} locale={locale} returnUrl={returnUrl} />
    </Elements>
  )
}
