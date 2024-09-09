import 'server-only'
import { i18n } from '@/utils/i18nConfig'

const dictionaries = {
  en: () => import('../../dictionaries/en.json').then((module) => module.default),
  de: () => import('../../dictionaries/de.json').then((module) => module.default),
}

export const getDictionary = async (locale) =>
  dictionaries[i18n.locales.includes(locale) ? locale : i18n.defaultLocale]()
