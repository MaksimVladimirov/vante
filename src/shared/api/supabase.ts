import { createClient } from '@supabase/supabase-js';
import type { Database } from './database.types';

let _client: ReturnType<typeof createClient<Database>> | null = null;

export function getSupabase() {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) throw new Error('Supabase env vars are not set');
    _client = createClient<Database>(url, key);
  }
  return _client;
}

export const supabase = new Proxy({} as ReturnType<typeof createClient<Database>>, {
  get(_target, prop) {
    return getSupabase()[prop as keyof ReturnType<typeof createClient<Database>>];
  },
});
