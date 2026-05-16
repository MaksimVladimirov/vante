export interface Product {
  id: string;
  name: string;
  name_en: string | null;
  slug: string;
  description: string | null;
  description_en: string | null;
  details: string | null;
  details_en: string | null;
  price: number;
  category_id: string;
  images: string[];
  colors: string[];
  sizes: string[];
  size_stock: Record<string, number>;
  stock: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  name_en: string | null;
  slug: string;
  image_url: string | null;
}

export interface ProductFilters {
  category?: string;
  colors?: string[];
  sizes?: string[];
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
}
