export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { AdminOrdersClient } from './AdminOrdersClient';

export const metadata = { title: 'Orders — Admin' };

export default function AdminOrdersPage() {
  return (
    <Suspense>
      <AdminOrdersClient />
    </Suspense>
  );
}
