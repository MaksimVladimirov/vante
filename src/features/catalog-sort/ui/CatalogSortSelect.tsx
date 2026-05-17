"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Select } from "antd";
import type { ProductFilters } from "@/entities/product/model/types";
import type { Dictionary } from "@/shared/i18n/getDictionary";

interface Props {
  currentSort: ProductFilters["sortBy"];
  dict: Dictionary;
}

export function CatalogSortSelect({ currentSort, dict }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [selected, setSelected] = useState<string>(currentSort ?? "newest");

  useEffect(() => {
    setSelected(currentSort ?? "newest");
  }, [currentSort]);

  const handleChange = (val: string) => {
    setSelected(val);
    const params = new URLSearchParams(searchParams?.toString());
    params.set("sort", val);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <Select
      value={selected}
      onChange={handleChange}
      options={[
        { value: "newest",     label: dict.catalog.sortNewest },
        { value: "price_asc",  label: dict.catalog.sortPriceAsc },
        { value: "price_desc", label: dict.catalog.sortPriceDesc },
      ]}
      variant="borderless"
      popupMatchSelectWidth={false}
    />
  );
}
