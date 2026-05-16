"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "antd";
import type { ProductFilters } from "@/entities/product/model/types";
import styles from "../catalog.module.css";

interface Props {
  currentSort: ProductFilters["sortBy"];
}

export function CatalogSortSelect({ currentSort }: Props) {
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
      <span className={styles.sortLabel}>Сортировка</span>
      <Select
        value={currentSort}
        onChange={handleChange}
        options={[
          { value: "newest", label: "Новинки" },
          { value: "price_asc", label: "Цена: по возрастанию" },
          { value: "price_desc", label: "Цена: по убыванию" },
        ]}
        style={{ width: 200 }}
        variant="borderless"
      />
    </div>
  );
}
