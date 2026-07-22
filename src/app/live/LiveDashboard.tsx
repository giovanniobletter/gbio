'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

// Dashboard privata: visitatori live, pagine viste oggi, mappa di
// interesse per sezione e ultimi eventi. Accesso con ?key=... (salvata
// poi in localStorage). Si aggiorna da sola ogni 5 secondi.

interface Stats {
  now: number
  day: string
  liveCount: number
  visitors: Array<{ path: string; secondsAgo: number }>
  pages: Array<{ path: string; views: number }>
  sections: Record<string, number>
  events: Array<{ t: number; sid: string; type: string; path: string }>
}

const SECTION_LABELS: Record<string, string> = {
  hero: 'Apertura',
  vetrina: 'Vetrina prodotti',
  prodotti: 'Prodotti',
  cofanetti: 'Cofanetti',
  heritage: 'Heritage',
  territorio: 'Territorio',
  certificazioni: 'Certificazioni',
  invito: 'Call to action',
  contatti: 'Contatti',
}

function fmtAgo(s: number): string {
  if (s < 60) return `${s}s fa`
  return `${Math.floor(s / 60)}m fa`
}

function fmtDwell(ms: number): string {
  const min = ms / 60000
  if (min < 1) return `${Math.round(ms / 1000)}s`
  return `${min.toFixed(1)} min`
}

