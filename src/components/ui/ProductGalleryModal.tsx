'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import { Product } from '@/types'

interface ProductGalleryModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export function ProductGalleryModal({
  product,
  isOpen,
  onClose,
  initialIndex = 0,
}: ProductGalleryModalProps) {
  // Get all images - use images array if available, otherwise just the main image
  const allImages = product.images?.length ? product.images : [product.image]

  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [isOpen, initialIndex])

  const goToPrevious = useCallback(() => {
    if (allImages.length <= 1) return
    setCurrentIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))
  }, [allImages.length])

  const goToNext = useCallback(() => {
    if (allImages.length <= 1) return
    setCurrentIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))
  }, [allImages.length])

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowLeft') {
        goToPrevious()
      } else if (e.key === 'ArrowRight') {
        goToNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose, goToPrevious, goToNext])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center"
        >
          {/* Backdrop - click to close */}
          <div
            className="absolute inset-0 bg-nero/95 backdrop-blur-md cursor-pointer"
            onClick={onClose}
          />


          {/* Main Image Container */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full h-full max-w-4xl max-h-[70vh] mx-4 my-24 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button - Top Right of Image */}
            <button
              onClick={onClose}
              className="absolute -top-2 -right-2 z-50 p-3 bg-gold text-nero hover:bg-gold-light transition-colors"
            >
              <X size={24} />
            </button>
            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="relative w-full h-full"
              >
                <Image
                  src={allImages[currentIndex]}
                  alt={`${product.name} - Immagine ${currentIndex + 1}`}
                  fill
                  className="object-contain"
                  sizes="(max-width: 1200px) 100vw, 1200px"
                  priority
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Navigation Arrows - Always visible when multiple images */}
          {allImages.length > 1 && (
            <>
              {/* Previous Button */}
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={goToPrevious}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-50 p-4 md:p-5 bg-gold text-nero hover:bg-gold-light transition-all group"
              >
                <ChevronLeft size={32} className="group-hover:-translate-x-1 transition-transform" />
              </motion.button>

              {/* Next Button */}
              <motion.button
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                onClick={goToNext}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-50 p-4 md:p-5 bg-gold text-nero hover:bg-gold-light transition-all group"
              >
                <ChevronRight size={32} className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </>
          )}

          {/* Bottom Bar - Thumbnails and Counter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-4"
          >
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex items-center gap-3 p-3 bg-nero/80 border border-gold/30">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative w-16 h-16 border-2 transition-all overflow-hidden ${
                      index === currentIndex
                        ? 'border-gold'
                        : 'border-transparent hover:border-gold/50'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-contain"
                      sizes="64px"
                    />
                    {/* Label */}
                    <span className="absolute bottom-0 left-0 right-0 bg-nero/80 text-[10px] text-center text-gold py-0.5">
                      {index === 0 ? 'Fronte' : 'Retro'}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {/* Counter */}
            <p className="font-sans text-sm text-bianco/60 bg-nero/80 px-4 py-2 border border-gold/20">
              {allImages.length > 1 ? (
                <>Immagine {currentIndex + 1} di {allImages.length} &bull; Usa le frecce per navigare</>
              ) : (
                <>1 immagine disponibile</>
              )}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
