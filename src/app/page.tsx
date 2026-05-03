import { Hero } from '@/widgets/hero/ui/Hero';
import { CategorySection } from '@/widgets/category-section/ui/CategorySection';
import { NewCollectionBanner } from '@/widgets/new-collection-banner/ui/NewCollectionBanner';

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategorySection />
      <NewCollectionBanner />
    </>
  );
}
