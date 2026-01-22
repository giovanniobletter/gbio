'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Copy, Check, Clock, AlertCircle, Loader2 } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'
import { useCryptoPayment } from '@/context/CryptoPaymentContext'
import {
  CryptoCurrency,
  supportedCryptos,
  cryptoWallets,
  cryptoColors,
} from '@/lib/crypto/config'
import { cn } from '@/lib/utils'

interface CryptoPaymentModalProps {
  eurAmount: number
  onClose: () => void
  onConfirm: () => void
}

export function CryptoPaymentModal({
  eurAmount,
  onClose,
  onConfirm,
}: CryptoPaymentModalProps) {
  const {
    selectedCrypto,
    cryptoAmount,
    walletAddress,
    network,
    expiresAt,
    isLoading,
    error,
    timeRemaining,
    selectCrypto,
    confirmPayment,
  } = useCryptoPayment()

  const [copied, setCopied] = useState(false)
  const [step, setStep] = useState<'select' | 'pay'>('select')

  useEffect(() => {
    if (selectedCrypto && cryptoAmount) {
      setStep('pay')
    }
  }, [selectedCrypto, cryptoAmount])

  const handleCopyAddress = async () => {
    if (!walletAddress) return

    try {
      await navigator.clipboard.writeText(walletAddress)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const handleSelectCrypto = async (crypto: CryptoCurrency) => {
    await selectCrypto(crypto)
  }

  const handleConfirm = () => {
    confirmPayment()
    onConfirm()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const isExpired = timeRemaining <= 0 && expiresAt !== null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-nero/90 backdrop-blur-sm z-[300] flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-nero border border-gold/30 w-full max-w-lg max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gold/20">
            <h2 className="font-serif text-xl text-bianco">
              {step === 'select' ? 'Seleziona Criptovaluta' : `Paga con ${selectedCrypto}`}
            </h2>
            <button
              onClick={onClose}
              className="text-bianco/60 hover:text-gold transition-colors p-2"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            {error && (
              <div className="mb-6 p-4 border border-red-400/50 bg-red-400/10 flex items-center gap-3">
                <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {step === 'select' && (
              <div className="space-y-3">
                <p className="font-sans text-bianco/60 text-sm mb-4">
                  Importo da pagare: <span className="text-gold">{eurAmount.toFixed(2)}</span>
                </p>

                {supportedCryptos.map((crypto) => {
                  const config = cryptoWallets[crypto]
                  const colors = cryptoColors[crypto]

                  return (
                    <motion.button
                      key={crypto}
                      onClick={() => handleSelectCrypto(crypto)}
                      disabled={isLoading}
                      whileHover={{ scale: isLoading ? 1 : 1.02 }}
                      whileTap={{ scale: isLoading ? 1 : 0.98 }}
                      className={cn(
                        'w-full p-4 border border-gold/20 hover:border-gold/50 transition-all flex items-center gap-4',
                        isLoading && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {crypto.charAt(0)}
                      </div>
                      <div className="text-left flex-1">
                        <p className="font-sans text-bianco">{config.name}</p>
                        <p className="font-sans text-xs text-bianco/50">
                          {config.network}
                        </p>
                      </div>
                      <span className="font-sans text-xs text-gold uppercase tracking-wider">
                        {crypto}
                      </span>
                    </motion.button>
                  )
                })}

                {isLoading && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 size={24} className="text-gold animate-spin" />
                  </div>
                )}
              </div>
            )}

            {step === 'pay' && selectedCrypto && (
              <div className="space-y-6">
                {/* Timer */}
                {!isExpired && (
                  <div className="flex items-center justify-center gap-2 text-gold">
                    <Clock size={16} />
                    <span className="font-mono text-sm">
                      Tempo rimanente: {formatTime(timeRemaining)}
                    </span>
                  </div>
                )}

                {isExpired && (
                  <div className="p-4 border border-red-400/50 bg-red-400/10 text-center">
                    <p className="text-red-400 font-sans">
                      Tempo scaduto. Per favore riprova.
                    </p>
                    <button
                      onClick={() => {
                        setStep('select')
                      }}
                      className="mt-3 text-gold hover:text-gold-light text-sm underline"
                    >
                      Riprova
                    </button>
                  </div>
                )}

                {!isExpired && (
                  <>
                    {/* Amount to pay */}
                    <div className="text-center">
                      <p className="font-sans text-xs text-bianco/50 uppercase tracking-wider mb-1">
                        Importo da pagare
                      </p>
                      <p
                        className="font-mono text-3xl font-bold"
                        style={{ color: cryptoColors[selectedCrypto].primary }}
                      >
                        {cryptoAmount} {selectedCrypto}
                      </p>
                      <p className="font-sans text-xs text-bianco/40 mt-1">
                        ~{eurAmount.toFixed(2)} EUR
                      </p>
                    </div>

                    {/* QR Code */}
                    <div className="flex justify-center">
                      <div className="bg-bianco p-4 rounded-lg">
                        <QRCodeSVG
                          value={walletAddress || ''}
                          size={180}
                          level="H"
                          fgColor="#0a0a0a"
                          bgColor="#ffffff"
                        />
                      </div>
                    </div>

                    {/* Network info */}
                    <div className="text-center">
                      <p className="font-sans text-xs text-bianco/50">
                        Network: <span className="text-gold">{network}</span>
                      </p>
                    </div>

                    {/* Wallet address */}
                    <div>
                      <p className="font-sans text-xs text-bianco/50 uppercase tracking-wider mb-2">
                        Indirizzo Wallet
                      </p>
                      <div className="flex items-center gap-2">
                        <code className="flex-1 bg-charcoal p-3 text-xs text-bianco/70 break-all font-mono border border-gold/10">
                          {walletAddress}
                        </code>
                        <button
                          onClick={handleCopyAddress}
                          className="p-3 border border-gold/30 text-gold hover:bg-gold/10 transition-colors flex-shrink-0"
                        >
                          {copied ? <Check size={16} /> : <Copy size={16} />}
                        </button>
                      </div>
                      {copied && (
                        <p className="text-xs text-green-400 mt-1">
                          Copiato negli appunti!
                        </p>
                      )}
                    </div>

                    {/* Instructions */}
                    <div className="p-4 border border-gold/20 bg-gold/5">
                      <p className="font-sans text-xs text-bianco/70 leading-relaxed">
                        Invia l&apos;importo esatto all&apos;indirizzo sopra indicato.
                        La transazione verrà verificata manualmente.
                        Non chiudere questa finestra fino a completamento del pagamento.
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => setStep('select')}
                        className="flex-1 py-3 border border-gold/30 text-bianco/60 hover:text-bianco transition-colors text-sm"
                      >
                        Indietro
                      </button>
                      <button
                        onClick={handleConfirm}
                        className="flex-1 btn-primary"
                      >
                        <span>Ho effettuato il pagamento</span>
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
