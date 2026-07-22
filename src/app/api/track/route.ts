import { NextRequest, NextResponse } from 'next/server'
import { getLiveRedis, todayKey } from '@/lib/liveRedis'

// Tracking interno anonimo: nessun cookie, nessun IP salvato, nessun dato
// personale. Solo un session id casuale ed effimero (sessionStorage) per
// contare i visitatori attivi. I dati aggregati scadono dopo 60 giorni.

const PRESENCE_TTL = 180 // secondi: un visitatore è "live" se visto negli ultimi 3 min
const DAILY_TTL = 60 * 60 * 24 * 60 // 60 giorni per i contatori giornalieri

function clean(str: unknown, max = 120): string {
  return String(str ?? '').slice(0, max)
}

export async function POST(request: NextRequest) {
  const redis = getLiveRedis()
  if (!redis) return NextResponse.json({ ok: false }, { status: 200 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const sid = clean(body.sid, 40)
  const type = clean(body.type, 10)
  const path = clean(body.path)
  if (!sid || !type) return NextResponse.json({ ok: false }, { status: 400 })

  const day = todayKey()
  const now = Date.now()
  const p = redis.pipeline()

  // Presenza: chi c'è adesso e su quale pagina
  p.hset(`live:${sid}`, { path, t: now })
  p.expire(`live:${sid}`, PRESENCE_TTL)

  if (type === 'pv') {
    p.incr(`pv:${day}:${path}`)
    p.expire(`pv:${day}:${path}`, DAILY_TTL)
    p.lpush('ev', JSON.stringify({ t: now, sid: sid.slice(0, 6), type: 'pv', path }))
    p.ltrim('ev', 0, 99)
  }

  if (type === 'sec' && body.sections && typeof body.sections === 'object') {
    // Mappa di interesse: millisecondi di visibilità accumulati per sezione
    const entries = Object.entries(body.sections as Record<string, unknown>).slice(0, 30)
    for (const [section, ms] of entries) {
      const dwell = Math.min(Math.max(Number(ms) || 0, 0), 120000)
      if (dwell > 0) p.hincrby(`sec:${day}`, clean(section, 60), Math.round(dwell))
    }
    p.expire(`sec:${day}`, DAILY_TTL)
  }

  await p.exec()
  return NextResponse.json({ ok: true })
}
