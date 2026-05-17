import type { Locale } from '@/shared/i18n/locales'

export const DEFAULT_HERO: Record<Locale, {
  eyebrow: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink: string
}> = {
  ru: {
    eyebrow: 'Новая коллекция',
    title: 'Вне\nвремени',
    subtitle: 'Создано для уверенности.',
    ctaText: 'Смотреть коллекцию',
    ctaLink: '/suits',
  },
  en: {
    eyebrow: 'New Collection',
    title: 'Beyond\nTime',
    subtitle: 'Made for confidence.',
    ctaText: 'View Collection',
    ctaLink: '/suits',
  },
}
