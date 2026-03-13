create extension if not exists pgcrypto;

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  is_active boolean not null default true,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  description text,
  price numeric(12,2) not null check (price >= 0),
  image_url text,
  is_active boolean not null default true,
  is_featured boolean not null default false,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.product_categories (
  product_id uuid not null references public.products(id) on delete cascade,
  category_id uuid not null references public.categories(id) on delete cascade,
  primary key (product_id, category_id)
);

create table if not exists public.site_settings (
  id boolean primary key default true check (id = true),
  business_name text not null,
  logo_url text,
  favicon_url text,
  whatsapp_number text not null,
  currency_code text not null default 'PYG',
  order_message_template text not null default 'Hola, quiero hacer este pedido:',
  color_primary text not null default '#111827',
  color_secondary text not null default '#2563EB',
  color_tertiary text,
  color_background text,
  color_text text,
  updated_by uuid references auth.users(id),
  updated_at timestamptz not null default now()
);

create table if not exists public.order_leads (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  customer_phone text,
  items_json jsonb not null,
  total_estimated numeric(12,2) not null check (total_estimated >= 0),
  status text not null check (status in ('pending_whatsapp', 'confirmed', 'cancelled')) default 'pending_whatsapp',
  created_at timestamptz not null default now()
);

create index if not exists idx_products_active on public.products(is_active);
create index if not exists idx_categories_active on public.categories(is_active);
create index if not exists idx_order_leads_created_at on public.order_leads(created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_products_updated_at
before update on public.products
for each row execute function public.set_updated_at();

create trigger trg_categories_updated_at
before update on public.categories
for each row execute function public.set_updated_at();

create trigger trg_site_settings_updated_at
before update on public.site_settings
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.product_categories enable row level security;
alter table public.site_settings enable row level security;
alter table public.order_leads enable row level security;

create policy "public read categories active"
on public.categories for select
to anon, authenticated
using (is_active = true);

create policy "public read products active"
on public.products for select
to anon, authenticated
using (is_active = true);

create policy "public read product_categories"
on public.product_categories for select
to anon, authenticated
using (true);

create policy "public read site_settings"
on public.site_settings for select
to anon, authenticated
using (true);

create policy "public insert order_leads"
on public.order_leads for insert
to anon, authenticated
with check (true);

create policy "admin full categories"
on public.categories for all
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active));

create policy "admin full products"
on public.products for all
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active));

create policy "admin full product_categories"
on public.product_categories for all
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active));

create policy "admin full site_settings"
on public.site_settings for all
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active));

create policy "admin read order_leads"
on public.order_leads for select
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active));

create policy "admin update order_leads"
on public.order_leads for update
to authenticated
using (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active))
with check (exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active));
