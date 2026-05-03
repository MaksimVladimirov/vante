import { Suspense } from 'react';
import { CatalogPage } from '@/app/_components/CatalogPage';

export const metadata = { title: 'Аксессуары — vanté' };

export default function AccessoriesPage() {
  return (
    <Suspense>
      <CatalogPage categorySlug="accessories" title="Аксессуары" />
    </Suspense>
  );
}
