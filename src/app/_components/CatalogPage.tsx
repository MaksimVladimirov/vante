import { Suspense } from "react";
import { fetchProducts } from "@/entities/product/model/api";
import { ProductFilters } from "@/features/filter-products/ui/ProductFilters";
import { ProductGrid } from "@/widgets/product-grid/ui/ProductGrid";
import { CatalogSortSelect } from "./CatalogSortSelect";
import type { ProductFilters as Filters } from "@/entities/product/model/types";
import styles from "../catalog.module.css";

type SearchParams = Record<string, string | string[] | undefined>;

interface CatalogPageProps {
  categorySlug: string;
  title: string;
  searchParams: SearchParams;
}

export async function CatalogPage({
  categorySlug,
  title,
  searchParams,
}: CatalogPageProps) {
  const sortRaw = searchParams.sort;
  const sortBy = (
    typeof sortRaw === "string" ? sortRaw : "newest"
  ) as Filters["sortBy"];

  const colorRaw = searchParams.color;
  const colors = Array.isArray(colorRaw)
    ? colorRaw
    : colorRaw
      ? [colorRaw]
      : [];

  const sizeRaw = searchParams.size;
  const sizes = Array.isArray(sizeRaw) ? sizeRaw : sizeRaw ? [sizeRaw] : [];

  const products = await fetchProducts({
    category: categorySlug,
    colors,
    sizes,
    sortBy,
  });

  const availableColors = [...new Set(products.flatMap((p) => p.colors))];
  const availableSizes = [...new Set(products.flatMap((p) => p.sizes))];

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <h1 className={styles.pageTitle}>{title}</h1>

        <CatalogSortSelect currentSort={sortBy} />
      </div>

      <div className={styles.body}>
        <ProductFilters
          availableSizes={availableSizes}
          availableColors={availableColors}
        />

        <div className={styles.products}>
          <ProductGrid products={products} />
        </div>
      </div>
    </div>
  );
}
