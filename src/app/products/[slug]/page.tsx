import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Collapse } from 'antd';
import { fetchProductBySlug } from '@/entities/product/model/api';
import { AddToCart } from '@/features/add-to-cart/ui/AddToCart';
import styles from './page.module.css';

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await fetchProductBySlug(slug);

  if (!product) notFound();

  return (
    <div className={styles.page}>
      <div className={styles.gallery}>
        {product.images.map((img, i) => (
          <div key={i} className={styles.galleryItem}>
            <Image
              src={img}
              alt={`${product.name} ${i + 1}`}
              fill
              className={styles.galleryImage}
              sizes="(max-width: 768px) 100vw, 50vw"
              priority={i === 0}
            />
          </div>
        ))}
        {product.images.length === 0 && (
          <div className={styles.galleryItem}>
            <div className={styles.placeholder} />
          </div>
        )}
      </div>

      {/* <div className={styles.info}>
        <div className={styles.infoSticky}>
          {product.category && (
            <p className={styles.category}>{product.category.name}</p>
          )}
          <h1 className={styles.name}>{product.name}</h1>
          <p className={styles.price}>{product.price.toLocaleString('ru-RU')} ₽</p>

          <AddToCart product={product} />

          <div className={styles.accordions}>
            <Collapse
              ghost
              items={[
                {
                  key: 'description',
                  label: 'Описание',
                  children: (
                    <p className={styles.accordionText}>
                      {product.description || 'Вневременная вещь из первоклассных материалов.'}
                    </p>
                  ),
                },
                {
                  key: 'details',
                  label: 'Детали',
                  children: (
                    <p className={styles.accordionText}>
                      {product.details || 'Только сухая чистка. Произведено в Италии.'}
                    </p>
                  ),
                },
                {
                  key: 'shipping',
                  label: 'Доставка и возврат',
                  children: (
                    <p className={styles.accordionText}>
                      Бесплатная доставка для всех заказов. Простой возврат в течение 30 дней.
                    </p>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div> */}
    </div>
  );
}
