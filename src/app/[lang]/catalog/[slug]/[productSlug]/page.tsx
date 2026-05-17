import { notFound } from 'next/navigation'
import { Collapse } from 'antd'
import { isLocale } from '@/shared/i18n/locales'
import { getDictionary } from '@/shared/i18n/getDictionary'
import { pick } from '@/shared/i18n/pick'
import { fetchProductBySlug } from '@/entities/product/model/api'
import { AddToCart } from '@/features/add-to-cart/ui/AddToCart'
import { ProductGallery } from '@/widgets/product-gallery/ui/ProductGallery'
import styles from './page.module.css'

interface Props {
  params: Promise<{ lang: string; slug: string; productSlug: string }>
}

export async function generateMetadata({ params }: Props) {
  const { lang, productSlug } = await params
  if (!isLocale(lang)) return {}
  const product = await fetchProductBySlug(productSlug)
  if (!product) return {}
  return { title: `${pick(lang, product.name, product.name_en)} — MVXIII` }
}

export default async function ProductPage({ params }: Props) {
  const { lang, productSlug } = await params
  if (!isLocale(lang)) notFound()

  const [dict, product] = await Promise.all([
    getDictionary(lang),
    fetchProductBySlug(productSlug),
  ])

  if (!product) notFound()

  return (
    <div className={styles.wrapper}>
      <div className={styles.page}>
        <ProductGallery product={product} />

        <div className={styles.info}>
          <div className={styles.infoSticky}>
            {product.category && (
              <p className={styles.category}>
                {pick(lang, product.category.name, product.category.name_en)}
              </p>
            )}
            <h1 className={styles.name}>
              {pick(lang, product.name, product.name_en)}
            </h1>
            <p className={styles.price}>
              {product.price.toLocaleString('ru-RU')} ₽
            </p>

            <AddToCart product={product} />

            <div className={styles.accordions}>
              <Collapse
                ghost
                items={[
                  {
                    key: 'description',
                    label: dict.product.description,
                    children: (
                      <p className={styles.accordionText}>
                        {pick(lang, product.description, product.description_en) ||
                          dict.product.descriptionDefault}
                      </p>
                    ),
                  },
                  {
                    key: 'details',
                    label: dict.product.details,
                    children: (
                      <p className={styles.accordionText}>
                        {pick(lang, product.details, product.details_en) ||
                          dict.product.detailsDefault}
                      </p>
                    ),
                  },
                  {
                    key: 'shipping',
                    label: dict.product.shipping,
                    children: (
                      <p className={styles.accordionText}>{dict.product.shippingText}</p>
                    ),
                  },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
