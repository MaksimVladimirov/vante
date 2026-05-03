-- Categories
create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  image_url text,
  created_at timestamptz default now()
);

-- Products
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  details text,
  price numeric(10,2) not null,
  category_id uuid references categories(id) on delete set null,
  images text[] default '{}',
  colors text[] default '{}',
  sizes text[] default '{}',
  stock integer default 0,
  status text default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('ORD-' || to_char(now(), 'YYMMDD') || '-' || substr(gen_random_uuid()::text, 1, 6)),
  customer_email text not null,
  customer_name text,
  items jsonb not null default '[]',
  subtotal numeric(10,2) not null,
  shipping numeric(10,2) default 0,
  total numeric(10,2) not null,
  status text default 'new' check (status in ('new', 'paid', 'shipped', 'delivered', 'cancelled')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at
create or replace function update_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger products_updated_at
  before update on products
  for each row execute function update_updated_at();

create trigger orders_updated_at
  before update on orders
  for each row execute function update_updated_at();

-- Seed categories
insert into categories (name, slug) values
  ('Suits', 'suits'),
  ('Shirts', 'shirts'),
  ('Accessories', 'accessories')
on conflict (slug) do nothing;

-- RLS policies (enable for production)
-- alter table categories enable row level security;
-- alter table products enable row level security;
-- alter table orders enable row level security;
-- create policy "Public read products" on products for select using (status = 'active');
-- create policy "Public read categories" on categories for select using (true);
