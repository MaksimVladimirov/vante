"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MenuOutlined, CloseOutlined } from "@ant-design/icons";
import { useCartTotals, useCartStore } from "@/entities/cart/model/store";
import styles from "./Header.module.css";

const FALLBACK_NAV = [
  { href: "/suits", label: "Костюмы" },
  { href: "/shirts", label: "Рубашки" },
  { href: "/pants", label: "Брюки" },
  { href: "/accessories", label: "Аксессуары" },
];

interface HeaderProps {
  navLinks?: Array<{ href: string; label: string }>;
}

export function Header({ navLinks = FALLBACK_NAV }: HeaderProps) {
  const pathname = usePathname();
  const { itemCount } = useCartTotals();
  const openCart = useCartStore((s) => s.openCart);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          MVXIII
        </Link>

        <nav className={styles.nav}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`${styles.navLink} ${pathname?.startsWith(link.href) ? styles.navLinkActive : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.bagButton}
            onClick={openCart}
            aria-label="Открыть корзину"
          >
            Корзина ({itemCount})
          </button>
          <button
            className={styles.mobileMenuBtn}
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Открыть меню"
          >
            {mobileOpen ? <CloseOutlined /> : <MenuOutlined />}
          </button>
        </div>
      </div>

      <nav
        className={`${styles.mobileNav} ${mobileOpen ? styles.mobileNavOpen : ""}`}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={styles.mobileNavLink}
            onClick={() => setMobileOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
