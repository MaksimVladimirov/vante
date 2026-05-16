'use client'

import { useState } from 'react'
import { useCartStore } from '@/entities/cart/model/store'
import { useLang } from '@/shared/i18n/LangContext'
import type { Product } from '@/entities/product/model/types'
import styles from './AddToCart.module.css'

const COLOR_MAP: Record<string, string> = {
  Black: '#000',
  Navy: '#1a2b5f',
  Grey: '#808080',
  White: '#fff',
  Charcoal: '#36454f',
  Brown: '#8b5a2b',
  Beige: '#f5f0e8',
  Olive: '#6b7c5c',
}

interface AddToCartProps {
  product: Product
}

export function AddToCart({ product }: AddToCartProps) {
  const { dict } = useLang()
  const addItem = useCartStore((s) => s.addItem)
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '')
  const [selectedSize, setSelectedSize] = useState('')

  const sizeStock = product.size_stock ?? {}
  const isSizeOutOfStock = (size: string) => (sizeStock[size] ?? product.stock) === 0
  const selectedSizeStock = selectedSize ? (sizeStock[selectedSize] ?? product.stock) : null
  const canAdd = !!selectedSize && !isSizeOutOfStock(selectedSize)

  const handleAdd = () => {
    if (!canAdd) return
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    })
  }

  const colorLabel =
    dict.filters.colors[selectedColor as keyof typeof dict.filters.colors] ?? selectedColor

  return (
    <div className={styles.wrapper}>
      {product.colors.length > 0 && (
        <div>
          <p className={styles.label}>
            {dict.product.color}{selectedColor && ` — ${colorLabel}`}
          </p>
          <div className={styles.colorOptions}>
            {product.colors.map((color) => (
              <button
                key={color}
                type="button"
                className={`${styles.colorSwatch} ${selectedColor === color ? styles.colorSwatchActive : ''}`}
                style={{ backgroundColor: COLOR_MAP[color] ?? color }}
                onClick={() => setSelectedColor(color)}
                aria-label={color}
                title={color}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className={styles.sizeRow}>
          <p className={styles.label}>
            {dict.product.size}{selectedSize && ` — ${selectedSize}`}
          </p>
          <button type="button" className={styles.sizeGuide}>{dict.product.sizeGuide}</button>
        </div>
        <div className={styles.sizeOptions}>
          {product.sizes.map((size) => {
            const outOfStock = isSizeOutOfStock(size)
            return (
              <button
                key={size}
                type="button"
                className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ''} ${outOfStock ? styles.sizeBtnDisabled : ''}`}
                onClick={() => !outOfStock && setSelectedSize(size)}
                disabled={outOfStock}
                title={outOfStock ? dict.product.outOfStock : undefined}
              >
                {size}
              </button>
            )
          })}
        </div>
      </div>

      <button
        type="button"
        className={styles.addBtn}
        onClick={handleAdd}
        disabled={!canAdd}
      >
        {!selectedSize
          ? dict.product.selectSize
          : selectedSizeStock === 0
          ? dict.product.outOfStock
          : dict.product.addToCart}
      </button>
    </div>
  )
}
