'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AppstoreOutlined,
  ShoppingOutlined,
  TagsOutlined,
  PictureOutlined,
  FolderOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { logoutAction } from '@/app/admin/login/actions';
import styles from './AdminSidebar.module.css';

const navItems = [
  { href: '/admin', label: 'Дашборд', icon: <AppstoreOutlined /> },
  { href: '/admin/products', label: 'Товары', icon: <TagsOutlined /> },
  { href: '/admin/orders', label: 'Заказы', icon: <ShoppingOutlined /> },
  { href: '/admin/categories', label: 'Категории', icon: <FolderOutlined /> },
  { href: '/admin/hero', label: 'Главная страница', icon: <PictureOutlined /> },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link href="/admin" className={styles.brand}>
        MVXIII admin
      </Link>

      <p className={styles.label}>Меню</p>
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.storeLinkWrapper}>
        <Link href="/" className={styles.storeLink}>← В магазин</Link>
        <form action={logoutAction}>
          <button type="submit" className={styles.logoutButton}>
            <LogoutOutlined />
            Выйти
          </button>
        </form>
      </div>
    </aside>
  );
}
