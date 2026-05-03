import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightOutlined } from '@ant-design/icons';
import styles from './CategorySection.module.css';

const categories = [
  { name: 'Костюмы', href: '/suits', image: '/images/category-suits.jpg' },
  { name: 'Рубашки', href: '/shirts', image: '/images/category-shirts.jpg' },
  { name: 'Аксессуары', href: '/accessories', image: '/images/category-accessories.jpg' },
];

export function CategorySection() {
  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Категории</h2>
      <div className={styles.grid}>
        {categories.map((cat) => (
          <Link key={cat.name} href={cat.href} className={styles.card}>
            <div className={styles.imageWrapper}>
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                className={styles.image}
                sizes="(max-width: 767px) 100vw, 33vw"
              />
            </div>
            <div>
              <p className={styles.categoryName}>{cat.name}</p>
              <span className={styles.viewAll}>
                Смотреть всё <ArrowRightOutlined />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
