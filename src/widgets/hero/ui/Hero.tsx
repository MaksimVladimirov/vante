import Link from 'next/link';
import Image from 'next/image';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section className={styles.hero}>
      <Image
        src="/images/hero.jpg"
        alt="vanté hero"
        fill
        className={styles.bg}
        priority
      />
      <div className={styles.content}>
        <p className={styles.eyebrow}>Новая коллекция</p>
        <h1 className={styles.title}>
          Вне<br />времени
        </h1>
        <p className={styles.subtitle}>Создано для уверенности.</p>
        <Link href="/suits" className={styles.cta}>Смотреть коллекцию</Link>
      </div>
    </section>
  );
}
