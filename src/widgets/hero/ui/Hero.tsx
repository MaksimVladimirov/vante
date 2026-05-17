import Link from 'next/link'
import type { Locale } from '@/shared/i18n/locales'
import { getHeroSettings } from '../model/api'
import styles from './Hero.module.css'

interface HeroProps {
  lang: Locale
}

export async function Hero({ lang }: HeroProps) {
  const heroSettings = await getHeroSettings(lang)

  return (
    <section className={styles.hero}>
      <picture className={styles.picture}>
        <source media="(min-width: 992px)" srcSet={heroSettings.desktop} />
        <source media="(min-width: 768px)" srcSet={heroSettings.tablet} />
        <img
          src={heroSettings.mobile}
          alt="MVXIII hero"
          className={styles.bg}
          fetchPriority="high"
          loading="eager"
        />
      </picture>

      <div className={styles.content}>
        <p className={styles.eyebrow}>{heroSettings.eyebrow}</p>
        <h1 className={styles.title}>
          {heroSettings.title.split('\n').map((line, i, arr) => (
            <span key={i}>
              {line}
              {i < arr.length - 1 && <br />}
            </span>
          ))}
        </h1>
        <p className={styles.subtitle}>{heroSettings.subtitle}</p>
        <Link
          href={`/${lang}/${heroSettings.ctaLink.replace(/^\//, '')}`}
          className={styles.cta}
        >
          {heroSettings.ctaText}
        </Link>
      </div>
    </section>
  )
}
