import { Redis } from '@upstash/redis'

// Client Redis per il tracking live interno. Ritorna null se le env del
// database non sono configurate: tutto il sistema degrada in no-op.
export function getLiveRedis(): Redis | null {
  const url = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL
  const token = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN
  if (!url || !token) return null
  return new Redis({ url, token })
}

/** Data locale (Europe/Rome) in formato YYYY-MM-DD, per le chiavi giornaliere. */
export function todayKey(): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/Rome',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date())
}
