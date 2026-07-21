'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import {
  ArrowLeft,
  Truck,
  Shield,
  Check,
  Loader2,
  User,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { metaTrack } from '@/lib/metaPixel'
import { useAuth } from '@/context/AuthContext'
import { COUNTRIES, getShippingZone } from '@/lib/shipping'
import { isValidCodiceFiscale, isValidPartitaIva, isValidCodiceSdi, isValidEmailFormat } from '@/lib/fiscal'
import StripePaymentForm from '@/components/checkout/StripePaymentForm'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { ShippingAddress, BillingInfo } from '@/types'

const provinces = [
  'Agrigento', 'Alessandria', 'Ancona', 'Aosta', 'Arezzo', 'Ascoli Piceno',
  'Asti', 'Avellino', 'Bari', 'Barletta-Andria-Trani', 'Belluno', 'Benevento',
  'Bergamo', 'Biella', 'Bologna', 'Bolzano', 'Brescia', 'Brindisi', 'Cagliari',
  'Caltanissetta', 'Campobasso', 'Caserta', 'Catania', 'Catanzaro', 'Chieti',
  'Como', 'Cosenza', 'Cremona', 'Crotone', 'Cuneo', 'Enna', 'Fermo', 'Ferrara',
  'Firenze', 'Foggia', 'Forlì-Cesena', 'Frosinone', 'Genova', 'Gorizia',
  'Grosseto', 'Imperia', 'Isernia', 'L\'Aquila', 'La Spezia', 'Latina', 'Lecce',
  'Lecco', 'Livorno', 'Lodi', 'Lucca', 'Macerata', 'Mantova', 'Massa-Carrara',
  'Matera', 'Messina', 'Milano', 'Modena', 'Monza e Brianza', 'Napoli', 'Novara',
  'Nuoro', 'Oristano', 'Padova', 'Palermo', 'Parma', 'Pavia', 'Perugia',
  'Pesaro e Urbino', 'Pescara', 'Piacenza', 'Pisa', 'Pistoia', 'Pordenone',
  'Potenza', 'Prato', 'Ragusa', 'Ravenna', 'Reggio Calabria', 'Reggio Emilia',
  'Rieti', 'Rimini', 'Roma', 'Rovigo', 'Salerno', 'Sassari', 'Savona', 'Siena',
  'Siracusa', 'Sondrio', 'Sud Sardegna', 'Taranto', 'Teramo', 'Terni', 'Torino',
  'Trapani', 'Trento', 'Treviso', 'Trieste', 'Udine', 'Varese', 'Venezia',
  'Verbano-Cusio-Ossola', 'Vercelli', 'Verona', 'Vibo Valentia', 'Vicenza', 'Viterbo'
]

