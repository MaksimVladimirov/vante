import { supabase } from '@/shared/api/supabase'
import type { Locale } from '@/shared/i18n/locales'
import { Header } from './Header'

interface Props {
  lang: Locale
}

export async function HeaderWrapper({ lang }: Props) {
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug')
    .order('created_at')

  const navLinks = (categories ?? []).map((cat) => ({
    href: `/${lang}/${cat.slug}`,
    label: cat.name,
  }))

  return <Header lang={lang} navLinks={navLinks.length > 0 ? navLinks : undefined} />
}
