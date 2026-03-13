alter table public.products
  add column if not exists short_description text,
  add column if not exists long_description text,
  add column if not exists previous_price numeric(12,2),
  add column if not exists main_image_url text,
  add column if not exists gallery_urls jsonb not null default '[]'::jsonb,
  add column if not exists deleted_at timestamptz;

update public.products
set short_description = coalesce(short_description, description),
    main_image_url = coalesce(main_image_url, image_url)
where short_description is null or main_image_url is null;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'products_gallery_urls_is_array'
  ) then
    alter table public.products
      add constraint products_gallery_urls_is_array
      check (jsonb_typeof(gallery_urls) = 'array');
  end if;
end $$;

drop policy if exists "admin can read own row" on public.admin_users;
create policy "admin can read own row"
on public.admin_users for select
to authenticated
using (user_id = auth.uid());

insert into storage.buckets (id, name, public)
values
  ('branding', 'branding', true),
  ('products', 'products', true)
on conflict (id) do nothing;

drop policy if exists "public read branding objects" on storage.objects;
create policy "public read branding objects"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'branding');

drop policy if exists "public read products objects" on storage.objects;
create policy "public read products objects"
on storage.objects for select
to anon, authenticated
using (bucket_id = 'products');

drop policy if exists "admin manage branding objects" on storage.objects;
create policy "admin manage branding objects"
on storage.objects for all
to authenticated
using (
  bucket_id = 'branding'
  and exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active)
)
with check (
  bucket_id = 'branding'
  and exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active)
);

drop policy if exists "admin manage products objects" on storage.objects;
create policy "admin manage products objects"
on storage.objects for all
to authenticated
using (
  bucket_id = 'products'
  and exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active)
)
with check (
  bucket_id = 'products'
  and exists (select 1 from public.admin_users a where a.user_id = auth.uid() and a.is_active)
);
