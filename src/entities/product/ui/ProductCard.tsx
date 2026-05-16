import Link from 'next/link'
import Image from 'next/image'
import type { Product } from '../model/types'
import type { Locale } from '@/shared/i18n/locales'
import { pick } from '@/shared/i18n/pick'
import styles from './ProductCard.module.css'

interface ProductCardProps {
  product: Product
  lang: Locale
}

export function ProductCard({ product, lang }: ProductCardProps) {
  const imageUrl = product.images[0] || '/images/placeholder.jpg'

  return (
    <Link href={`/${lang}/products/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={styles.image}
          sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{pick(lang, product.name, product.name_en)}</h3>
        <span className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</span>
      </div>
    </Link>
  )
}