function CheckoutContent() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('checkout')
  const { items, subtotal, shipping, total, clearCart, shippingZone, setShippingZone, freeShippingThreshold } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    country: 'Italia',
    notes: '',
  })
  const [countryCode, setCountryCode] = useState('IT')
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({})
  const [billing, setBilling] = useState<BillingInfo>({
    requested: false,
    type: 'privato',
    codiceFiscale: '',
    businessName: '',
    partitaIva: '',
    sdiCode: '',
    pecEmail: '',
  })
  const [billingErrors, setBillingErrors] = useState<Partial<Record<keyof BillingInfo, string>>>({})

  // Meta Pixel: una sola volta per visita al checkout, appena il carrello è disponibile
  const initiateTracked = useRef(false)
  useEffect(() => {
    if (initiateTracked.current || items.length === 0) return
    initiateTracked.current = true
    metaTrack('InitiateCheckout', {
      content_ids: items.map((i) => i.product.id),
      num_items: items.reduce((n, i) => n + i.quantity, 0),
      value: total,
      currency: 'EUR',
    })
  }, [items, total])

  // Pre-fill form with user data or default address
  useEffect(() => {
    if (user) {
      if (user.addresses.length > 0) {
        const defaultIndex = user.defaultAddressIndex ?? 0
        setSelectedAddressIndex(defaultIndex)
        setFormData(user.addresses[defaultIndex])
      } else {
        setFormData((prev) => ({
          ...prev,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          phone: user.phone || '',
        }))
      }
    }
  }, [user])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale === 'en' ? 'en-GB' : 'it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const validateShipping = () => {
    const newErrors: Partial<ShippingAddress> = {}

    if (!formData.firstName.trim()) newErrors.firstName = t('required')
    if (!formData.lastName.trim()) newErrors.lastName = t('required')
    if (!formData.email.trim()) newErrors.email = t('required')
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('invalidEmail')
    }
    if (!formData.phone.trim()) newErrors.phone = t('required')
    if (!formData.address.trim()) newErrors.address = t('required')
    if (!formData.city.trim()) newErrors.city = t('required')
    if (countryCode === 'IT') {
      if (!formData.province.trim()) newErrors.province = t('required')
      if (!formData.postalCode.trim()) newErrors.postalCode = t('required')
      else if (!/^\d{5}$/.test(formData.postalCode)) {
        newErrors.postalCode = t('invalidPostalCode')
      }
    } else {
      if (!formData.postalCode.trim()) newErrors.postalCode = t('required')
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateBilling = () => {
    if (!billing.requested) {
      setBillingErrors({})
      return true
    }
    const newErrors: Partial<Record<keyof BillingInfo, string>> = {}

    if (billing.type === 'privato') {
      if (!billing.codiceFiscale.trim()) newErrors.codiceFiscale = t('required')
      else if (!isValidCodiceFiscale(billing.codiceFiscale)) {
        newErrors.codiceFiscale = t('invoice.invalidCF')
      }
    } else {
      if (!billing.businessName.trim()) newErrors.businessName = t('required')
      if (!billing.partitaIva.trim()) newErrors.partitaIva = t('required')
      else if (!isValidPartitaIva(billing.partitaIva)) {
        newErrors.partitaIva = t('invoice.invalidPiva')
      }
      const hasSdi = billing.sdiCode.trim().length > 0
      const hasPec = billing.pecEmail.trim().length > 0
      if (!hasSdi && !hasPec) {
        newErrors.sdiCode = t('invoice.sdiOrPecRequired')
      } else {
        if (hasSdi && !isValidCodiceSdi(billing.sdiCode)) {
          newErrors.sdiCode = t('invoice.invalidSdi')
        }
        if (hasPec && !isValidEmailFormat(billing.pecEmail)) {
          newErrors.pecEmail = t('invoice.invalidPec')
        }
      }
    }

    setBillingErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleBillingChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target
    setBilling((prev) => ({ ...prev, [name]: value }))
    if (billingErrors[name as keyof BillingInfo]) {
      setBillingErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const handleShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const shippingOk = validateShipping()
    const billingOk = validateBilling()
    if (!shippingOk || !billingOk) return

    setIsProcessing(true)
    setPaymentError('')

    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          shippingZone,
          shippingAddress: formData,
          billing: billing.requested ? billing : undefined,
        }),
      })

      const data = await response.json()

      if (data.clientSecret) {
        setClientSecret(data.clientSecret)
        setStep('payment')
      } else {
        throw new Error(data.error || t('paymentIntentError'))
      }
    } catch (error) {
      console.error('PaymentIntent error:', error)
      setPaymentError(t('paymentError'))
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const code = e.target.value
    const country = COUNTRIES.find((c) => c.code === code)
    setCountryCode(code)
    setFormData((prev) => ({
      ...prev,
      country: country?.name || code,
      province: code !== 'IT' ? '' : prev.province,
    }))
    setShippingZone(getShippingZone(code))
    setErrors((prev) => ({ ...prev, province: undefined }))
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name as keyof ShippingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const inputStyles = `
    w-full bg-transparent border border-gold/30 px-4 py-3
    font-sans text-bianco placeholder:text-bianco/30
    focus:border-gold focus:outline-none transition-colors duration-300
  `

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen bg-nero flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="font-serif text-3xl text-bianco mb-4">
            {t('cartEmpty')}
          </h1>
          <p className="font-sans text-bianco/60 mb-8">
            {t('emptyMessage')}
          </p>
          <Link
            href={`/${locale}/#prodotti`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>{t('backToProducts')}</span>
          </Link>
        </div>
      </div>
    )
  }

  if (step === 'confirmation') {
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
            transition={{ delay: 0.2, type: 'spring' }}
            className="w-20 h-20 mx-auto mb-8 border-2 border-gold rounded-full flex items-center justify-center"
          >
            <Check size={40} className="text-gold" />
          </motion.div>
          <h1 className="font-serif text-4xl text-bianco mb-4">
            {t('orderThanks')}
          </h1>
          <p className="font-sans text-bianco/70 mb-2">
            {t('orderNumber', { number: Math.random().toString(36).substring(2, 10).toUpperCase() })}
          </p>
          <p className="font-sans text-bianco/60 mb-8">
            {t('orderEmailConfirmationPre')}
            <span className="text-gold">{formData.email}</span>
            {t('orderEmailConfirmationPost')}
          </p>
          <div className="p-6 border border-gold/20 mb-8 text-left">
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">
              {t('shippingAddressLabel')}
            </h3>
            <p className="font-sans text-bianco/80">
              {formData.firstName} {formData.lastName}
              <br />
              {formData.address}
              <br />
              {formData.postalCode} {formData.city} ({formData.province})
              <br />
              {formData.country}
            </p>
          </div>
          <Link
            href={`/${locale}`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <span>{t('backToHome')}</span>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-nero">
      {/* Header */}
      <header className="border-b border-gold/20">
        <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
          <Link href={`/${locale}`}>
            <Image
              src="/logo-gbio.svg"
              alt="GBiO"
              width={100}
              height={40}
              className="h-8 w-auto"
            />
          </Link>
          <Link
            href={`/${locale}`}
            className="font-sans text-xs uppercase tracking-[0.2em] text-bianco/60 hover:text-gold transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            {t('backToSite')}
          </Link>
        </div>
      </header>

      {/* Progress Steps */}
      <div className="border-b border-gold/10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-8">
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm',
                  step === 'shipping'
                    ? 'bg-gold text-nero'
                    : 'bg-gold/20 text-gold'
                )}
              >
                1
              </div>
              <span className="font-sans text-sm text-bianco hidden sm:inline">
                {t('stepShipping')}
              </span>
            </div>
            <div className="w-12 h-px bg-gold/30" />
            <div className="flex items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center font-sans text-sm',
                  step === 'payment'
                    ? 'bg-gold text-nero'
                    : 'bg-gold/20 text-gold/50'
                )}
              >
                2
              </div>
              <span className="font-sans text-sm text-bianco hidden sm:inline">
                {t('stepPayment')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-5 gap-12">
          {/* Form Section */}
          <div className="lg:col-span-3">
            {step === 'shipping' && (
              <motion.form
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                onSubmit={handleShippingSubmit}
                className="space-y-8"
              >
                <motion.div variants={staggerItem}>
                  <h2 className="font-serif text-2xl text-bianco mb-6">
                    {t('shippingAddress')}
                  </h2>

                  {/* Login prompt for guests */}
                  {!isAuthenticated && (
                    <div className="mb-6 p-4 border border-gold/30 bg-gold/5">
                      <div className="flex items-center gap-3">
                        <User size={20} className="text-gold" />
                        <div>
                          <p className="font-sans text-sm text-bianco">
                            {t('loginPromptPre')}{' '}
                            <Link
                              href={`/${locale}/auth/login?returnUrl=/${locale}/checkout`}
                              className="text-gold hover:underline"
                            >
                              {t('loginLink')}
                            </Link>
                            {' '}{t('loginPromptPost')}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Saved addresses for logged in users */}
                  {isAuthenticated && user && user.addresses.length > 0 && (
                    <div className="mb-6">
                      <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-3">
                        {t('savedAddresses')}
                      </label>
                      <div className="space-y-3">
                        {user.addresses.map((addr, index) => (
                          <label
                            key={index}
                            className={cn(
                              'block p-4 border cursor-pointer transition-colors',
                              selectedAddressIndex === index
                                ? 'border-gold bg-gold/5'
                                : 'border-gold/20 hover:border-gold/40'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              <input
                                type="radio"
                                name="savedAddress"
                                checked={selectedAddressIndex === index}
                                onChange={() => {
                                  setSelectedAddressIndex(index)
                                  setFormData(addr)
                                }}
                                className="mt-1 accent-gold"
                              />
                              <div>
                                <p className="font-sans text-bianco">
                                  {addr.firstName} {addr.lastName}
                                </p>
                                <p className="font-sans text-sm text-bianco/60">
                                  {addr.address}, {addr.postalCode} {addr.city} ({addr.province})
                                </p>
                              </div>
                            </div>
                          </label>
                        ))}
                        <label
                          className={cn(
                            'block p-4 border cursor-pointer transition-colors',
                            selectedAddressIndex === null
                              ? 'border-gold bg-gold/5'
                              : 'border-gold/20 hover:border-gold/40'
                          )}
                        >
                          <div className="flex items-center gap-3">
                            <input
                              type="radio"
                              name="savedAddress"
                              checked={selectedAddressIndex === null}
                              onChange={() => {
                                setSelectedAddressIndex(null)
                                setCountryCode('IT')
                                setShippingZone('italia')
                                setFormData({
                                  firstName: user.firstName,
                                  lastName: user.lastName,
                                  email: user.email,
                                  phone: user.phone || '',
                                  address: '',
                                  city: '',
                                  province: '',
                                  postalCode: '',
                                  country: 'Italia',
                                })
                              }}
                              className="accent-gold"
                            />
                            <span className="font-sans text-bianco">
                              {t('useNewAddress')}
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                        {t('firstName')} *
                      </label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={cn(inputStyles, errors.firstName && 'border-red-400')}
                        placeholder={t('placeholders.firstName')}
                      />
                      {errors.firstName && (
                        <p className="text-red-400 text-xs mt-1">{errors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                        {t('lastName')} *
                      </label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={cn(inputStyles, errors.lastName && 'border-red-400')}
                        placeholder={t('placeholders.lastName')}
                      />
                      {errors.lastName && (
                        <p className="text-red-400 text-xs mt-1">{errors.lastName}</p>
                      )}
                    </div>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem} className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                      {t('email')} *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={cn(inputStyles, errors.email && 'border-red-400')}
                      placeholder={t('placeholders.email')}
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                      {t('phone')} *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={cn(inputStyles, errors.phone && 'border-red-400')}
                      placeholder={t('placeholders.phone')}
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                    {t('address')} *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={cn(inputStyles, errors.address && 'border-red-400')}
                    placeholder={t('placeholders.address')}
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                  )}
                </motion.div>

                <motion.div variants={staggerItem}>
                  <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                    {t('country')} *
                  </label>
                  <select
                    value={countryCode}
                    onChange={handleCountryChange}
                    className={cn(inputStyles, 'appearance-none')}
                  >
                    {COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-nero">
                        {c.name}
                      </option>
                    ))}
                  </select>
                </motion.div>

                <motion.div variants={staggerItem} className={cn('grid gap-6', countryCode === 'IT' ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                      {t('city')} *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={cn(inputStyles, errors.city && 'border-red-400')}
                      placeholder={t('placeholders.city')}
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  {countryCode === 'IT' && (
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                        {t('province')} *
                      </label>
                      <select
                        name="province"
                        value={formData.province}
                        onChange={handleChange}
                        className={cn(inputStyles, 'appearance-none', errors.province && 'border-red-400')}
                      >
                        <option value="" className="bg-nero">{t('selectPlaceholder')}</option>
                        {provinces.map((prov) => (
                          <option key={prov} value={prov} className="bg-nero">
                            {prov}
                          </option>
                        ))}
                      </select>
                      {errors.province && (
                        <p className="text-red-400 text-xs mt-1">{errors.province}</p>
                      )}
                    </div>
                  )}
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                      {countryCode === 'IT' ? t('postalCode') : t('postalCodeIntl')} *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      maxLength={countryCode === 'IT' ? 5 : 10}
                      className={cn(inputStyles, errors.postalCode && 'border-red-400')}
                      placeholder={countryCode === 'IT' ? t('placeholders.postalCode') : ''}
                    />
                    {errors.postalCode && (
                      <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                    {t('deliveryNotes')}
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className={cn(inputStyles, 'resize-none')}
                    placeholder={t('deliveryNotesPlaceholder')}
                  />
                </motion.div>

                {/* Richiesta fattura (art. 22 DPR 633/72: va richiesta al momento dell'ordine) */}
                <motion.div variants={staggerItem} className="border border-gold/20 p-5 space-y-5">
                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={billing.requested}
                      onChange={(e) => {
                        setBilling((prev) => ({ ...prev, requested: e.target.checked }))
                        if (!e.target.checked) setBillingErrors({})
                      }}
                      className="mt-1 accent-gold"
                    />
                    <span>
                      <span className="font-sans text-sm text-bianco block">
                        {t('invoice.request')}
                      </span>
                      <span className="font-sans text-xs text-bianco/50 block mt-1">
                        {t('invoice.hint')}
                      </span>
                    </span>
                  </label>

                  {billing.requested && (
                    <div className="space-y-5">
                      <div className="flex gap-6">
                        {(['privato', 'azienda'] as const).map((type) => (
                          <label key={type} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="radio"
                              name="billingType"
                              checked={billing.type === type}
                              onChange={() => {
                                setBilling((prev) => ({ ...prev, type }))
                                setBillingErrors({})
                              }}
                              className="accent-gold"
                            />
                            <span className="font-sans text-sm text-bianco/80">
                              {t(`invoice.type_${type}`)}
                            </span>
                          </label>
                        ))}
                      </div>

                      {billing.type === 'privato' ? (
                        <div>
                          <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                            {t('invoice.codiceFiscale')} *
                          </label>
                          <input
                            type="text"
                            name="codiceFiscale"
                            value={billing.codiceFiscale}
                            onChange={handleBillingChange}
                            maxLength={16}
                            autoCapitalize="characters"
                            className={cn(inputStyles, 'uppercase', billingErrors.codiceFiscale && 'border-red-400')}
                            placeholder="RSSMRA80A01G482R"
                          />
                          {billingErrors.codiceFiscale && (
                            <p className="text-red-400 text-xs mt-1">{billingErrors.codiceFiscale}</p>
                          )}
                        </div>
                      ) : (
                        <>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                                {t('invoice.businessName')} *
                              </label>
                              <input
                                type="text"
                                name="businessName"
                                value={billing.businessName}
                                onChange={handleBillingChange}
                                className={cn(inputStyles, billingErrors.businessName && 'border-red-400')}
                              />
                              {billingErrors.businessName && (
                                <p className="text-red-400 text-xs mt-1">{billingErrors.businessName}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                                {t('invoice.partitaIva')} *
                              </label>
                              <input
                                type="text"
                                name="partitaIva"
                                value={billing.partitaIva}
                                onChange={handleBillingChange}
                                maxLength={13}
                                inputMode="numeric"
                                className={cn(inputStyles, billingErrors.partitaIva && 'border-red-400')}
                                placeholder="02773610692"
                              />
                              {billingErrors.partitaIva && (
                                <p className="text-red-400 text-xs mt-1">{billingErrors.partitaIva}</p>
                              )}
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-6">
                            <div>
                              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                                {t('invoice.sdiCode')}
                              </label>
                              <input
                                type="text"
                                name="sdiCode"
                                value={billing.sdiCode}
                                onChange={handleBillingChange}
                                maxLength={7}
                                autoCapitalize="characters"
                                className={cn(inputStyles, 'uppercase', billingErrors.sdiCode && 'border-red-400')}
                                placeholder="M5UXCR1"
                              />
                              {billingErrors.sdiCode && (
                                <p className="text-red-400 text-xs mt-1">{billingErrors.sdiCode}</p>
                              )}
                            </div>
                            <div>
                              <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                                {t('invoice.pecEmail')}
                              </label>
                              <input
                                type="email"
                                name="pecEmail"
                                value={billing.pecEmail}
                                onChange={handleBillingChange}
                                className={cn(inputStyles, billingErrors.pecEmail && 'border-red-400')}
                                placeholder="azienda@pec.it"
                              />
                              {billingErrors.pecEmail && (
                                <p className="text-red-400 text-xs mt-1">{billingErrors.pecEmail}</p>
                              )}
                            </div>
                          </div>
                          <p className="font-sans text-xs text-bianco/50">
                            {t('invoice.sdiOrPecHint')}
                          </p>
                        </>
                      )}
                    </div>
                  )}
                </motion.div>

                <motion.div variants={staggerItem}>
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={cn(
                      'btn-primary w-full md:w-auto flex items-center justify-center gap-2',
                      isProcessing && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>{t('loading')}</span>
                      </>
                    ) : (
                      <span>{t('continueToPayment')}</span>
                    )}
                  </button>
                  {paymentError && (
                    <div className="mt-4 p-4 border border-burgundy bg-burgundy/20 text-center">
                      <p className="font-sans text-sm text-bianco">{paymentError}</p>
                    </div>
                  )}
                </motion.div>
              </motion.form>
            )}

            {step === 'payment' && clientSecret && (
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="space-y-8"
              >
                <motion.div variants={staggerItem}>
                  <button
                    onClick={() => setStep('shipping')}
                    className="font-sans text-xs uppercase tracking-[0.2em] text-gold/60 hover:text-gold transition-colors flex items-center gap-2 mb-6"
                  >
                    <ArrowLeft size={14} />
                    {t('editAddress')}
                  </button>

                  <h2 className="font-serif text-2xl text-bianco mb-2">
                    {t('paymentMethod')}
                  </h2>
                  <p className="font-sans text-bianco/60 mb-6">
                    {t('shippingTo')} {formData.firstName} {formData.lastName}, {formData.city}
                  </p>
                </motion.div>

                {/* Stripe Payment Element inline */}
                <motion.div variants={staggerItem}>
                  <StripePaymentForm
                    clientSecret={clientSecret}
                    total={formatPrice(total)}
                    locale={locale}
                    returnUrl={`${window.location.origin}/${locale}/checkout/success`}
                  />
                </motion.div>

                {/* Security badges */}
                <motion.div variants={staggerItem} className="flex items-center gap-6 text-bianco/40">
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span className="text-xs">{t('secureSSL')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} />
                    <span className="text-xs">{t('buyerProtection')}</span>
                  </div>
                </motion.div>

                {/* PayPal - Coming soon */}
                <motion.div variants={staggerItem} className="space-y-3">
                  <div className="block border p-4 border-gold/10 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 bg-[#0070ba] rounded flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                      <div>
                        <p className="font-sans text-bianco/50 text-sm">PayPal</p>
                        <p className="font-sans text-xs text-bianco/30">{t('comingSoon')}</p>
                      </div>
                    </div>
                  </div>
                  <div className="block border p-4 border-gold/10 opacity-50 cursor-not-allowed">
                    <div className="flex items-center gap-4">
                      <Truck size={20} className="text-gold/30" />
                      <div>
                        <p className="font-sans text-bianco/50 text-sm">{t('cashOnDelivery')}</p>
                        <p className="font-sans text-xs text-bianco/30">{t('comingSoon')}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}

          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 border border-gold/20 p-6">
              <h3 className="font-serif text-xl text-bianco mb-6">
                {t('orderSummary')}
              </h3>

              <ul className="space-y-4 mb-6">
                {items.map((item) => (
                  <li key={item.product.id} className="flex gap-4">
                    <div className="w-16 h-16 bg-nero flex-shrink-0 relative overflow-hidden border border-gold/10">
                      <Image
                        src={item.product.image}
                        alt={item.product.name}
                        fill
                        className="object-contain"
                        sizes="64px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-serif text-bianco truncate">
                        {item.product.name}
                      </h4>
                      <p className="font-sans text-xs text-bianco/50">
                        {t('quantity')}: {item.quantity}
                      </p>
                    </div>
                    <p className="font-sans text-bianco">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="border-t border-gold/20 pt-4 space-y-3">
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
                <div className="flex justify-between font-serif text-xl pt-3 border-t border-gold/20">
                  <span className="text-bianco">{t('total')}</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
                <p className="font-sans text-[11px] text-bianco/40 text-right">
                  {t('vatIncluded')}
                </p>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gold/10 space-y-3">
                <div className="flex items-center gap-3 text-bianco/50">
                  <Truck size={16} />
                  <span className="text-xs">
                    {freeShippingThreshold !== null
                      ? t('freeShippingAbove', { amount: freeShippingThreshold })
                      : t('extraEuFlatRate')}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-bianco/50">
                  <Shield size={16} />
                  <span className="text-xs">{t('securePayment')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <CheckoutContent />
  )
}
