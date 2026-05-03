import Link from 'next/link';
import { CarOutlined, ReloadOutlined, SafetyOutlined } from '@ant-design/icons';
import styles from './Footer.module.css';

const features = [
  { icon: <CarOutlined />, title: 'Бесплатная доставка', desc: 'для всех заказов' },
  { icon: <ReloadOutlined />, title: 'Простой возврат', desc: 'в течение 30 дней' },
  { icon: <SafetyOutlined />, title: 'Безопасная оплата', desc: 'защищённый checkout' },
];

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.features}>
        <div className={styles.featuresInner}>
          {features.map((f) => (
            <div key={f.title} className={styles.featureItem}>
              <span className={styles.featureIcon}>{f.icon}</span>
              <div className={styles.featureText}>
                <p className={styles.featureTitle}>{f.title}</p>
                <p className={styles.featureDesc}>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.main}>
        <div className={styles.mainInner}>
          <div>
            <Link href="/" className={styles.brand}>vanté</Link>
            <p className={styles.brandSub}>by Maxim Vladimirov</p>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Магазин</p>
            <Link href="/suits" className={styles.colLink}>Костюмы</Link>
            <Link href="/shirts" className={styles.colLink}>Рубашки</Link>
            <Link href="/accessories" className={styles.colLink}>Аксессуары</Link>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Помощь</p>
            <Link href="/shipping" className={styles.colLink}>Доставка</Link>
            <Link href="/returns" className={styles.colLink}>Возврат</Link>
            <Link href="/faq" className={styles.colLink}>FAQ</Link>
          </div>

          <div className={styles.col}>
            <p className={styles.colTitle}>Контакты</p>
            <Link href="mailto:hello@vante.ru" className={styles.colLink}>Написать нам</Link>
            <Link href="/careers" className={styles.colLink}>Карьера</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <div className={styles.bottomInner}>
          © {new Date().getFullYear()} vanté by Maxim Vladimirov. Все права защищены.
        </div>
      </div>
    </footer>
  );
}
