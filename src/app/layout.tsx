import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter, Noto_Sans_SC } from 'next/font/google'
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

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-noto-sc',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'GBiO - Azienda Agricola Obletter Giovanni Battista',
  description: 'Prodotti biologici certificati ICEA dalle colline di Cepagatti, Abruzzo.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="it"
      className={`${cormorant.variable} ${inter.variable} ${notoSansSC.variable}`}
    >
      <body className="cursor-custom">{children}</body>
    </html>
  )
}
