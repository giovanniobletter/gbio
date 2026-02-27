import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { CookieBanner } from '@/components/ui/CookieBanner'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'latin-ext', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})


export const metadata: Metadata = {
  metadataBase: new URL('https://gbio.it'),
  title: 'GBiO - Azienda Agricola Obletter Giovanni Battista',
  description: 'Prodotti biologici certificati ICEA dalle colline di Cepagatti, Abruzzo.',
  icons: {
    icon: '/logo-gbo-short.svg',
    apple: '/logo-gbo-short.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="it"
      className={`${cormorant.variable} ${inter.variable}`}
    >
      <body className="cursor-custom">
        {children}
        <CookieBanner />
      </body>
    </html>
  )
}
