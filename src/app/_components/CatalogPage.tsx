'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Select } from 'antd';
import { ProductFilters } from '@/features/filter-products/ui/ProductFilters';
import { ProductGrid } from '@/widgets/product-grid/ui/ProductGrid';
import { fetchProducts } from '@/entities/product/model/api';
import type { Product, ProductFilters as Filters } from '@/entities/product/model/types';
import styles from '../catalog.module.css';

interface CatalogPageProps {
  categorySlug: string;
  title: string;
}

export function CatalogPage({ categorySlug, title }: CatalogPageProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const sortBy = (searchParams.get('sort') as Filters['sortBy']) || 'newest';
  const colors = searchParams.getAll('color');
  const sizes = searchParams.getAll('size');

  const availableColors = [...new Set(products.flatMap((p) => p.colors))];
  const availableSizes = [...new Set(products.flatMap((p) => p.sizes))];

  useEffect(() => {
    setLoading(true);
    fetchProducts({ category: categorySlug, colors, sizes, sortBy })
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [categorySlug, searchParams.toString()]);

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>{title}</h1>
        <div className={styles.sortWrapper}>
          <span className={styles.sortLabel}>Сортировка</span>
          <Select
            value={sortBy}
            onChange={(val) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set('sort', val);
              window.history.pushState(null, '', `?${params.toString()}`);
            }}
            options={[
              { value: 'newest', label: 'Новинки' },
              { value: 'price_asc', label: 'Цена: по возрастанию' },
              { value: 'price_desc', label: 'Цена: по убыванию' },
            ]}
            style={{ width: 200 }}
            variant="borderless"
          />
        </div>
      </div>

      <div className={styles.body}>
        <ProductFilters availableSizes={loading ? undefined : availableSizes} availableColors={loading ? undefined : availableColors} />
        <div className={styles.products}>
          <ProductGrid products={products} loading={loading} />
        </div>
      </div>
    </div>
  );
}
