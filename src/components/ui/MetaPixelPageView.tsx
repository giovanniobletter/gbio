'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import { metaPageView } from '@/lib/metaPixel'

// Traccia i PageView sulle navigazioni client-side (App Router non ricarica
// la pagina). Il PageView iniziale viene emesso da loadMetaPixel.
export function MetaPixelPageView() {
  const pathname = usePathname()
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }
    metaPageView()
  }, [pathname])

  return null
}
