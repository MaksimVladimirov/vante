export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { AdminProductsClient } from './AdminProductsClient';

export const metadata = { title: 'Products — Admin' };

export default function AdminProductsPage() {
  return (
    <Suspense>
      <AdminProductsClient />
    </Suspense>
  );
}
