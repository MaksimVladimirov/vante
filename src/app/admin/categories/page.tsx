export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { AdminCategoriesClient } from './AdminCategoriesClient';

export const metadata = { title: 'Категории — Admin' };

export default function CategoriesPage() {
  return (
    <Suspense>
      <AdminCategoriesClient />
    </Suspense>
  );
}
