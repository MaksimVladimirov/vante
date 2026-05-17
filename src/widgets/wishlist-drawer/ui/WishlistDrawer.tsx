'use client'

import { useEffect, useState } from 'react'
import { Drawer } from 'antd'
import Image from 'next/image'
import Link from 'next/link'
import { HeartOutlined } from '@ant-design/icons'
import { useWishlistStore } from '@/entities/wishlist/model/store'
import { fetchProductsByIds } from '@/entities/product/model/api'
import { useLang } from '@/shared/i18n/LangContext'
import { pick } from '@/shared/i18n/pick'
import type { Product } from '@/entities/product/model/types'
import styles from './WishlistDrawer.module.css'

const DRAWER_STYLES = {
  wrapper: { width: 420 },
  header: {
    fontFamily: 'var(--font-serif)',
    fontSize: '16px',
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    fontWeight: 400,
    borderBottom: '1px solid var(--color-border)',
  },
  body: { padding: '0 24px' },
}

export function WishlistDrawer() {
  const { lang, dict } = useLang()
  const ids = useWishlistStore((store) => store.ids)
  const isOpen = useWishlistStore((store) => store.isOpen)
  const closeWishlist = useWishlistStore((store) => store.closeWishlist)
  const toggle = useWishlistStore((store) => store.toggle)

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!isOpen) return
    setLoading(true)
    fetchProductsByIds(ids)
      .then(setProducts)
      .finally(() => setLoading(false))
  }, [isOpen, ids.join(',')])

  return (
    <Drawer
      title={`${dict.wishlist.title} (${ids.length})`}
      placement="right"
      onClose={closeWishlist}
      open={isOpen}
      styles={DRAWER_STYLES}
    >
      {ids.length === 0 ? (
        <div className={styles.empty}>
          <HeartOutlined className={styles.emptyIcon} />
          <p className={styles.emptyText}>{dict.wishlist.empty}</p>
        </div>
      ) : (
        <div>
          {products.map((product) => (
            <div key={product.id} className={styles.item}>
              <Link
                href={`/${lang}/catalog/${product.category?.slug ?? 'catalog'}/${product.slug}`}
                className={styles.itemLink}
                onClick={closeWishlist}
              >
                <div className={styles.itemImage}>
                  {product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      className={styles.coverImage}
                    />
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>
                    {pick(lang, product.name, product.name_en)}
                  </p>
                  <p className={styles.itemPrice}>
                    {product.price.toLocaleString('ru-RU')} ₽
                  </p>
                </div>
              </Link>
              <button
                type="button"
                className={styles.removeBtn}
                onClick={() => toggle(product.id)}
                aria-label={dict.wishlist.remove}
              >
                <HeartOutlined />
              </button>
            </div>
          ))}
        </div>
      )}
    </Drawer>
  )
}
