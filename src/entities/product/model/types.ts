export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  details: string | null;
  price: number;
  category_id: string;
  images: string[];
  colors: string[];
  sizes: string[];
  stock: number;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
  category?: Category;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string | null;
}

export interface ProductFilters {
  category?: string;
  colors?: string[];
  sizes?: string[];
  sortBy?: 'newest' | 'price_asc' | 'price_desc';
}
