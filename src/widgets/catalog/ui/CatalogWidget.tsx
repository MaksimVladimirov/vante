import { fetchProducts } from "@/entities/product/model/api";
import { ColorFilter, SizeFilter } from "@/features/filter-products/ui/ProductFilters";
import { ProductGrid } from "@/features/product-grid/ui/ProductGrid";
import { CatalogSortSelect } from "@/features/catalog-sort/ui/CatalogSortSelect";
import type { ProductFilters as Filters } from "@/entities/product/model/types";
import type { Dictionary } from "@/shared/i18n/getDictionary";
import styles from "./catalog.module.css";

type SearchParams = Record<string, string | string[] | undefined>;

interface CatalogWidgetProps {
  dict: Dictionary;
  categorySlug: string;
  title: string;
  searchParams: SearchParams;
}

export async function CatalogWidget({ dict, categorySlug, title, searchParams }: CatalogWidgetProps) {
  const sortRaw = searchParams.sort;
  const sortBy = (typeof sortRaw === "string" ? sortRaw : "newest") as Filters["sortBy"];

  const colorRaw = searchParams.color;
  const colors = Array.isArray(colorRaw) ? colorRaw : colorRaw ? [colorRaw] : [];

  const sizeRaw = searchParams.size;
  const sizes = Array.isArray(sizeRaw) ? sizeRaw : sizeRaw ? [sizeRaw] : [];

  const [products, allProducts] = await Promise.all([
    fetchProducts({ category: categorySlug, colors, sizes, sortBy }),
    fetchProducts({ category: categorySlug }),
  ]);

  const allColors = [...new Set(allProducts.flatMap((p) => p.colors ?? []).filter(Boolean))];
  const allSizes  = [...new Set(allProducts.flatMap((p) => p.sizes  ?? []).filter(Boolean))];

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{title}</h1>

      {/* Строка 1: цвета */}
      <div className={styles.colorsRow}>
        <ColorFilter availableColors={allColors} />
      </div>

      {/* Строка 2: размер слева, сортировка справа */}
      <div className={styles.controlsRow}>
        <SizeFilter availableSizes={allSizes} />
        <CatalogSortSelect currentSort={sortBy} dict={dict} />
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
