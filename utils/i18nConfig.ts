const defaultLocale = 'en'
// also add new locales to dictionaries.js and the root layout static params
const locales = ['en', 'de']

export const i18n = {
  defaultLocale,
  locales,
} as const

export type Locale = (typeof i18n)['locales'][number]
