'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { CustomCursor } from '@/components/layout/CustomCursor'
import { GrainOverlay } from '@/components/layout/GrainOverlay'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-nero flex">
      <CustomCursor />
      <GrainOverlay />

      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-forest-dark" />
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 flex flex-col justify-center items-center w-full p-12 text-center">
          <Link href="/" className="font-serif text-6xl text-gold mb-6">
            GBiO
          </Link>
          <p className="font-sans text-bianco/70 text-lg max-w-md leading-relaxed">
            Entra nel mondo dell&apos;eccellenza biologica abruzzese.
            Tre generazioni di passione per la terra.
          </p>
          <div className="mt-12 flex gap-8">
            <div className="text-center">
              <span className="font-serif text-4xl text-gold">70+</span>
              <p className="font-sans text-xs text-bianco/50 mt-1">Anni di Storia</p>
            </div>
            <div className="text-center">
              <span className="font-serif text-4xl text-gold">51</span>
              <p className="font-sans text-xs text-bianco/50 mt-1">Ettari</p>
            </div>
            <div className="text-center">
              <span className="font-serif text-4xl text-gold">100%</span>
              <p className="font-sans text-xs text-bianco/50 mt-1">Biologico</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full lg:w-1/2 flex flex-col">
        <div className="p-6 lg:p-8">
          <Link
            href="/"
            className="font-serif text-2xl text-gold lg:hidden"
          >
            GBiO
          </Link>
        </div>
        <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
          {children}
        </div>
      </div>
    </div>
  )
}