export function LiveDashboard() {
  const [key, setKey] = useState<string | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [error, setError] = useState<string | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get('key')
    const stored = localStorage.getItem('gbio-live-key')
    const k = fromUrl || stored
    if (k) {
      localStorage.setItem('gbio-live-key', k)
      setKey(k)
    }
  }, [])

  const load = useCallback(async (k: string) => {
    try {
      const res = await fetch(`/api/live-stats?key=${encodeURIComponent(k)}`, { cache: 'no-store' })
      if (res.status === 401) {
        setError('Chiave non valida')
        setStats(null)
        return
      }
      if (!res.ok) {
        setError(`Errore ${res.status}`)
        return
      }
      setStats(await res.json())
      setError(null)
    } catch {
      setError('Errore di rete')
    }
  }, [])

  useEffect(() => {
    if (!key) return
    load(key)
    const timer = setInterval(() => load(key), 5000)
    return () => clearInterval(timer)
  }, [key, load])

  if (!key || (error === 'Chiave non valida' && !stats)) {
    return (
      <main className="min-h-screen bg-nero flex items-center justify-center p-6">
        <div className="border border-gold/30 p-8 max-w-sm w-full">
          <h1 className="font-serif text-2xl text-gold mb-4">GBiO Live</h1>
          <p className="font-sans text-sm text-bianco/60 mb-4">Inserisci la chiave della dashboard.</p>
          {error && <p className="font-sans text-xs text-red-400 mb-3">{error}</p>}
          <input
            ref={inputRef}
            type="password"
            className="w-full bg-transparent border border-gold/30 p-3 text-bianco font-sans text-sm mb-3 focus:border-gold outline-none"
            placeholder="Chiave"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && inputRef.current?.value) {
                localStorage.setItem('gbio-live-key', inputRef.current.value)
                setError(null)
                setKey(inputRef.current.value)
              }
            }}
          />
          <button
            className="w-full bg-gold text-nero font-sans text-xs uppercase tracking-[0.2em] py-3"
            onClick={() => {
              if (inputRef.current?.value) {
                localStorage.setItem('gbio-live-key', inputRef.current.value)
                setError(null)
                setKey(inputRef.current.value)
              }
            }}
          >
            Entra
          </button>
        </div>
      </main>
    )
  }

  const maxViews = Math.max(1, ...(stats?.pages.map((p) => p.views) || [1]))
  const sectionEntries = Object.entries(stats?.sections || {}).sort((a, b) => Number(b[1]) - Number(a[1]))
  const maxDwell = Math.max(1, ...sectionEntries.map(([, ms]) => Number(ms)))

  return (
    <main className="min-h-screen bg-nero text-bianco p-6 md:p-10 font-sans">
      <header className="flex items-baseline justify-between mb-8 flex-wrap gap-2">
        <h1 className="font-serif text-3xl text-gold">GBiO Live</h1>
        <p className="text-xs text-bianco/40">
          {stats ? `Oggi ${stats.day} — aggiornamento automatico ogni 5s` : 'Caricamento…'}
        </p>
      </header>

      {error && <p className="text-red-400 text-sm mb-6">{error}</p>}

      <div className="grid md:grid-cols-2 gap-6 max-w-6xl">
        {/* Visitatori live */}
        <section className="border border-gold/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <span className="relative flex h-3 w-3">
              <span className={`absolute inline-flex h-full w-full rounded-full ${(stats?.liveCount || 0) > 0 ? 'bg-green-400 animate-ping opacity-60' : ''}`} />
              <span className={`relative inline-flex rounded-full h-3 w-3 ${(stats?.liveCount || 0) > 0 ? 'bg-green-400' : 'bg-bianco/20'}`} />
            </span>
            <h2 className="font-serif text-xl">
              <span className="text-gold text-3xl mr-2">{stats?.liveCount ?? '—'}</span>
              {stats?.liveCount === 1 ? 'visitatore adesso' : 'visitatori adesso'}
            </h2>
          </div>
          <ul className="space-y-2">
            {stats?.visitors.map((v, i) => (
              <li key={i} className="flex justify-between text-sm border-b border-gold/10 pb-2">
                <span className="text-bianco/80 truncate mr-4">{v.path}</span>
                <span className="text-bianco/40 whitespace-nowrap">{fmtAgo(v.secondsAgo)}</span>
              </li>
            ))}
            {stats && stats.visitors.length === 0 && (
              <li className="text-sm text-bianco/40">Nessuno online in questo momento</li>
            )}
          </ul>
        </section>

        {/* Pagine oggi */}
        <section className="border border-gold/20 p-6">
          <h2 className="font-serif text-xl mb-4">Pagine viste oggi</h2>
          <ul className="space-y-3">
            {stats?.pages.map((p) => (
              <li key={p.path} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-bianco/80 truncate mr-4">{p.path}</span>
                  <span className="text-gold">{p.views}</span>
                </div>
                <div className="h-1 bg-gold/10">
                  <div className="h-full bg-gold/70" style={{ width: `${(p.views / maxViews) * 100}%` }} />
                </div>
              </li>
            ))}
            {stats && stats.pages.length === 0 && (
              <li className="text-sm text-bianco/40">Ancora nessuna visita oggi</li>
            )}
          </ul>
        </section>

        {/* Mappa di interesse */}
        <section className="border border-gold/20 p-6">
          <h2 className="font-serif text-xl mb-1">Mappa di interesse</h2>
          <p className="text-xs text-bianco/40 mb-4">Tempo totale di visibilità per sezione, oggi</p>
          <ul className="space-y-3">
            {sectionEntries.map(([id, ms]) => (
              <li key={id} className="text-sm">
                <div className="flex justify-between mb-1">
                  <span className="text-bianco/80">{SECTION_LABELS[id] || id}</span>
                  <span className="text-gold">{fmtDwell(Number(ms))}</span>
                </div>
                <div className="h-2 bg-gold/10">
                  <div
                    className="h-full"
                    style={{
                      width: `${(Number(ms) / maxDwell) * 100}%`,
                      background: `linear-gradient(90deg, #6b5B2f, #c9a961)`,
                    }}
                  />
                </div>
              </li>
            ))}
            {sectionEntries.length === 0 && (
              <li className="text-sm text-bianco/40">Nessun dato di sezione oggi</li>
            )}
          </ul>
        </section>

        {/* Ultimi eventi */}
        <section className="border border-gold/20 p-6">
          <h2 className="font-serif text-xl mb-4">Ultime visite</h2>
          <ul className="space-y-2 max-h-80 overflow-y-auto">
            {stats?.events.map((e, i) => (
              <li key={i} className="flex justify-between text-xs border-b border-gold/10 pb-1.5">
                <span className="text-bianco/70 truncate mr-3">
                  <span className="text-gold/60 mr-2">{e.sid}</span>
                  {e.path}
                </span>
                <span className="text-bianco/30 whitespace-nowrap">
                  {new Date(e.t).toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </main>
  )
}
