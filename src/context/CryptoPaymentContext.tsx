'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from 'react'
import {
  CryptoCurrency,
  cryptoWallets,
  PAYMENT_WINDOW_MINUTES,
} from '@/lib/crypto/config'
import { convertEurToCrypto, getCryptoPrice } from '@/lib/crypto/prices'

interface CryptoPaymentState {
  isOpen: boolean
  selectedCrypto: CryptoCurrency | null
  eurAmount: number
  cryptoAmount: string | null
  walletAddress: string | null
  network: string | null
  expiresAt: Date | null
  isLoading: boolean
  error: string | null
}

interface CryptoPaymentContextValue extends CryptoPaymentState {
  openPayment: (eurAmount: number) => void
  closePayment: () => void
  selectCrypto: (crypto: CryptoCurrency) => Promise<void>
  confirmPayment: () => void
  resetPayment: () => void
  timeRemaining: number // seconds
}

const initialState: CryptoPaymentState = {
  isOpen: false,
  selectedCrypto: null,
  eurAmount: 0,
  cryptoAmount: null,
  walletAddress: null,
  network: null,
  expiresAt: null,
  isLoading: false,
  error: null,
}

const CryptoPaymentContext = createContext<CryptoPaymentContextValue | null>(null)

export function CryptoPaymentProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<CryptoPaymentState>(initialState)
  const [timeRemaining, setTimeRemaining] = useState(0)

  // Timer effect
  useEffect(() => {
    if (!state.expiresAt) {
      setTimeRemaining(0)
      return
    }

    const updateTimer = () => {
      const now = new Date()
      const remaining = Math.max(
        0,
        Math.floor((state.expiresAt!.getTime() - now.getTime()) / 1000)
      )
      setTimeRemaining(remaining)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)

    return () => clearInterval(interval)
  }, [state.expiresAt])

  const openPayment = useCallback((eurAmount: number) => {
    setState((prev) => ({
      ...prev,
      isOpen: true,
      eurAmount,
      selectedCrypto: null,
      cryptoAmount: null,
      walletAddress: null,
      network: null,
      expiresAt: null,
      error: null,
    }))
  }, [])

  const closePayment = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isOpen: false,
    }))
  }, [])

  const selectCrypto = useCallback(
    async (crypto: CryptoCurrency) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }))

      try {
        const conversion = await convertEurToCrypto(state.eurAmount, crypto)

        if (!conversion) {
          throw new Error('Failed to convert currency')
        }

        const config = cryptoWallets[crypto]
        const expiresAt = new Date(
          Date.now() + PAYMENT_WINDOW_MINUTES * 60 * 1000
        )

        setState((prev) => ({
          ...prev,
          selectedCrypto: crypto,
          cryptoAmount: conversion.formattedAmount,
          walletAddress: config.address,
          network: config.network,
          expiresAt,
          isLoading: false,
        }))
      } catch (error) {
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: 'Failed to load payment details. Please try again.',
        }))
      }
    },
    [state.eurAmount]
  )

  const confirmPayment = useCallback(() => {
    // In a real implementation, this would mark the order as pending
    // and redirect to a confirmation page
    console.log('Payment confirmed:', {
      crypto: state.selectedCrypto,
      amount: state.cryptoAmount,
      walletAddress: state.walletAddress,
    })

    // Close the modal - the actual order processing would happen server-side
    closePayment()
  }, [state.selectedCrypto, state.cryptoAmount, state.walletAddress, closePayment])

  const resetPayment = useCallback(() => {
    setState(initialState)
    setTimeRemaining(0)
  }, [])

  const value: CryptoPaymentContextValue = {
    ...state,
    openPayment,
    closePayment,
    selectCrypto,
    confirmPayment,
    resetPayment,
    timeRemaining,
  }

  return (
    <CryptoPaymentContext.Provider value={value}>
      {children}
    </CryptoPaymentContext.Provider>
  )
}

export function useCryptoPayment() {
  const context = useContext(CryptoPaymentContext)
  if (!context) {
    throw new Error('useCryptoPayment must be used within a CryptoPaymentProvider')
  }
  return context
}
