'use client'

import { ReactNode } from 'react'
import { CartProvider } from '@/context/CartContext'
import { AuthProvider } from '@/context/AuthContext'
import { CryptoPaymentProvider } from '@/context/CryptoPaymentContext'

export function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <CartProvider>
        <CryptoPaymentProvider>{children}</CryptoPaymentProvider>
      </CartProvider>
    </AuthProvider>
  )
}
