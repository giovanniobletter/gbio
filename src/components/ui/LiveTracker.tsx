'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

// Tracking interno anonimo per la dashboard privata /live.
// Nessun cookie e nessun dato personale: solo un id di sessione casuale
// in sessionStorage (muore alla chiusura della scheda), la pagina corrente
// e i millisecondi di visibilità delle sezioni (mappa di interesse).

function getSid(): string {
  try {
    let sid = sessionStorage.getItem('gbio-live-sid')
    if (!sid) {
      sid = crypto.randomUUID()
      sessionStorage.setItem('gbio-live-sid', sid)
    }
    return sid
  } catch {
    return 'anon'
  }
}

function send(payload: Record<string, unknown>) {
  try {
    const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
    if (!navigator.sendBeacon?.('/api/track', blob)) {
      fetch('/api/track', { method: 'POST', body: JSON.stringify(payload), keepalive: true })
    }
  } catch {
    // il tracking non deve mai rompere il sito
  }
}

export function LiveTracker() {
  const pathname = usePathname()
  // dwell[id] = ms di visibilità accumulati e non ancora inviati
  const dwell = useRef<Record<string, number>>({})
  const visibleSince = useRef<Record<string, number>>({})

  useEffect(() => {
    const sid = getSid()
    send({ sid, type: 'pv', path: pathname })

    // Heartbeat: mantiene viva la presenza mentre la scheda è visibile
    const hb = setInterval(() => {
      if (document.visibilityState === 'visible') {
        send({ sid, type: 'hb', path: pathname })
      }
    }, 20000)

    // Mappa di interesse: osserva le sezioni con id (>=50% visibili)
    const observer = new IntersectionObserver(
      (entries) => {
        const now = performance.now()
        for (const entry of entries) {
          const id = entry.target.id
          if (!id) continue
          if (entry.isIntersecting) {
            visibleSince.current[id] = now
          } else if (visibleSince.current[id]) {
            dwell.current[id] = (dwell.current[id] || 0) + (now - visibleSince.current[id])
            delete visibleSince.current[id]
          }
        }
      },
      { threshold: 0.5 }
    )
    // piccola attesa: le sezioni animate devono essere montate
    const scanTimer = setTimeout(() => {
      document.querySelectorAll('section[id], [data-live-section][id]').forEach((el) => observer.observe(el))
    }, 800)

    const flush = () => {
      const now = performance.now()
      // chiude i conteggi delle sezioni ancora visibili
      for (const [id, since] of Object.entries(visibleSince.current)) {
        dwell.current[id] = (dwell.current[id] || 0) + (now - since)
        visibleSince.current[id] = now
      }
      const sections = Object.fromEntries(
        Object.entries(dwell.current).filter(([, ms]) => ms >= 500).map(([id, ms]) => [id, Math.round(ms)])
      )
      if (Object.keys(sections).length > 0) {
        send({ sid, type: 'sec', path: pathname, sections })
        dwell.current = {}
      }
    }

    const flushTimer = setInterval(flush, 10000)
    const onHide = () => flush()
    document.addEventListener('pagehide', onHide)
    document.addEventListener('visibilitychange', onHide)

    return () => {
      clearInterval(hb)
      clearInterval(flushTimer)
      clearTimeout(scanTimer)
      flush()
      observer.disconnect()
      document.removeEventListener('pagehide', onHide)
      document.removeEventListener('visibilitychange', onHide)
      dwell.current = {}
      visibleSince.current = {}
    }
  }, [pathname])

  return null
}
