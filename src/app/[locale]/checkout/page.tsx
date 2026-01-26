'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import {
  ArrowLeft,
  CreditCard,
  Truck,
  Shield,
  Check,
  Loader2,
  User,
} from 'lucide-react'
import { useCart } from '@/context/CartContext'
import { useAuth } from '@/context/AuthContext'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { staggerContainer, staggerItem } from '@/lib/animations'
import { cn } from '@/lib/utils'
import { ShippingAddress } from '@/types'

type PaymentMethod = 'card' | 'paypal' | 'cod'

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
  const { items, subtotal, shipping, total, clearCart } = useCart()
  const { user, isAuthenticated } = useAuth()
  const [step, setStep] = useState<'shipping' | 'payment' | 'confirmation'>('shipping')
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedAddressIndex, setSelectedAddressIndex] = useState<number | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card')
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
  const [errors, setErrors] = useState<Partial<ShippingAddress>>({})

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
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR',
    }).format(price)
  }

  const validateShipping = () => {
    const newErrors: Partial<ShippingAddress> = {}

    if (!formData.firstName.trim()) newErrors.firstName = 'Obbligatorio'
    if (!formData.lastName.trim()) newErrors.lastName = 'Obbligatorio'
    if (!formData.email.trim()) newErrors.email = 'Obbligatorio'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email non valida'
    }
    if (!formData.phone.trim()) newErrors.phone = 'Obbligatorio'
    if (!formData.address.trim()) newErrors.address = 'Obbligatorio'
    if (!formData.city.trim()) newErrors.city = 'Obbligatorio'
    if (!formData.province.trim()) newErrors.province = 'Obbligatorio'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'Obbligatorio'
    else if (!/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'CAP non valido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateShipping()) {
      setStep('payment')
    }
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setIsProcessing(false)
    setStep('confirmation')
    clearCart()
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
            Il carrello è vuoto
          </h1>
          <p className="font-sans text-bianco/60 mb-8">
            Aggiungi dei prodotti per procedere al checkout
          </p>
          <Link
            href={`/${locale}/#prodotti`}
            className="btn-primary inline-flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            <span>Torna ai Prodotti</span>
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
            Grazie per il tuo ordine!
          </h1>
          <p className="font-sans text-bianco/70 mb-2">
            Ordine #{Math.random().toString(36).substring(2, 10).toUpperCase()}
          </p>
          <p className="font-sans text-bianco/60 mb-8">
            Riceverai una email di conferma a{' '}
            <span className="text-gold">{formData.email}</span> con tutti i
            dettagli del tuo ordine.
          </p>
          <div className="p-6 border border-gold/20 mb-8 text-left">
            <h3 className="font-sans text-xs uppercase tracking-[0.2em] text-gold mb-4">
              Indirizzo di spedizione
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
            <span>Torna alla Home</span>
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
          <Link href={`/${locale}`} className="font-serif text-2xl text-gold">
            GBiO
          </Link>
          <Link
            href={`/${locale}`}
            className="font-sans text-xs uppercase tracking-[0.2em] text-bianco/60 hover:text-gold transition-colors flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Torna al sito
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
                Spedizione
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
                Pagamento
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
                    Indirizzo di Spedizione
                  </h2>

                  {/* Login prompt for guests */}
                  {!isAuthenticated && (
                    <div className="mb-6 p-4 border border-gold/30 bg-gold/5">
                      <div className="flex items-center gap-3">
                        <User size={20} className="text-gold" />
                        <div>
                          <p className="font-sans text-sm text-bianco">
                            Hai già un account?{' '}
                            <Link
                              href={`/${locale}/auth/login?returnUrl=/${locale}/checkout`}
                              className="text-gold hover:underline"
                            >
                              Accedi
                            </Link>
                            {' '}per un checkout più veloce.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Saved addresses for logged in users */}
                  {isAuthenticated && user && user.addresses.length > 0 && (
                    <div className="mb-6">
                      <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-3">
                        Indirizzi salvati
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
                              Usa un nuovo indirizzo
                            </span>
                          </div>
                        </label>
                      </div>
                    </div>
                  )}

                  <div className="grid md:grid-cols-2 gap-6">
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
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={cn(inputStyles, errors.email && 'border-red-400')}
                      placeholder="mario.rossi@email.it"
                    />
                    {errors.email && (
                      <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                      Telefono *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={cn(inputStyles, errors.phone && 'border-red-400')}
                      placeholder="+39 333 123 4567"
                    />
                    {errors.phone && (
                      <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                    Indirizzo *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={cn(inputStyles, errors.address && 'border-red-400')}
                    placeholder="Via Roma, 123"
                  />
                  {errors.address && (
                    <p className="text-red-400 text-xs mt-1">{errors.address}</p>
                  )}
                </motion.div>

                <motion.div variants={staggerItem} className="grid md:grid-cols-3 gap-6">
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                      Città *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={cn(inputStyles, errors.city && 'border-red-400')}
                      placeholder="Roma"
                    />
                    {errors.city && (
                      <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                      Provincia *
                    </label>
                    <select
                      name="province"
                      value={formData.province}
                      onChange={handleChange}
                      className={cn(inputStyles, 'appearance-none', errors.province && 'border-red-400')}
                    >
                      <option value="" className="bg-nero">Seleziona...</option>
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
                  <div>
                    <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                      CAP *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      maxLength={5}
                      className={cn(inputStyles, errors.postalCode && 'border-red-400')}
                      placeholder="00100"
                    />
                    {errors.postalCode && (
                      <p className="text-red-400 text-xs mt-1">{errors.postalCode}</p>
                    )}
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                    Note per la consegna
                  </label>
                  <textarea
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={3}
                    className={cn(inputStyles, 'resize-none')}
                    placeholder="Citofono, piano, orari preferiti..."
                  />
                </motion.div>

                <motion.div variants={staggerItem}>
                  <button type="submit" className="btn-primary w-full md:w-auto">
                    <span>Continua al Pagamento</span>
                  </button>
                </motion.div>
              </motion.form>
            )}

            {step === 'payment' && (
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
                    Modifica indirizzo
                  </button>

                  <h2 className="font-serif text-2xl text-bianco mb-2">
                    Metodo di Pagamento
                  </h2>
                  <p className="font-sans text-bianco/60 mb-6">
                    Spedizione a: {formData.firstName} {formData.lastName}, {formData.city}
                  </p>
                </motion.div>

                {/* Payment Methods */}
                <motion.div variants={staggerItem} className="space-y-4">
                  <label
                    className={cn(
                      'block border p-6 cursor-pointer transition-colors',
                      paymentMethod === 'card'
                        ? 'border-gold bg-gold/5'
                        : 'border-gold/30 hover:border-gold/60'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="w-4 h-4 accent-gold"
                      />
                      <CreditCard size={24} className="text-gold" />
                      <div>
                        <p className="font-sans text-bianco">Carta di Credito</p>
                        <p className="font-sans text-xs text-bianco/50">
                          Visa, Mastercard, American Express
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={cn(
                      'block border p-6 cursor-pointer transition-colors',
                      paymentMethod === 'paypal'
                        ? 'border-gold bg-gold/5'
                        : 'border-gold/30 hover:border-gold/60'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="w-4 h-4 accent-gold"
                      />
                      <div className="w-6 h-6 bg-[#0070ba] rounded flex items-center justify-center text-white text-xs font-bold">
                        P
                      </div>
                      <div>
                        <p className="font-sans text-bianco">PayPal</p>
                        <p className="font-sans text-xs text-bianco/50">
                          Paga in sicurezza con PayPal
                        </p>
                      </div>
                    </div>
                  </label>

                  <label
                    className={cn(
                      'block border p-6 cursor-pointer transition-colors',
                      paymentMethod === 'cod'
                        ? 'border-gold bg-gold/5'
                        : 'border-gold/30 hover:border-gold/60'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="w-4 h-4 accent-gold"
                      />
                      <Truck size={24} className="text-gold/60" />
                      <div>
                        <p className="font-sans text-bianco">Contrassegno</p>
                        <p className="font-sans text-xs text-bianco/50">
                          Paga alla consegna (+3,00€)
                        </p>
                      </div>
                    </div>
                  </label>

                </motion.div>

                {/* Card Details (simplified) - only show when card is selected */}
                {paymentMethod === 'card' && (
                  <motion.div variants={staggerItem} className="space-y-6 p-6 border border-gold/20">
                    <div>
                      <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                        Numero Carta
                      </label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className={inputStyles}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                          Scadenza
                        </label>
                        <input
                          type="text"
                          placeholder="MM/AA"
                          className={inputStyles}
                        />
                      </div>
                      <div>
                        <label className="block font-sans text-xs uppercase tracking-[0.2em] text-gold/60 mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          placeholder="123"
                          className={inputStyles}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Security badges */}
                <motion.div variants={staggerItem} className="flex items-center gap-6 text-bianco/40">
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    <span className="text-xs">Pagamento sicuro SSL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check size={16} />
                    <span className="text-xs">Protezione acquirente</span>
                  </div>
                </motion.div>

                <motion.div variants={staggerItem}>
                  <button
                    onClick={handlePayment}
                    disabled={isProcessing}
                    className={cn(
                      'btn-primary w-full flex items-center justify-center gap-2',
                      isProcessing && 'opacity-50 cursor-not-allowed'
                    )}
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        <span>Elaborazione...</span>
                      </>
                    ) : (
                      <span>Paga {formatPrice(total)}</span>
                    )}
                  </button>
                </motion.div>
              </motion.div>
            )}

          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="sticky top-8 border border-gold/20 p-6">
              <h3 className="font-serif text-xl text-bianco mb-6">
                Riepilogo Ordine
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
                        Qtà: {item.quantity}
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
                  <span className="text-bianco/60">Subtotale</span>
                  <span className="text-bianco">{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between font-sans text-sm">
                  <span className="text-bianco/60">Spedizione</span>
                  <span className="text-bianco">
                    {shipping === 0 ? (
                      <span className="text-forest">Gratuita</span>
                    ) : (
                      formatPrice(shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between font-serif text-xl pt-3 border-t border-gold/20">
                  <span className="text-bianco">Totale</span>
                  <span className="text-gold">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Trust badges */}
              <div className="mt-6 pt-6 border-t border-gold/10 space-y-3">
                <div className="flex items-center gap-3 text-bianco/50">
                  <Truck size={16} />
                  <span className="text-xs">Spedizione gratuita sopra i 50€</span>
                </div>
                <div className="flex items-center gap-3 text-bianco/50">
                  <Shield size={16} />
                  <span className="text-xs">Pagamento 100% sicuro</span>
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
    <>
      <CustomCursor />
      <CheckoutContent />
    </>
  )
}
