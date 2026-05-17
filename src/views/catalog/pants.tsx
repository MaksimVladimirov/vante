import { notFound } from 'next/navigation'
import { isLocale } from '@/shared/i18n/locales'
import { getDictionary } from '@/shared/i18n/getDictionary'
import { CatalogWidget } from '@/widgets/catalog/ui/CatalogWidget'

interface Props {
  params: Promise<{ lang: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) return {}
  const dict = await getDictionary(lang)
  return { title: `${dict.footer.pants} — MVXIII` }
}

export default async function PantsPage({ params, searchParams }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const [dict, sp] = await Promise.all([getDictionary(lang), searchParams])
  return <CatalogWidget dict={dict} categorySlug="pants" title={dict.footer.pants} searchParams={sp} />
}
