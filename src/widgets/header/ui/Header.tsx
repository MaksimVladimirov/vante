"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ShoppingOutlined, CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useCartTotals, useCartStore } from "@/entities/cart/model/store";
import type { Locale } from "@/shared/i18n/locales";
import { LOCALES } from "@/shared/i18n/locales";
import styles from "./Header.module.css";

const FALLBACK_NAV: Record<Locale, Array<{ href: string; label: string }>> = {
  ru: [
    { href: "/ru/accessories", label: "Аксессуары" },
    { href: "/ru/pants", label: "Брюки" },
    { href: "/ru/suits", label: "Костюмы" },
    { href: "/ru/shirts", label: "Рубашки" },
  ],
  en: [
    { href: "/en/accessories", label: "Accessories" },
    { href: "/en/pants", label: "Trousers" },
    { href: "/en/suits", label: "Suits" },
    { href: "/en/shirts", label: "Shirts" },
  ],
};

interface HeaderProps {
  lang: Locale;
  navLinks?: Array<{ href: string; label: string }>;
}

export function Header({ lang, navLinks }: HeaderProps) {
  const links = navLinks ?? FALLBACK_NAV[lang];
  const pathname = usePathname();
  const { itemCount } = useCartTotals();
  const openCart = useCartStore((s) => s.openCart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const atTop = y < 10;
      const goingUp = y < lastScrollY.current;
      setScrolled(!atTop);
      setVisible(atTop || goingUp);
      lastScrollY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isHome = pathname === `/${lang}` || pathname === "/";
  const solid = !isHome || scrolled || menuOpen;

  const router = useRouter();

  const handleLangChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const next = e.target.value as Locale;
    const target = pathname?.replace(`/${lang}`, `/${next}`) || `/${next}`;
    router.push(target);
  };

  return (
    <>
      <header
        className={[
          styles.header,
          solid ? styles.solid : styles.transparent,
          visible || menuOpen ? styles.visible : styles.hidden,
        ].join(" ")}
      >
        <div className={styles.inner}>
          <button
            className={styles.btn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? (
              <CloseOutlined style={{ fontSize: 16 }} />
            ) : (
              <span className={styles.burger}>
                <span />
                <span />
                <span />
              </span>
            )}
          </button>

          <Link href={`/${lang}`} className={styles.logo} onClick={() => setMenuOpen(false)}>
            MVXIII
          </Link>

          <div className={styles.actions}>
            <select
              className={styles.langSelect}
              value={lang}
              onChange={handleLangChange}
              aria-label="Language"
            >
              {LOCALES.map((l) => (
                <option key={l} value={l}>
                  {l.toUpperCase()}
                </option>
              ))}
            </select>
            <button
              className={`${styles.btn} ${styles.cartBtn}`}
              onClick={openCart}
              aria-label="Open cart"
            >
              <ShoppingOutlined style={{ fontSize: 18 }} />
              {itemCount > 0 && (
                <span className={styles.badge}>{itemCount}</span>
              )}
            </button>
          </div>
        </div>
      </header>

      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ""}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.overlayNav}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={styles.overlayLink}
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
}
