"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Select } from "antd";
import { useLang } from "@/shared/i18n/LangContext";
import { toHex } from "@/shared/lib/color";
import styles from "./ProductFilters.module.css";

const SIZES = ["46 (S)", "48 (M)", "50 (L)", "52 (XL)"];

function useFilterState(key: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlValues = searchParams?.getAll(key) ?? [];

  const [selected, setSelected] = useState<string[]>(urlValues);

  useEffect(() => {
    setSelected(urlValues);
  }, [urlValues.join(",")]);

  const update = (next: string[]) => {
    setSelected(next);
    const params = new URLSearchParams(searchParams?.toString() ?? "");
    params.delete(key);
    next.forEach((v) => params.append(key, v));
    router.replace(`${pathname}?${params.toString()}`);
  };

  return { selected, update };
}

// ── Только цвета ──────────────────────────────────────────
interface ColorFilterProps {
  availableColors: string[];
}

export function ColorFilter({ availableColors }: ColorFilterProps) {
  const { selected, update } = useFilterState("color");

  const toggle = (color: string) => {
    const next = selected.includes(color)
      ? selected.filter((c) => c !== color)
      : [...selected, color];
    update(next);
  };

  if (!availableColors.length) return null;

  return (
    <div className={styles.swatches}>
      {availableColors.map((color) => (
        <button
          key={color}
          type="button"
          className={`${styles.swatch} ${selected.includes(color) ? styles.swatchActive : ""}`}
          style={{ backgroundColor: toHex(color) }}
          onClick={() => toggle(color)}
          title={color}
        />
      ))}
    </div>
  );
}

// ── Только размеры ────────────────────────────────────────
interface SizeFilterProps {
  availableSizes?: string[];
}

export function SizeFilter({ availableSizes }: SizeFilterProps) {
  const { dict } = useLang();
  const { selected, update } = useFilterState("size");

  const options = (availableSizes ?? SIZES).map((size) => ({
    value: size,
    label: size,
    disabled: availableSizes !== undefined && !availableSizes.includes(size),
  }));

  return (
    <Select
      mode="multiple"
      placeholder={dict.filters.size}
      value={selected}
      onChange={update}
      options={options}
      showSearch={false}
      maxTagCount="responsive"
      variant="borderless"
      popupMatchSelectWidth={false}
      className={styles.sizeSelect}
    />
  );
}
