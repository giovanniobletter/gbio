export const locales = ['it', 'en', 'fr', 'ru', 'zh', 'de'] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = 'it'

export const localeNames: Record<Locale, string> = {
  it: 'Italiano',
  en: 'English',
  fr: 'Français',
  ru: 'Русский',
  zh: '中文',
  de: 'Deutsch',
}

export const localeFlags: Record<Locale, string> = {
  it: '🇮🇹',
  en: '🇬🇧',
  fr: '🇫🇷',
  ru: '🇷🇺',
  zh: '🇨🇳',
  de: '🇩🇪',
}
