import { supabase } from '@/shared/api/supabase';
import { Header } from './Header';

export async function HeaderWrapper() {
  const { data: categories } = await supabase
    .from('categories')
    .select('name, slug')
    .order('created_at');

  const navLinks = (categories ?? []).map((cat) => ({
    href: `/${cat.slug}`,
    label: cat.name,
  }));

  return <Header navLinks={navLinks.length > 0 ? navLinks : undefined} />;
}
