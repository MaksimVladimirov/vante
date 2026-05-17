'use client'

import { Drawer } from 'antd'
import Image from 'next/image'
import { CloseOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { useCartStore, useCartTotals } from '@/entities/cart/model/store'
import { useLang } from '@/shared/i18n/LangContext'
import styles from './CartDrawer.module.css'

export function CartDrawer() {
  const { dict } = useLang()
  const items = useCartStore((store) => store.items)
  const isOpen = useCartStore((store) => store.isOpen)
  const closeCart = useCartStore((store) => store.closeCart)
  const removeItem = useCartStore((store) => store.removeItem)
  const updateQuantity = useCartStore((store) => store.updateQuantity)
  const { subtotal, shipping, total } = useCartTotals()

  return (
    <Drawer
      title={`${dict.cart.title} (${items.length})`}
      placement="right"
      onClose={closeCart}
      open={isOpen}
      rootClassName={styles.drawerRoot}
    >
      {items.length === 0 ? (
        <div className={styles.empty}>
          <p className={styles.emptyText}>{dict.cart.empty}</p>
        </div>
      ) : (
        <>
          <div>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <div className={styles.itemImage}>
                  {item.image && (
                    <Image src={item.image} alt={item.name} fill className={styles.coverImage} />
                  )}
                </div>
                <div className={styles.itemInfo}>
                  <p className={styles.itemName}>{item.name}</p>
                  <p className={styles.itemMeta}>{item.size}</p>
                  <div className={styles.itemQuantity}>
                    <button
                      className={styles.qtyBtn}
                      onClick={() =>
                        item.quantity > 1
                          ? updateQuantity(item.id, item.quantity - 1)
                          : removeItem(item.id)
                      }
                    >
                      <MinusOutlined style={{ fontSize: 10 }} />
                    </button>
                    <span className={styles.qtyNum}>{item.quantity}</span>
                    <button
                      className={styles.qtyBtn}
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      <PlusOutlined style={{ fontSize: 10 }} />
                    </button>
                  </div>
                </div>
                <div className={styles.itemActions}>
                  <button
                    className={styles.removeBtn}
                    onClick={() => removeItem(item.id)}
                    aria-label={dict.cart.remove}
                  >
                    <CloseOutlined />
                  </button>
                  <span className={styles.itemPrice}>
                    {(item.price * item.quantity).toLocaleString('ru-RU')} ₽
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span>{dict.cart.subtotal}</span>
              <span>{subtotal.toLocaleString('ru-RU')} ₽</span>
            </div>
            <div className={styles.summaryRow}>
              <span>{dict.cart.shipping}</span>
              <span>
                {shipping === 0 ? dict.cart.free : `${shipping.toLocaleString('ru-RU')} ₽`}
              </span>
            </div>
            <div className={`${styles.summaryRow} ${styles.summaryRowTotal}`}>
              <span>{dict.cart.total}</span>
              <span>{total.toLocaleString('ru-RU')} ₽</span>
            </div>
          </div>

          <button className={styles.checkoutBtn}>{dict.cart.checkout}</button>
        </>
      )}
    </Drawer>
  )
}
