'use client'

import { useState } from 'react'
import Image from 'next/image'
import { CloseOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons'
import { WishlistButton } from '@/features/toggle-wishlist/ui/WishlistButton'
import type { Product } from '@/entities/product/model/types'
import styles from './ProductGallery.module.css'

interface Props {
  product: Product
}

export function ProductGallery({ product }: Props) {
  const images = product.images
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const open = (i: number) => setLightboxIndex(i)
  const close = () => setLightboxIndex(null)
  const prev = () => setLightboxIndex((i) => (i !== null ? (i - 1 + images.length) % images.length : 0))
  const next = () => setLightboxIndex((i) => (i !== null ? (i + 1) % images.length : 0))

  return (
    <>
      <div className={styles.gallery}>
        {images.map((src, i) => (
          <div
            key={i}
            className={styles.galleryItem}
            onClick={() => open(i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && open(i)}
          >
            <Image
              src={src}
              alt={`${product.name} ${i + 1}`}
              fill
              className={styles.galleryImage}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
              unoptimized
            />
          </div>
        ))}
        {images.length === 0 && <div className={styles.placeholder} />}
      </div>

      {lightboxIndex !== null && (
        <div className={styles.lightbox} onClick={close}>
          <div className={styles.lightboxActions} onClick={(e) => e.stopPropagation()}>
            <WishlistButton productId={product.id} />
            <button className={styles.closeBtn} onClick={close} aria-label="Закрыть">
              <CloseOutlined />
            </button>
          </div>

          <Image
            src={images[lightboxIndex]}
            alt={`${product.name} ${lightboxIndex + 1}`}
            fill
            className={styles.lightboxImage}
            sizes="100vw"
            unoptimized
            onClick={(e) => e.stopPropagation()}
          />

          {images.length > 1 && (
            <>
              <button
                className={`${styles.arrow} ${styles.arrowLeft}`}
                onClick={(e) => { e.stopPropagation(); prev(); }}
              >
                <LeftOutlined />
              </button>
              <button
                className={`${styles.arrow} ${styles.arrowRight}`}
                onClick={(e) => { e.stopPropagation(); next(); }}
              >
                <RightOutlined />
              </button>
            </>
          )}
        </div>
      )}
    </>
  )
}
