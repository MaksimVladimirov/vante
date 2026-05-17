"use client";

import { useState } from "react";
import { ProductCard } from "@/entities/product/ui/ProductCard";
import type { Product } from "@/entities/product/model/types";
import { useLang } from "@/shared/i18n/LangContext";
import styles from "./ProductGrid.module.css";

const PAGE_SIZE = 6;

interface ProductGridProps {
  products: Product[];
  loading?: boolean;
}

export function ProductGrid({ products, loading }: ProductGridProps) {
  const { lang, dict } = useLang();
  const [visible, setVisible] = useState(PAGE_SIZE);

  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className={styles.skeleton} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.grid}>
        <p className={styles.empty}>{dict.product.notFound}</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.grid}>
        {products.slice(0, visible).map((product) => (
          <ProductCard key={product.id} product={product} lang={lang} />
        ))}
      </div>
      {visible < products.length && (
        <div className={styles.loadMore}>
          <button
            className={styles.loadMoreBtn}
            onClick={() => setVisible((count) => count + PAGE_SIZE)}
          >
            {dict.product.loadMore}
          </button>
        </div>
      )}
    </>
  );
}
