import type { Metadata } from 'next'
import { NextIntlClientProvider } from 'next-intl'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { Providers } from '@/components/Providers'
import { locales, type Locale } from '@/i18n/config'

type Props = {
  params: Promise<{ locale: string }>
}

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'metadata' })

  const localeMap: Record<string, string> = {
    it: 'it_IT',
    en: 'en_US',
    fr: 'fr_FR',
    ru: 'ru_RU',
    zh: 'zh_CN',
    de: 'de_DE',
  }

  return {
    title: t('title'),
    description: t('description'),
    keywords: [
      'olio biologico',
      'olio extravergine Abruzzo',
      'pasta biologica',
      'Senatore Cappelli',
      'farina biologica',
      'Gentilrosso',
      'azienda agricola Abruzzo',
      'prodotti biologici Pescara',
      'ICEA certificato',
      'Cepagatti',
      'Obletter',
    ],
    authors: [{ name: 'Azienda Agricola Obletter Giovanni Battista' }],
    openGraph: {
      title: t('title'),
      description: t('description'),
      url: 'https://gbio.it',
      siteName: 'GBiO',
      locale: localeMap[locale] || 'it_IT',
      type: 'website',
      images: [
        {
          url: 'https://gbio.it/logo-gbio.svg',
          width: 600,
          height: 120,
          alt: 'GBiO - Azienda Agricola Biologica',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: t('title'),
      description: t('description'),
      images: ['https://gbio.it/logo-gbio.svg'],
    },
    robots: {
      index: true,
      follow: true,
    },
    alternates: {
      canonical: 'https://gbio.it',
    },
  }
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  // Validate locale
  if (!locales.includes(locale as Locale)) {
    notFound()
  }

  // Enable static rendering for this locale
  setRequestLocale(locale)

  // Load messages for this specific locale directly
  const messages = (await import(`../../messages/${locale}.json`)).default

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers>{children}</Providers>
    </NextIntlClientProvider>
  )
}
