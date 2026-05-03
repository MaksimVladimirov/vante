import { Suspense } from 'react';
import { CatalogPage } from '@/app/_components/CatalogPage';

export const metadata = { title: 'Рубашки — vanté' };

export default function ShirtsPage() {
  return (
    <Suspense>
      <CatalogPage categorySlug="shirts" title="Рубашки" />
    </Suspense>
  );
}
