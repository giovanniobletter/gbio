import type { Metadata } from 'next'
import Script from 'next/script'
import { Cormorant_Garamond, Inter, Noto_Sans_SC, Bodoni_Moda } from 'next/font/google'
import './globals.css'

const GA_ID = process.env.NEXT_PUBLIC_GA_ID

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

const bodoni = Bodoni_Moda({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-bodoni',
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
      className={`${cormorant.variable} ${inter.variable} ${notoSansSC.variable} ${bodoni.variable}`}
    >
      <body className="cursor-custom">
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_ID}');
              `}
            </Script>
          </>
        )}
        {children}
      </body>
    </html>
  )
}
