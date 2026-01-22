'use client'

import { useState, useEffect } from 'react'

export function useScrollProgress() {
  const [progress, setProgress] = useState(0)
  const [scrollY, setScrollY] = useState(0)

  useEffect(() => {
    const updateScroll = () => {
      const currentScrollY = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
      const currentProgress = scrollHeight > 0 ? (currentScrollY / scrollHeight) * 100 : 0

      setScrollY(currentScrollY)
      setProgress(currentProgress)
      document.documentElement.style.setProperty('--scroll-y', `${currentScrollY}px`)
    }

    window.addEventListener('scroll', updateScroll, { passive: true })
    updateScroll()

    return () => window.removeEventListener('scroll', updateScroll)
  }, [])

  return { progress, scrollY }
}
