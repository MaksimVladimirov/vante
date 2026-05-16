"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback } from "react";
import { useLang } from "@/shared/i18n/LangContext";
import styles from "./ProductFilters.module.css";

const COLORS = [
  "Black",
  "Navy",
  "Grey",
  "White",
  "Charcoal",
  "Brown",
  "Beige",
  "Olive",
];
const SIZES = ["46 (S)", "48 (M)", "50 (L)", "52 (XL)"];

const COLOR_MAP: Record<string, string> = {
  Black: "#000",
  Navy: "#1a2b5f",
  Grey: "#808080",
  White: "#fff",
  Charcoal: "#36454f",
  Brown: "#8b5a2b",
  Beige: "#f5f0e8",
  Olive: "#6b7c5c",
};

interface ProductFiltersProps {
  categories?: Array<{ name: string; slug: string }>;
  availableSizes?: string[];
  availableColors?: string[];
}

export function ProductFilters({
  categories = [],
  availableSizes,
  availableColors,
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
            .filter((v) => v !== value)
            .forEach((v) => params.append(key, v));
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

      <div className={styles.filterGroup}>
        <p className={styles.filterTitle}>{dict.filters.color}</p>
        <ul className={styles.filterList}>
          {COLORS.map((color) => {
            const isDisabled =
              availableColors !== undefined && !availableColors.includes(color);
            const label =
              dict.filters.colors[color as keyof typeof dict.filters.colors] ??
              color;
            return (
              <li
                key={color}
                className={`${styles.filterItem} ${activeColors.includes(color) ? styles.filterItemActive : ""} ${isDisabled ? styles.filterItemDisabled : ""}`}
                onClick={() => !isDisabled && updateParam("color", color, true)}
              >
                <span
                  className={styles.colorSwatch}
                  style={{ backgroundColor: COLOR_MAP[color] }}
                />
                {label}
              </li>
            );
          })}
        </ul>
      </div>

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
    </aside>
  );
}
