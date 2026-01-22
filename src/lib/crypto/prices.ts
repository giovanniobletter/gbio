import { CryptoCurrency, cryptoWallets } from './config'

interface PriceData {
  [key: string]: {
    eur: number
    eur_24h_change?: number
  }
}

interface CryptoPrice {
  symbol: CryptoCurrency
  priceEur: number
  change24h?: number
}

// Cache for prices (5 minute TTL)
let priceCache: { data: PriceData; timestamp: number } | null = null
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

/**
 * Fetches current crypto prices from CoinGecko API (free tier)
 */
export async function fetchCryptoPrices(): Promise<PriceData | null> {
  // Return cached data if still valid
  if (priceCache && Date.now() - priceCache.timestamp < CACHE_TTL) {
    return priceCache.data
  }

  const ids = Object.values(cryptoWallets)
    .map((config) => config.coingeckoId)
    .join(',')

  try {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=eur&include_24hr_change=true`,
      {
        next: { revalidate: 300 }, // Cache for 5 minutes
      }
    )

    if (!response.ok) {
      throw new Error('Failed to fetch prices')
    }

    const data: PriceData = await response.json()

    // Update cache
    priceCache = { data, timestamp: Date.now() }

    return data
  } catch (error) {
    console.error('Error fetching crypto prices:', error)
    return null
  }
}

/**
 * Gets the current price for a specific cryptocurrency
 */
export async function getCryptoPrice(symbol: CryptoCurrency): Promise<CryptoPrice | null> {
  const prices = await fetchCryptoPrices()
  if (!prices) return null

  const config = cryptoWallets[symbol]
  const priceData = prices[config.coingeckoId]

  if (!priceData) return null

  return {
    symbol,
    priceEur: priceData.eur,
    change24h: priceData.eur_24h_change,
  }
}

/**
 * Converts EUR amount to crypto amount
 */
export async function convertEurToCrypto(
  eurAmount: number,
  symbol: CryptoCurrency
): Promise<{ amount: number; formattedAmount: string } | null> {
  const price = await getCryptoPrice(symbol)
  if (!price || price.priceEur === 0) return null

  const config = cryptoWallets[symbol]
  const cryptoAmount = eurAmount / price.priceEur

  // Format based on decimals
  const formattedAmount = formatCryptoAmount(cryptoAmount, symbol)

  return {
    amount: cryptoAmount,
    formattedAmount,
  }
}

/**
 * Formats a crypto amount with appropriate decimals
 */
export function formatCryptoAmount(amount: number, symbol: CryptoCurrency): string {
  const config = cryptoWallets[symbol]

  // Different display precision based on crypto
  let displayDecimals: number
  if (symbol === 'BTC') {
    displayDecimals = 8
  } else if (symbol === 'USDT' || symbol === 'USDC') {
    displayDecimals = 2 // Stablecoins show 2 decimals
  } else if (symbol === 'DOGE') {
    displayDecimals = 2
  } else {
    displayDecimals = 6
  }

  return amount.toFixed(displayDecimals)
}

/**
 * Gets all crypto prices at once
 */
export async function getAllCryptoPrices(): Promise<CryptoPrice[]> {
  const prices = await fetchCryptoPrices()
  if (!prices) return []

  return Object.entries(cryptoWallets).map(([symbol, config]) => {
    const priceData = prices[config.coingeckoId]
    return {
      symbol: symbol as CryptoCurrency,
      priceEur: priceData?.eur || 0,
      change24h: priceData?.eur_24h_change,
    }
  })
}
