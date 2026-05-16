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
  return { title: lang === 'ru' ? 'Рубашки — MVXIII' : 'Shirts — MVXIII' }
}

export default async function ShirtsPage({ params, searchParams }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const [dict, sp] = await Promise.all([getDictionary(lang), searchParams])
  return <CatalogPage lang={lang} dict={dict} categorySlug="shirts" title={lang === 'ru' ? 'Рубашки' : 'Shirts'} searchParams={sp} />
}
