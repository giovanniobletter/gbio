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
  title: {
    default: 'GBiO — Olio DOP Bio e Prodotti Biologici dall\'Abruzzo',
    template: '%s | GBiO',
  },
  description: 'Olio extravergine DOP Aprutino Pescarese biologico, pasta Senatore Cappelli e prodotti artigianali dalle colline di Cepagatti, Abruzzo. Certificazione ICEA.',
  keywords: ['olio extravergine biologico', 'DOP Aprutino Pescarese', 'olio bio Abruzzo', 'pasta Senatore Cappelli', 'prodotti biologici', 'azienda agricola Cepagatti', 'olio DOP', 'GBiO'],
  authors: [{ name: 'GBiO - Azienda Agricola Obletter' }],
  icons: {
    icon: '/logo-gbo-short.svg',
    apple: '/logo-gbo-short.svg',
  },
  openGraph: {
    type: 'website',
    locale: 'it_IT',
    url: 'https://gbio.it',
    siteName: 'GBiO — Azienda Agricola Biologica',
    title: 'GBiO — Olio DOP Bio e Prodotti Biologici dall\'Abruzzo',
    description: 'Olio extravergine DOP Aprutino Pescarese biologico, pasta Senatore Cappelli e prodotti artigianali dalle colline di Cepagatti, Abruzzo.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'GBiO — Azienda Agricola Biologica',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GBiO — Olio DOP Bio e Prodotti Biologici dall\'Abruzzo',
    description: 'Olio extravergine DOP Aprutino Pescarese biologico, pasta Senatore Cappelli e prodotti artigianali dalle colline di Cepagatti.',
    images: ['/og-image.jpg'],
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
