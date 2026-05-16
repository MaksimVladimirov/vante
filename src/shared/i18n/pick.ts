import type { Locale } from './locales'

/** Returns the localised string, falling back to Russian if the EN version is absent. */
export function pick(
  lang: Locale,
  ru: string | null | undefined,
  en: string | null | undefined
): string {
  if (lang === 'en' && en) return en
  return ru ?? ''
}
