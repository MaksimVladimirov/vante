"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useLang } from "@/shared/i18n/LangContext";
import { toHex } from "@/shared/lib/color";
import styles from "./ProductFilters.module.css";

const SIZES = ["46 (S)", "48 (M)", "50 (L)", "52 (XL)"];

interface ProductFiltersProps {
  categories?: Array<{ name: string; slug: string }>;
  availableSizes?: string[];
  availableColors?: string[];
}

export function ProductFilters({
  categories = [],
  availableSizes,
  availableColors = [],
}: ProductFiltersProps) {
  const { dict } = useLang();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams?.get("category") ?? "";
  const activeColors = searchParams?.getAll("color") ?? [];
  const activeSizes = searchParams?.getAll("size") ?? [];

  const updateParam = useCallback(
    (key: string, value: string, multi = false) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      if (multi) {
        const existing = params.getAll(key);
        if (existing.includes(value)) {
          params.delete(key);
          existing
            .filter((param) => param !== value)
            .forEach((param) => params.append(key, param));
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
    [searchParams, pathname, router],
  );

  return (
    <aside className={styles.sidebar}>
      {categories.length > 0 && (
        <div className={styles.filterGroup}>
          <p className={styles.filterTitle}>{dict.filters.category}</p>
          <ul className={styles.filterList}>
            {categories.map((cat) => (
              <li
                key={cat.slug}
                className={`${styles.filterItem} ${activeCategory === cat.slug ? styles.filterItemActive : ""}`}
                onClick={() => updateParam("category", cat.slug)}
              >
                {cat.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      {availableColors.length > 0 && (
        <div className={styles.filterGroup}>
          <p className={styles.filterTitle}>{dict.filters.color}</p>
          <ul className={styles.colorList}>
            {availableColors.map((color) => (
              <li
                key={color}
                className={`${styles.colorItem} ${activeColors.includes(color) ? styles.colorItemActive : ""}`}
                onClick={() => updateParam("color", color, true)}
                title={color}
              >
                <span
                  className={styles.colorSwatch}
                  style={{ backgroundColor: toHex(color) }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className={styles.filterGroup}>
        <p className={styles.filterTitle}>{dict.filters.size}</p>
        <ul className={styles.filterList}>
          {SIZES.map((size) => {
            const isDisabled =
              availableSizes !== undefined && !availableSizes.includes(size);
            return (
              <li
                key={size}
                className={`${styles.filterItem} ${activeSizes.includes(size) ? styles.filterItemActive : ""} ${isDisabled ? styles.filterItemDisabled : ""}`}
                onClick={() => !isDisabled && updateParam("size", size, true)}
              >
                {size}
              </li>
            );
          })}
        </ul>
      </div>

      {(activeColors.length > 0 || activeSizes.length > 0 || activeCategory) && (
        <button
          className={styles.resetBtn}
          onClick={() => router.push(pathname)}
        >
          {dict.filters.reset}
        </button>
      )}
    </aside>
  );
}
