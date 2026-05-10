import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightOutlined } from '@ant-design/icons';
import { supabase } from '@/shared/api/supabase';
import styles from './CategorySection.module.css';

const FALLBACK_IMAGES: Record<string, string> = {
  suits: '/images/category-suits.jpg',
  shirts: '/images/category-shirts.jpg',
  accessories: '/images/category-accessories.jpg',
};

export async function CategorySection() {
  const { data: categories } = await supabase
    .from('categories')
    .select('*')
    .order('created_at');

  if (!categories?.length) return null;

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Категории</h2>
      <div className={styles.grid}>
        {categories.map((cat) => {
          const image = cat.image_url || FALLBACK_IMAGES[cat.slug] || null;
          const isExternal = image?.startsWith('http') ?? false;
          return (
            <Link key={cat.slug} href={`/${cat.slug}`} className={styles.card}>
              <div className={styles.imageWrapper}>
                {image ? (
                  <Image
                    src={image}
                    alt={cat.name}
                    fill
                    className={styles.image}
                    sizes="(max-width: 767px) 100vw, 33vw"
                    unoptimized={isExternal}
                  />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#1a1a1a' }} />
                )}
              </div>
              <div>
                <p className={styles.categoryName}>{cat.name}</p>
                <span className={styles.viewAll}>
                  Смотреть всё <ArrowRightOutlined />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
