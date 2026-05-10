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

-- Site settings (hero image, text, etc.)
create table if not exists site_settings (
  key text primary key,
  value text
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

-- Seed categories (Russian names, upsert to update existing English names)
insert into categories (name, slug) values
  ('Костюмы', 'suits'),
  ('Рубашки', 'shirts'),
  ('Аксессуары', 'accessories'),
  ('Брюки', 'pants')
on conflict (slug) do update set name = excluded.name;

-- Default hero settings
insert into site_settings (key, value) values
  ('hero_image', '/images/hero.jpg'),
  ('hero_eyebrow', 'Новая коллекция'),
  ('hero_title', 'Вне\nвремени'),
  ('hero_subtitle', 'Создано для уверенности.'),
  ('hero_cta_text', 'Смотреть коллекцию'),
  ('hero_cta_link', '/suits')
on conflict (key) do nothing;

-- Suits seed products
insert into products (name, slug, description, price, category_id, sizes, colors, stock, status) values
  ('Костюм Milano', 'kostyum-milano', 'Двубортный костюм из итальянской шерсти', 85000, (select id from categories where slug = 'suits'), array['44','46','48','50','52','54'], array['Black','Navy'], 8, 'active'),
  ('Костюм Roma', 'kostyum-roma', 'Однобортный костюм классического кроя', 72000, (select id from categories where slug = 'suits'), array['44','46','48','50','52','54'], array['Charcoal','Grey'], 10, 'active'),
  ('Костюм Venezia', 'kostyum-venezia', 'Костюм-тройка из тонкой шерсти', 95000, (select id from categories where slug = 'suits'), array['44','46','48','50','52','54'], array['Black','Navy'], 5, 'active'),
  ('Костюм Firenze', 'kostyum-firenze', 'Летний костюм из льна', 68000, (select id from categories where slug = 'suits'), array['44','46','48','50','52','54'], array['Beige','Grey'], 12, 'active'),
  ('Костюм Torino', 'kostyum-torino', 'Slim-fit костюм для особых случаев', 78000, (select id from categories where slug = 'suits'), array['44','46','48','50','52','54'], array['Black','Charcoal'], 7, 'active'),
  ('Костюм Napoli', 'kostyum-napoli', 'Неаполитанский костюм ручного пошива', 120000, (select id from categories where slug = 'suits'), array['44','46','48','50','52','54'], array['Navy','Grey'], 4, 'active'),
  ('Костюм Monza', 'kostyum-monza', 'Деловой костюм из мериносовой шерсти', 88000, (select id from categories where slug = 'suits'), array['44','46','48','50','52','54'], array['Charcoal','Black'], 9, 'active'),
  ('Костюм Genova', 'kostyum-genova', 'Костюм в полоску классического кроя', 76000, (select id from categories where slug = 'suits'), array['44','46','48','50','52','54'], array['Navy','Charcoal'], 6, 'active')
on conflict (slug) do nothing;

-- Shirts seed products
insert into products (name, slug, description, price, category_id, sizes, colors, stock, status) values
  ('Рубашка Oxford', 'rubashka-oxford', 'Классическая рубашка из оксфордского хлопка', 8500, (select id from categories where slug = 'shirts'), array['XS','S','M','L','XL'], array['White','Blue'], 25, 'active'),
  ('Рубашка Slim White', 'rubashka-slim-white', 'Приталенная белая рубашка', 7800, (select id from categories where slug = 'shirts'), array['XS','S','M','L','XL'], array['White'], 30, 'active'),
  ('Рубашка Poplin', 'rubashka-poplin', 'Рубашка из поплина с итальянским воротником', 9200, (select id from categories where slug = 'shirts'), array['XS','S','M','L','XL'], array['White','Black'], 20, 'active'),
  ('Рубашка Twill', 'rubashka-twill', 'Рубашка из твила делового стиля', 10500, (select id from categories where slug = 'shirts'), array['XS','S','M','L','XL'], array['Navy','White'], 18, 'active'),
  ('Рубашка Linen', 'rubashka-linen', 'Льняная рубашка для тёплого сезона', 8900, (select id from categories where slug = 'shirts'), array['XS','S','M','L','XL'], array['White','Beige'], 22, 'active'),
  ('Рубашка French Cuff', 'rubashka-french-cuff', 'Рубашка с французскими манжетами', 12000, (select id from categories where slug = 'shirts'), array['XS','S','M','L','XL'], array['White','Black'], 15, 'active'),
  ('Рубашка Flannel', 'rubashka-flannel', 'Рубашка из фланели для прохладной погоды', 9800, (select id from categories where slug = 'shirts'), array['XS','S','M','L','XL'], array['Grey','Navy'], 16, 'active'),
  ('Рубашка Premium Cotton', 'rubashka-premium', 'Рубашка из египетского хлопка', 14500, (select id from categories where slug = 'shirts'), array['XS','S','M','L','XL'], array['White','Blue'], 10, 'active')
on conflict (slug) do nothing;

-- 50 pants products
insert into products (name, slug, description, price, category_id, sizes, colors, stock, status) values
  ('Брюки Venezia', 'bryuki-venezia', 'Классические брюки итальянского кроя из тонкой шерсти', 24000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Navy'], 15, 'active'),
  ('Брюки Milano', 'bryuki-milano', 'Элегантные брюки миланского кроя', 22000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy','Grey'], 12, 'active'),
  ('Брюки Roma', 'bryuki-roma', 'Строгие брюки прямого кроя', 20000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Grey','Charcoal'], 18, 'active'),
  ('Брюки Firenze', 'bryuki-firenze', 'Брюки флорентийского кроя с высокой посадкой', 26000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Charcoal','Black'], 10, 'active'),
  ('Брюки Torino', 'bryuki-torino', 'Деловые брюки из смесовой шерсти', 21000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Beige'], 14, 'active'),
  ('Брюки Bologna', 'bryuki-bologna', 'Мягкие брюки свободного силуэта', 19000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy','Brown'], 20, 'active'),
  ('Брюки Napoli', 'bryuki-napoli', 'Неаполитанские брюки ручного пошива', 23000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Grey','Black'], 8, 'active'),
  ('Брюки Genova', 'bryuki-genova', 'Брюки в морском стиле из плотной ткани', 25000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Charcoal','Navy'], 11, 'active'),
  ('Брюки Palermo', 'bryuki-palermo', 'Летние брюки из лёгкого хлопка', 18000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Beige','Olive'], 22, 'active'),
  ('Брюки Verona', 'bryuki-verona', 'Классические брюки с защипами', 20000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Brown','Black'], 16, 'active'),
  ('Брюки Parma', 'bryuki-parma', 'Зауженные брюки делового стиля', 22000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Grey'], 13, 'active'),
  ('Брюки Pisa', 'bryuki-pisa', 'Классические брюки из шерстяного габардина', 20000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy','Charcoal'], 17, 'active'),
  ('Брюки Siena', 'bryuki-siena', 'Брюки в стиле casual-formal', 21000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Grey','Brown'], 15, 'active'),
  ('Брюки Lecce', 'bryuki-lecce', 'Южноитальянские брюки из льна', 23000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Charcoal','Black'], 9, 'active'),
  ('Брюки Bari', 'bryuki-bari', 'Лёгкие брюки для тёплого сезона', 19000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Navy'], 21, 'active'),
  ('Брюки Padova', 'bryuki-padova', 'Брюки с итальянской строчкой', 26000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy','Grey'], 7, 'active'),
  ('Брюки Trieste', 'bryuki-trieste', 'Брюки с фактурной тканью в елочку', 25000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Grey','Charcoal'], 12, 'active'),
  ('Брюки Modena', 'bryuki-modena', 'Брюки из мериносовой шерсти', 27000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Charcoal','Brown'], 10, 'active'),
  ('Брюки Ravenna', 'bryuki-ravenna', 'Классические брюки с боковыми карманами', 24000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy','Black'], 14, 'active'),
  ('Брюки Monza', 'bryuki-monza', 'Спортивно-деловые брюки премиум-класса', 28000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Charcoal'], 8, 'active'),
  ('Слим Venezia', 'slim-venezia', 'Зауженные брюки итальянского кроя', 22000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Navy'], 16, 'active'),
  ('Слим Milano', 'slim-milano', 'Узкие брюки в миланском стиле', 20000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy','Grey'], 18, 'active'),
  ('Слим Roma', 'slim-roma', 'Slim-fit брюки строгого кроя', 21000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Grey','Black'], 15, 'active'),
  ('Слим Firenze', 'slim-firenze', 'Зауженные брюки с высокой посадкой', 23000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Charcoal','Navy'], 11, 'active'),
  ('Слим Torino', 'slim-torino', 'Slim-fit из смесовой шерсти', 19000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Grey'], 19, 'active'),
  ('Чинос Classic', 'chinos-classic', 'Классические чинос из хлопка', 16000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Olive','Beige'], 25, 'active'),
  ('Чинос Slim', 'chinos-slim', 'Зауженные чинос повседневного кроя', 15000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Beige','Navy'], 30, 'active'),
  ('Чинос Regular', 'chinos-regular', 'Прямые чинос из плотного хлопка', 17000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy','Charcoal'], 22, 'active'),
  ('Чинос Cotton', 'chinos-cotton', 'Чинос из чистого хлопка', 16000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Charcoal','Black'], 28, 'active'),
  ('Чинос Premium', 'chinos-premium', 'Премиальные чинос из египетского хлопка', 18000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Olive'], 20, 'active'),
  ('Шерстяные Merino', 'sherstyanye-merino', 'Брюки из чистой мериносовой шерсти', 35000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Navy'], 6, 'active'),
  ('Кашемировые Cashmere', 'kashemirovye-cashmere', 'Брюки из кашемира высшего сорта', 45000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy','Grey'], 4, 'active'),
  ('Твидовые Tweed', 'tvidovye-tweed', 'Британские твидовые брюки', 32000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Brown','Grey'], 7, 'active'),
  ('Фланелевые Flannel', 'flanelevye-flannel', 'Брюки из мягкой фланели', 30000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Grey','Charcoal'], 9, 'active'),
  ('Льняные Linen', 'lnyanye-linen', 'Лёгкие льняные брюки', 22000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Beige','Olive'], 18, 'active'),
  ('Брюки со стрелками Arrow', 'bryuki-arrow', 'Брюки с отглаженными стрелками', 24000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Navy'], 13, 'active'),
  ('Брюки с защипами Pleat', 'bryuki-pleat', 'Брюки с декоративными защипами', 22000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy','Grey'], 15, 'active'),
  ('Брюки Straight', 'bryuki-straight', 'Брюки прямого кроя классической длины', 21000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Charcoal','Black'], 17, 'active'),
  ('Брюки Tapered', 'bryuki-tapered', 'Брюки с зауженным низом', 23000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Navy'], 14, 'active'),
  ('Брюки Wide', 'bryuki-wide', 'Широкие брюки в стиле oversized', 25000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Grey','Charcoal'], 10, 'active'),
  ('Вечерние Gala', 'vechernye-gala', 'Вечерние брюки с шёлковой отделкой', 28000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Navy'], 8, 'active'),
  ('Брюки Tuxedo', 'bryuki-tuxedo', 'Брюки для смокинга с атласным кантом', 30000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black'], 5, 'active'),
  ('Летние Summer', 'bryuki-summer', 'Ультралёгкие летние брюки', 14000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Beige','Olive'], 30, 'active'),
  ('Осенние Autumn', 'bryuki-autumn', 'Плотные брюки для прохладной погоды', 18000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Brown','Grey'], 20, 'active'),
  ('Зимние Winter', 'bryuki-winter', 'Утеплённые брюки из плотной шерсти', 26000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Charcoal','Black'], 12, 'active'),
  ('Брюки Pinstripe', 'bryuki-pinstripe', 'Брюки в тонкую полоску', 25000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black','Navy'], 11, 'active'),
  ('Брюки Check', 'bryuki-check', 'Брюки в клетку принца Уэльского', 23000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Grey','Brown'], 9, 'active'),
  ('Premium Platinum', 'bryuki-premium-platinum', 'Брюки высшей категории из итальянской шерсти', 42000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black'], 3, 'active'),
  ('Premium Gold', 'bryuki-premium-gold', 'Брюки премиум-класса из шерсти Loro Piana', 40000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Navy'], 4, 'active'),
  ('Exclusive Edition', 'bryuki-exclusive', 'Эксклюзивные брюки ограниченного тиража', 55000, (select id from categories where slug = 'pants'), array['44','46','48','50','52','54'], array['Black'], 2, 'active')
on conflict (slug) do nothing;

-- RLS policies (enable for production)
-- alter table categories enable row level security;
-- alter table products enable row level security;
-- alter table orders enable row level security;
-- alter table site_settings enable row level security;
-- create policy "Public read products" on products for select using (status = 'active');
-- create policy "Public read categories" on categories for select using (true);
-- create policy "Public read settings" on site_settings for select using (true);
