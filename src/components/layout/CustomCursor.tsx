'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion } from 'framer-motion'

export function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia('(pointer: coarse)').matches)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
    if (!isVisible) setIsVisible(true)
  }, [isVisible])

  useEffect(() => {
    if (isMobile) return

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    const addHoverListeners = () => {
      const interactiveElements = document.querySelectorAll(
        'a, button, input, textarea, [data-cursor-hover]'
      )

      interactiveElements.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true))
        el.addEventListener('mouseleave', () => setIsHovering(false))
      })
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseenter', handleMouseEnter)
    document.addEventListener('mouseleave', handleMouseLeave)

    addHoverListeners()

    const observer = new MutationObserver(addHoverListeners)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseenter', handleMouseEnter)
      document.removeEventListener('mouseleave', handleMouseLeave)
      observer.disconnect()
    }
  }, [isMobile, handleMouseMove])

  if (isMobile) return null

  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[9999]"
      animate={{
        x: position.x,
        y: position.y,
        scale: isHovering ? 1.2 : 1,
        opacity: isVisible ? 1 : 0,
      }}
      transition={{
        type: 'spring',
        stiffness: 500,
        damping: 28,
        mass: 0.5,
      }}
    >
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          filter: isHovering ? 'drop-shadow(0 0 8px rgba(201, 169, 97, 0.6))' : 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3))',
          transition: 'filter 0.2s ease',
        }}
      >
        {/* Elegant arrow cursor */}
        <path
          d="M5 2L5 18L9 14L13 22L15 21L11 13L17 13L5 2Z"
          fill="#C9A961"
          stroke="#0D0D0D"
          strokeWidth="0.5"
        />
      </svg>
    </motion.div>
  )
}
