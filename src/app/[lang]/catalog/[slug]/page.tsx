import { notFound } from 'next/navigation'
import { isLocale } from '@/shared/i18n/locales'
import { getDictionary } from '@/shared/i18n/getDictionary'
import { supabase } from '@/shared/api/supabase'
import { pick } from '@/shared/i18n/pick'
import { CatalogWidget } from '@/widgets/catalog/ui/CatalogWidget'

interface Props {
  params: Promise<{ lang: string; slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export async function generateMetadata({ params }: Props) {
  const { lang, slug } = await params
  if (!isLocale(lang)) return {}
  const { data: category } = await supabase
    .from('categories').select('name, name_en').eq('slug', slug).single()
  if (!category) return {}
  const name = pick(lang, category.name, category.name_en)
  return { title: `${name} — MVXIII` }
}

export default async function CatalogPage({ params, searchParams }: Props) {
  const { lang, slug } = await params
  if (!isLocale(lang)) notFound()

  const [dict, sp, { data: category }] = await Promise.all([
    getDictionary(lang),
    searchParams,
    supabase.from('categories').select('name, name_en').eq('slug', slug).single(),
  ])

  if (!category) notFound()

  const title = pick(lang, category.name, category.name_en)

  return <CatalogWidget dict={dict} categorySlug={slug} title={title} searchParams={sp} />
}
