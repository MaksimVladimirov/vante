"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "antd";
import type { ProductFilters } from "@/entities/product/model/types";
import type { Dictionary } from "@/shared/i18n/getDictionary";
import styles from "./CatalogSortSelect.module.css";

interface Props {
  currentSort: ProductFilters["sortBy"];
  dict: Dictionary;
}

export function CatalogSortSelect({ currentSort, dict }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (val: string) => {
    const params = new URLSearchParams(searchParams?.toString());
    params.set("sort", val);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className={styles.sortWrapper}>
      <span className={styles.sortLabel}>{dict.catalog.sort}</span>
      <Select
        value={currentSort}
        onChange={handleChange}
        options={[
          { value: "newest", label: dict.catalog.sortNewest },
          { value: "price_asc", label: dict.catalog.sortPriceAsc },
          { value: "price_desc", label: dict.catalog.sortPriceDesc },
        ]}
        style={{ width: 200 }}
        variant="borderless"
      />
    </div>
  );
}
