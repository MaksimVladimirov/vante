'use client';

import { useState } from 'react';
import { useCartStore } from '@/entities/cart/model/store';
import type { Product } from '@/entities/product/model/types';
import styles from './AddToCart.module.css';

const COLOR_MAP: Record<string, string> = {
  Black: '#000',
  Navy: '#1a2b5f',
  Grey: '#808080',
  White: '#fff',
};

interface AddToCartProps {
  product: Product;
}

export function AddToCart({ product }: AddToCartProps) {
  const addItem = useCartStore((s) => s.addItem);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState('');

  const handleAdd = () => {
    if (!selectedSize) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '',
      color: selectedColor,
      size: selectedSize,
      quantity: 1,
    });
  };

  return (
    <div className={styles.wrapper}>
      {product.colors.length > 0 && (
        <div>
          <p className={styles.label}>Цвет</p>
          <div className={styles.colorOptions}>
            {product.colors.map((color) => (
              <button
                key={color}
                className={`${styles.colorSwatch} ${selectedColor === color ? styles.colorSwatchActive : ''}`}
                style={{ backgroundColor: COLOR_MAP[color] || color }}
                onClick={() => setSelectedColor(color)}
                aria-label={color}
              />
            ))}
          </div>
        </div>
      )}

      <div>
        <div className={styles.sizeRow}>
          <p className={styles.label}>Размер {selectedSize && `— ${selectedSize}`}</p>
          <button className={styles.sizeGuide}>Таблица размеров</button>
        </div>
        <div className={styles.sizeOptions}>
          {product.sizes.map((size) => (
            <button
              key={size}
              className={`${styles.sizeBtn} ${selectedSize === size ? styles.sizeBtnActive : ''}`}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <button className={styles.addBtn} onClick={handleAdd} disabled={!selectedSize}>
        {selectedSize ? 'Добавить в корзину' : 'Выберите размер'}
      </button>
    </div>
  );
}
