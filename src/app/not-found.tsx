'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23c9a961' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Decorative lines */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#c9a961]/20 to-transparent" />
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-[#c9a961]/20 to-transparent" />

      <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
        {/* 404 Number */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          className="relative mb-8"
        >
          <span className="font-serif text-[12rem] md:text-[16rem] leading-none text-[#c9a961]/10 select-none">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="font-serif text-6xl md:text-8xl text-[#c9a961]">
              404
            </span>
          </div>
        </motion.div>

        {/* Decorative line */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="w-24 h-px bg-[#c9a961] mx-auto mb-8"
        />

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="font-serif text-3xl md:text-4xl text-[#f5f5f0] mb-4"
        >
          Pagina non trovata
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="font-sans text-[#f5f5f0]/60 mb-12 leading-relaxed"
        >
          La pagina che cerchi non esiste o è stata spostata.
          <br />
          Torna alla homepage per continuare l&apos;esperienza.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/it"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c9a961] text-[#0a0a0a] font-sans text-sm uppercase tracking-wider hover:bg-[#d4b872] transition-colors"
          >
            <Home size={16} />
            <span>Torna alla Home</span>
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 px-6 py-3 border border-[#c9a961]/30 text-[#c9a961] hover:border-[#c9a961] hover:bg-[#c9a961]/10 transition-all duration-300"
          >
            <ArrowLeft size={16} />
            <span className="font-sans text-sm uppercase tracking-wider">
              Torna Indietro
            </span>
          </button>
        </motion.div>

        {/* Bottom quote */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 font-serif text-sm text-[#c9a961]/40 italic"
        >
          {`"Non vendo prodotti. Condivido ciò in cui credo."`}
        </motion.p>
      </div>

      {/* Corner decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-[#c9a961]/20" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-[#c9a961]/20" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-[#c9a961]/20" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-[#c9a961]/20" />
    </div>
  )
}
