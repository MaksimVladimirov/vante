import Link from 'next/link';
import Image from 'next/image';
import type { Product } from '../model/types';
import styles from './ProductCard.module.css';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const imageUrl = product.images[0] || '/images/placeholder.jpg';

  return (
    <Link href={`/products/${product.slug}`} className={styles.card}>
      <div className={styles.imageWrapper}>
        <Image
          src={imageUrl}
          alt={product.name}
          fill
          className={styles.image}
          sizes="(max-width: 576px) 50vw, (max-width: 992px) 33vw, 25vw"
        />
      </div>
      <div className={styles.info}>
        <h3 className={styles.name}>{product.name}</h3>
        <span className={styles.price}>${product.price.toLocaleString()}</span>
      </div>
    </Link>
  );
}
