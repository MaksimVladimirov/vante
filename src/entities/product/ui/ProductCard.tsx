"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Product } from "../model/types";
import type { Locale } from "@/shared/i18n/locales";
import { pick } from "@/shared/i18n/pick";
import { toHex } from "@/shared/lib/color";
import { WishlistButton } from "@/features/toggle-wishlist/ui/WishlistButton";
import styles from "./ProductCard.module.css";

interface ProductCardProps {
  product: Product;
  lang: Locale;
}

export function ProductCard({ product, lang }: ProductCardProps) {
  const images = product.images.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (images.length <= 1) return;
    const rect = wrapperRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    const index = Math.min(
      Math.floor((x / rect.width) * images.length),
      images.length - 1,
    );
    setActiveIndex(index);
  };

  const handleMouseLeave = () => setActiveIndex(0);

  const name = pick(lang, product.name, product.name_en);
  return (
    <div className={styles.card}>
      <div className={styles.imageContainer}>
        <Link
          href={`/${lang}/catalog/${product.category?.slug ?? 'catalog'}/${product.slug}`}
          className={styles.imageLink}
          tabIndex={-1}
        >
          <div
            ref={wrapperRef}
            className={styles.imageWrapper}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {images.length > 0 ? (
              images.map((src, i) => (
                <Image
                  key={src}
                  src={src}
                  alt={`${name} ${i + 1}`}
                  fill
                  className={`${styles.image} ${activeIndex === i ? styles.imageActive : ""}`}
                  sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
                  unoptimized
                />
              ))
            ) : (
              <div className={styles.placeholder} />
            )}

            {images.length > 1 && (
              <div className={styles.dots}>
                {images.map((_, i) => (
                  <span
                    key={i}
                    className={`${styles.dot} ${activeIndex === i ? styles.dotActive : ""}`}
                  />
                ))}
              </div>
            )}
          </div>
        </Link>

        <WishlistButton productId={product.id} className={styles.wishlistBtn} />
      </div>

      <Link href={`/${lang}/catalog/${product.category?.slug ?? 'catalog'}/${product.slug}`} className={styles.info}>
        <div className={styles.infoRow}>
          <div className={styles.nameBlock}>
            <h3 className={styles.name}>{name}</h3>
            {product.colors.length > 0 && (
              <div className={styles.colorDots}>
                {product.colors.slice(0, 4).map((color) => (
                  <span
                    key={color}
                    className={styles.colorDot}
                    style={{ backgroundColor: toHex(color) }}
                    title={color}
                  />
                ))}
              </div>
            )}
          </div>
          <span className={styles.price}>
            {product.price.toLocaleString("ru-RU")} ₽
          </span>
        </div>
        {product.details && (
          <p className={styles.composition}>{product.details.split(".")[0]}</p>
        )}
      </Link>
    </div>
  );
}
