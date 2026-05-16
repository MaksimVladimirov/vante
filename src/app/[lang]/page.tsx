import { notFound } from 'next/navigation'
import { isLocale } from '@/shared/i18n/locales'
import { getDictionary } from '@/shared/i18n/getDictionary'
import { Hero } from '@/widgets/hero/ui/Hero'
import { CategorySection } from '@/widgets/category-section/ui/CategorySection'

interface Props {
  params: Promise<{ lang: string }>
}

export default async function HomePage({ params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const dict = await getDictionary(lang)

  return (
    <>
      <Hero lang={lang} />
      <CategorySection lang={lang} dict={dict} />
    </>
  )
}
