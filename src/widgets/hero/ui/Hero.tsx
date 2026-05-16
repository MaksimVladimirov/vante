import Link from 'next/link'
import { supabase } from '@/shared/api/supabase'
import type { Locale } from '@/shared/i18n/locales'
import { pick } from '@/shared/i18n/pick'
import styles from './Hero.module.css'

const DEFAULTS = {
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

async function getHeroSettings(lang: Locale) {
  try {
    const { data } = await supabase.from('site_settings').select('key, value')
    const map: Record<string, string> = {}
    data?.forEach((row) => { map[row.key] = row.value ?? '' })

    const def = DEFAULTS[lang]
    const desktopImg = map.hero_image_desktop || map.hero_image || '/images/hero.jpg'
    const tabletImg  = map.hero_image_tablet  || desktopImg
    const mobileImg  = map.hero_image_mobile  || tabletImg

    return {
      desktop:  desktopImg,
      tablet:   tabletImg,
      mobile:   mobileImg,
      eyebrow:  pick(lang, map.hero_eyebrow,   map.hero_eyebrow_en)   || def.eyebrow,
      title:    pick(lang, map.hero_title,     map.hero_title_en)     || def.title,
      subtitle: pick(lang, map.hero_subtitle,  map.hero_subtitle_en)  || def.subtitle,
      ctaText:  pick(lang, map.hero_cta_text,  map.hero_cta_text_en)  || def.ctaText,
      ctaLink:  map.hero_cta_link || def.ctaLink,
    }
  } catch {
    return { ...DEFAULTS[lang], desktop: '/images/hero.jpg', tablet: '/images/hero.jpg', mobile: '/images/hero.jpg' }
  }
}

interface Props { lang: Locale }

export async function Hero({ lang }: Props) {
  const s = await getHeroSettings(lang)

  return (
    <section className={styles.hero}>
      <picture className={styles.picture}>
        <source media="(min-width: 992px)" srcSet={s.desktop} />
        <source media="(min-width: 768px)" srcSet={s.tablet} />
        <img
          src={s.mobile}
          alt="MVXIII hero"
          className={styles.bg}
          fetchPriority="high"
          loading="eager"
        />
      </picture>

      <div className={styles.content}>
        <p className={styles.eyebrow}>{s.eyebrow}</p>
        <h1 className={styles.title}>
          {s.title.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className={styles.subtitle}>{s.subtitle}</p>
        <Link href={`/${lang}/${s.ctaLink.replace(/^\//, '')}`} className={styles.cta}>
          {s.ctaText}
        </Link>
      </div>
    </section>
  )
}
