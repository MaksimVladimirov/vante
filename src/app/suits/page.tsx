import { Suspense } from 'react';
import { CatalogPage } from '@/app/_components/CatalogPage';

export const metadata = { title: 'Костюмы — vanté' };

export default function SuitsPage() {
  return (
    <Suspense>
      <CatalogPage categorySlug="suits" title="Костюмы" />
    </Suspense>
  );
}
