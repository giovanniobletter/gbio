import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { ChatWidget } from '@/components/ui/ChatWidget'
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'LocalBusiness',
                  '@id': 'https://gbio.it/#business',
                  name: 'GBiO — Azienda Agricola Biologica Obletter',
                  url: 'https://gbio.it',
                  logo: 'https://gbio.it/logo-gbio.svg',
                  image: 'https://gbio.it/og-image.jpg',
                  description: 'Olio extravergine DOP Aprutino Pescarese biologico, pasta Senatore Cappelli e prodotti artigianali dalle colline di Cepagatti, Abruzzo.',
                  address: {
                    '@type': 'PostalAddress',
                    addressLocality: 'Cepagatti',
                    addressRegion: 'PE',
                    addressCountry: 'IT',
                  },
                  geo: {
                    '@type': 'GeoCoordinates',
                    latitude: 42.3667,
                    longitude: 14.0167,
                  },
                  priceRange: '€€',
                  sameAs: [],
                },
                {
                  '@type': 'WebSite',
                  '@id': 'https://gbio.it/#website',
                  url: 'https://gbio.it',
                  name: 'GBiO',
                  publisher: { '@id': 'https://gbio.it/#business' },
                  inLanguage: 'it-IT',
                },
                {
                  '@type': 'Product',
                  name: 'Olio Extravergine DOP Aprutino Pescarese Bio 0,5L',
                  description: "Note di carciofo, mandorla verde, erbe selvatiche. Spremuto a freddo entro 6 ore dalla raccolta.",
                  image: 'https://gbio.it/images/olio-05l.jpg',
                  brand: { '@type': 'Brand', name: 'GBiO' },
                  offers: {
                    '@type': 'Offer',
                    price: '20.00',
                    priceCurrency: 'EUR',
                    availability: 'https://schema.org/InStock',
                    url: 'https://gbio.it/it/prodotti/olio-dop-50cl',
                  },
                },
                {
                  '@type': 'Product',
                  name: 'Olio Extravergine DOP Aprutino Pescarese Bio 5L',
                  description: 'La scelta del conoscitore. Spremuto a freddo entro 6 ore dalla raccolta.',
                  image: 'https://gbio.it/images/olio-latta-5l.jpg',
                  brand: { '@type': 'Brand', name: 'GBiO' },
                  offers: {
                    '@type': 'Offer',
                    price: '80.00',
                    priceCurrency: 'EUR',
                    availability: 'https://schema.org/InStock',
                    url: 'https://gbio.it/it/prodotti/olio-dop-5l',
                  },
                },
                {
                  '@type': 'Product',
                  name: 'Pasta Senatore Cappelli — Penne 500g',
                  description: 'Il classico versatile. Perfette con verdure e pomodoro.',
                  image: 'https://gbio.it/images/pasta-penne.jpg',
                  brand: { '@type': 'Brand', name: 'GBiO' },
                  offers: {
                    '@type': 'Offer',
                    price: '4.50',
                    priceCurrency: 'EUR',
                    availability: 'https://schema.org/InStock',
                    url: 'https://gbio.it/it/prodotti/pasta-penne',
                  },
                },
              ],
            }),
          }}
        />
        {children}
        <ChatWidget />
      </body>
    </html>
  )
}
