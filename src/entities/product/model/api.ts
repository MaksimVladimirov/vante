import { supabase } from '@/shared/api/supabase';
import type { Product, ProductFilters } from './types';

export async function fetchProducts(filters?: ProductFilters): Promise<Product[]> {
  let query = supabase
    .from('products')
    .select('*, category:categories!inner(*)')
    .eq('status', 'active');

  if (filters?.category) {
    query = query.eq('categories.slug', filters.category);
  }
  if (filters?.colors?.length) {
    query = query.overlaps('colors', filters.colors);
  }
  if (filters?.sizes?.length) {
    query = query.overlaps('sizes', filters.sizes);
  }

  switch (filters?.sortBy) {
    case 'price_asc':
      query = query.order('price', { ascending: true });
      break;
    case 'price_desc':
      query = query.order('price', { ascending: false });
      break;
    default:
      query = query.order('created_at', { ascending: false });
  }

  const { data, error } = await query;
  if (error) throw error;
  return data as Product[];
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .eq('slug', slug)
    .single();

  if (error) return null;
  return data as Product;
}

export async function fetchProductsByIds(ids: string[]): Promise<Product[]> {
  if (!ids.length) return []
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .in('id', ids)
  if (error) throw error
  return data as Product[]
}

export async function fetchCategories() {
  const { data, error } = await supabase.from('categories').select('*');
  if (error) throw error;
  return data;
}
