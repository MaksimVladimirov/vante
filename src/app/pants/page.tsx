import { Suspense } from 'react';
import { CatalogPage } from '@/app/_components/CatalogPage';

export const metadata = { title: 'Брюки — vanté' };

export default function PantsPage() {
  return (
    <Suspense>
      <CatalogPage categorySlug="pants" title="Брюки" />
    </Suspense>
  );
}
