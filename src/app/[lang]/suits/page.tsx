import { notFound } from 'next/navigation'
import { isLocale } from '@/shared/i18n/locales'
import { getDictionary } from '@/shared/i18n/getDictionary'
import { CatalogPage } from '@/app/_components/CatalogPage'

interface Props {
  params: Promise<{ lang: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  return { title: lang === 'ru' ? 'Костюмы — MVXIII' : 'Suits — MVXIII' }
}

export default async function SuitsPage({ params, searchParams }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const [dict, sp] = await Promise.all([getDictionary(lang), searchParams])
  return <CatalogPage lang={lang} dict={dict} categorySlug="suits" title={lang === 'ru' ? 'Костюмы' : 'Suits'} searchParams={sp} />
}
