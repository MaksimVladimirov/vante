'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ShoppingOutlined, CloseOutlined } from '@ant-design/icons'
import { useCartTotals, useCartStore } from '@/entities/cart/model/store'
import styles from './Header.module.css'

const FALLBACK_NAV = [
  { href: '/accessories', label: 'Аксессуары' },
  { href: '/pants', label: 'Брюки' },
  { href: '/suits', label: 'Костюмы' },
  { href: '/shirts', label: 'Рубашки' },
]

interface HeaderProps {
  navLinks?: Array<{ href: string; label: string }>
}

export function Header({ navLinks = FALLBACK_NAV }: HeaderProps) {
  const pathname = usePathname()
  const { itemCount } = useCartTotals()
  const openCart = useCartStore((s) => s.openCart)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [visible, setVisible] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      const atTop = y < 10
      const goingUp = y < lastScrollY.current
      setScrolled(!atTop)
      setVisible(atTop || goingUp)
      lastScrollY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const solid = scrolled || menuOpen

  return (
    <>
      <header
        className={[
          styles.header,
          solid ? styles.solid : styles.transparent,
          visible || menuOpen ? styles.visible : styles.hidden,
        ].join(' ')}
      >
        <div className={styles.inner}>
          <button
            className={styles.btn}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Закрыть меню' : 'Открыть меню'}
          >
            {menuOpen ? (
              <CloseOutlined style={{ fontSize: 16 }} />
            ) : (
              <span className={styles.burger}>
                <span /><span /><span />
              </span>
            )}
          </button>

          <Link href="/" className={styles.logo}>MVXIII</Link>

          <button
            className={`${styles.btn} ${styles.cartBtn}`}
            onClick={openCart}
            aria-label="Открыть корзину"
          >
            <ShoppingOutlined style={{ fontSize: 18 }} />
            {itemCount > 0 && <span className={styles.badge}>{itemCount}</span>}
          </button>
        </div>
      </header>

      <div
        className={`${styles.overlay} ${menuOpen ? styles.overlayOpen : ''}`}
        aria-hidden={!menuOpen}
      >
        <nav className={styles.overlayNav}>
          {navLinks.map((link) => (
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
  )
}
