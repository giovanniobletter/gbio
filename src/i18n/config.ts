export const locales = ['it'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'it'

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
}

export const localeFlags: Record<Locale, string> = {
  it: '🇮🇹',
}
