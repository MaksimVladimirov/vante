import type { Locale } from './locales'

/** Возвращает строку на нужном языке; если EN-версия отсутствует — возвращает русский вариант. */
export function pick(
  lang: Locale,
  ru: string | null | undefined,
  en: string | null | undefined
): string {
  if (lang === 'en' && en) return en
  return ru ?? ''
}
