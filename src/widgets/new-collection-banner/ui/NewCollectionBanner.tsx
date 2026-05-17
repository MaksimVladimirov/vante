import Link from 'next/link';
import Image from 'next/image';
import { ArrowRightOutlined } from '@ant-design/icons';
import styles from './NewCollectionBanner.module.css';

export function NewCollectionBanner() {
  return (
    <section className={styles.banner}>
      <Image
        src="/images/new-collection.jpg"
        alt="Новая коллекция Весна/Лето 2024"
        fill
        className={styles.bg}
      />
      <div className={styles.content}>
        <p className={styles.label}>Новая коллекция</p>
        <h2 className={styles.title}>
          Весна / Лето<br />2024
        </h2>
        <Link href="/catalog/suits" className={styles.cta}>
          Смотреть <ArrowRightOutlined />
        </Link>
      </div>
    </section>
  );
}
