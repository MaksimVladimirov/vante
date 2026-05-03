'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import styles from './ProductFilters.module.css';

const COLORS = ['Black', 'Navy', 'Grey', 'White'];
const COLOR_LABELS: Record<string, string> = {
  Black: 'Чёрный',
  Navy: 'Тёмно-синий',
  Grey: 'Серый',
  White: 'Белый',
};
const SIZES = ['44', '46', '48', '50', '52', '54'];

const COLOR_MAP: Record<string, string> = {
  Black: '#000',
  Navy: '#1a2b5f',
  Grey: '#808080',
  White: '#fff',
};

interface ProductFiltersProps {
  categories?: Array<{ name: string; slug: string }>;
}

export function ProductFilters({ categories = [] }: ProductFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get('category') || '';
  const activeColors = searchParams.getAll('color');
  const activeSizes = searchParams.getAll('size');

  const updateParam = useCallback(
    (key: string, value: string, multi = false) => {
      const params = new URLSearchParams(searchParams.toString());
      if (multi) {
        const existing = params.getAll(key);
        if (existing.includes(value)) {
          params.delete(key);
          existing.filter((v) => v !== value).forEach((v) => params.append(key, v));
        } else {
          params.append(key, value);
        }
      } else {
        if (params.get(key) === value) {
          params.delete(key);
        } else {
          params.set(key, value);
        }
      }
      router.push(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router]
  );

  return (
    <aside className={styles.sidebar}>
      {categories.length > 0 && (
        <div className={styles.filterGroup}>
          <p className={styles.filterTitle}>Категория</p>
          <ul className={styles.filterList}>
            {categories.map((cat) => (
              <li
                key={cat.slug}
                className={`${styles.filterItem} ${activeCategory === cat.slug ? styles.filterItemActive : ''}`}
                onClick={() => updateParam('category', cat.slug)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.filterGroup}>
        <p className={styles.filterTitle}>Цвет</p>
        <ul className={styles.filterList}>
          {COLORS.map((color) => (
            <li
              key={color}
              className={`${styles.filterItem} ${activeColors.includes(color) ? styles.filterItemActive : ''}`}
              onClick={() => updateParam('color', color, true)}
            >
              <span
                className={styles.colorSwatch}
                style={{ backgroundColor: COLOR_MAP[color] }}
              />
              {COLOR_LABELS[color] ?? color}
            </li>
          ))}
        </ul>
      </div>

      <div className={styles.filterGroup}>
        <p className={styles.filterTitle}>Размер</p>
        <ul className={styles.filterList}>
          {SIZES.map((size) => (
            <li
              key={size}
              className={`${styles.filterItem} ${activeSizes.includes(size) ? styles.filterItemActive : ''}`}
              onClick={() => updateParam('size', size, true)}
            >
              {size}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
