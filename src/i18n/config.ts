export const locales = ['it', 'en', 'de', 'fr', 'ru', 'zh'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'it'

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  de: 'Deutsch',
  fr: 'Français',
  ru: 'Русский',
  zh: '中文',
}

export const localeFlags: Record<Locale, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  de: '🇩🇪',
  fr: '🇫🇷',
  ru: '🇷🇺',
  zh: '🇨🇳',
}
