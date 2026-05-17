import type { Locale } from './locales'

export interface Dictionary {
  categories: { heading: string; viewAll: string }
  catalog: { sort: string; sortNewest: string; sortPriceAsc: string; sortPriceDesc: string }
  filters: {
    category: string; color: string; size: string
    colors: Record<string, string>
  }
  product: {
    notFound: string; loadMore: string; description: string; details: string
    shipping: string; shippingText: string; detailsDefault: string
    descriptionDefault: string; selectSize: string; outOfStock: string
    addToCart: string; sizeGuide: string; color: string; size: string
  }
  cart: {
    title: string; empty: string; subtotal: string; shipping: string
    free: string; total: string; checkout: string; remove: string
  }
  wishlist: {
    title: string; empty: string; add: string; remove: string
  }
  footer: {
    shop: string; suits: string; shirts: string; pants: string; accessories: string
    help: string; shipping: string; returns: string; faq: string
    contact: string; contactUs: string; careers: string; rights: string
  }
}

const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  ru: () => import('./dictionaries/ru.json').then((m) => m.default as Dictionary),
  en: () => import('./dictionaries/en.json').then((m) => m.default as Dictionary),
}

export async function getDictionary(locale: Locale): Promise<Dictionary> {
  return dictionaries[locale]()
}
