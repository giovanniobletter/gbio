export type CryptoCurrency = 'BTC' | 'SOL' | 'DOGE' | 'USDT' | 'USDC'

export interface CryptoConfig {
  symbol: CryptoCurrency
  name: string
  network: string
  address: string
  icon: string
  coingeckoId: string
  decimals: number
}

// Wallet addresses - UPDATE THESE WITH REAL ADDRESSES BEFORE LAUNCH
export const cryptoWallets: Record<CryptoCurrency, CryptoConfig> = {
  BTC: {
    symbol: 'BTC',
    name: 'Bitcoin',
    network: 'Bitcoin',
    address: 'bc1qxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with real address
    icon: '/images/crypto/btc.svg',
    coingeckoId: 'bitcoin',
    decimals: 8,
  },
  SOL: {
    symbol: 'SOL',
    name: 'Solana',
    network: 'Solana',
    address: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with real address
    icon: '/images/crypto/sol.svg',
    coingeckoId: 'solana',
    decimals: 9,
  },
  DOGE: {
    symbol: 'DOGE',
    name: 'Dogecoin',
    network: 'Dogecoin',
    address: 'Dxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with real address
    icon: '/images/crypto/doge.svg',
    coingeckoId: 'dogecoin',
    decimals: 8,
  },
  USDT: {
    symbol: 'USDT',
    name: 'Tether',
    network: 'Ethereum ERC-20',
    address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with real address
    icon: '/images/crypto/usdt.svg',
    coingeckoId: 'tether',
    decimals: 6,
  },
  USDC: {
    symbol: 'USDC',
    name: 'USD Coin',
    network: 'Ethereum ERC-20',
    address: '0xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with real address
    icon: '/images/crypto/usdc.svg',
    coingeckoId: 'usd-coin',
    decimals: 6,
  },
}

export const PAYMENT_WINDOW_MINUTES = 30

export const supportedCryptos: CryptoCurrency[] = ['BTC', 'SOL', 'DOGE', 'USDT', 'USDC']

// Color schemes for each crypto
export const cryptoColors: Record<CryptoCurrency, { primary: string; secondary: string }> = {
  BTC: { primary: '#F7931A', secondary: '#FFB84D' },
  SOL: { primary: '#9945FF', secondary: '#14F195' },
  DOGE: { primary: '#C2A633', secondary: '#E8D174' },
  USDT: { primary: '#26A17B', secondary: '#50C878' },
  USDC: { primary: '#2775CA', secondary: '#5B9FE0' },
}
