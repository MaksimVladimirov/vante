export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { AdminHeroClient } from './AdminHeroClient';

export const metadata = { title: 'Главная страница — Admin' };

export default function HeroSettingsPage() {
  return (
    <Suspense>
      <AdminHeroClient />
    </Suspense>
  );
}
