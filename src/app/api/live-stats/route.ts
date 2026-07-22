import { NextRequest, NextResponse } from 'next/server'
import { getLiveRedis, todayKey } from '@/lib/liveRedis'

// Statistiche per la dashboard privata /live. Protetta da chiave
// (env LIVE_DASHBOARD_KEY): senza chiave corretta risponde 401.

export const dynamic = 'force-dynamic'

async function scanKeys(redis: NonNullable<ReturnType<typeof getLiveRedis>>, pattern: string): Promise<string[]> {
  const keys: string[] = []
  let cursor = 0
  do {
    const [next, batch] = await redis.scan(cursor, { match: pattern, count: 200 })
    cursor = Number(next)
    keys.push(...batch)
  } while (cursor !== 0 && keys.length < 1000)
  return keys
}

export async function GET(request: NextRequest) {
  const expected = process.env.LIVE_DASHBOARD_KEY
  const provided = request.nextUrl.searchParams.get('key')
  if (!expected || provided !== expected) {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 })
  }

  const redis = getLiveRedis()
  if (!redis) {
    return NextResponse.json({ error: 'redis non configurato' }, { status: 503 })
  }

  const day = todayKey()
  const now = Date.now()

  // Visitatori live (chiavi con TTL 3 minuti)
  const liveKeys = await scanKeys(redis, 'live:*')
  const visitors: Array<{ path: string; secondsAgo: number }> = []
  if (liveKeys.length > 0) {
    const p = redis.pipeline()
    liveKeys.forEach((k) => p.hgetall(k))
    const rows = (await p.exec()) as Array<{ path?: string; t?: number } | null>
    for (const row of rows) {
      if (row?.t) {
        visitors.push({
          path: String(row.path || '?'),
          secondsAgo: Math.max(0, Math.round((now - Number(row.t)) / 1000)),
        })
      }
    }
    visitors.sort((a, b) => a.secondsAgo - b.secondsAgo)
  }

  // Pagine viste oggi
  const pvKeys = await scanKeys(redis, `pv:${day}:*`)
  const pages: Array<{ path: string; views: number }> = []
  if (pvKeys.length > 0) {
    const counts = (await redis.mget(...pvKeys)) as Array<number | null>
    pvKeys.forEach((k, i) => {
      pages.push({ path: k.slice(`pv:${day}:`.length), views: Number(counts[i]) || 0 })
    })
    pages.sort((a, b) => b.views - a.views)
  }

  // Interesse per sezione (ms di visibilità accumulati oggi)
  const sections = ((await redis.hgetall(`sec:${day}`)) || {}) as Record<string, number>

  // Ultimi eventi
  const rawEvents = await redis.lrange('ev', 0, 49)
  const events = rawEvents
    .map((e) => {
      try {
        return typeof e === 'string' ? JSON.parse(e) : e
      } catch {
        return null
      }
    })
    .filter(Boolean)

  return NextResponse.json({
    now,
    day,
    liveCount: visitors.length,
    visitors: visitors.slice(0, 50),
    pages: pages.slice(0, 20),
    sections,
    events,
  })
}
