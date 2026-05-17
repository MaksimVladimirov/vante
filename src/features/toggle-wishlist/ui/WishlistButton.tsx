'use client'

import { useState, useEffect } from 'react'
import { HeartOutlined, HeartFilled } from '@ant-design/icons'
import { useWishlistStore } from '@/entities/wishlist/model/store'
import { useLang } from '@/shared/i18n/LangContext'
import styles from './WishlistButton.module.css'

interface Props {
  productId: string
  className?: string
}

export function WishlistButton({ productId, className }: Props) {
  const { dict } = useLang()
  const toggle = useWishlistStore((store) => store.toggle)
  const isInWishlistStore = useWishlistStore((store) => store.has(productId))
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])
  const isInWishlist = mounted && isInWishlistStore

  return (
    <button
      type="button"
      className={`${styles.btn} ${className ?? ''}`}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        toggle(productId)
      }}
      aria-label={isInWishlist ? dict.wishlist.remove : dict.wishlist.add}
    >
      {isInWishlist
        ? <HeartFilled className={styles.iconActive} />
        : <HeartOutlined className={styles.icon} />
      }
    </button>
  )
}
