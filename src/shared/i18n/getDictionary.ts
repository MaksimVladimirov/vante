import type { Locale } from './locales'
import type ru from './dictionaries/ru.json'

export type Dictionary = typeof ru

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import('./dictionaries/ru.json').then((m) => m.default),
  en: () => import('./dictionaries/en.json').then((m) => m.default),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}
