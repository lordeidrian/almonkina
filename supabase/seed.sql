insert into public.site_settings (
  id,
  business_name,
  whatsapp_number,
  currency_code,
  order_message_template,
  color_primary,
  color_secondary,
  color_tertiary,
  color_background,
  color_text
)
values (
  true,
  'Almonkina Studio',
  '595981000000',
  'PYG',
  'Hola, quiero hacer este pedido:',
  '#0F172A',
  '#0EA5E9',
  '#14B8A6',
  '#F8FAFC',
  '#0F172A'
)
on conflict (id) do update
set
  business_name = excluded.business_name,
  whatsapp_number = excluded.whatsapp_number,
  currency_code = excluded.currency_code,
  order_message_template = excluded.order_message_template,
  color_primary = excluded.color_primary,
  color_secondary = excluded.color_secondary,
  color_tertiary = excluded.color_tertiary,
  color_background = excluded.color_background,
  color_text = excluded.color_text;

with inserted_categories as (
  insert into public.categories (name, slug, sort_order)
  values
    ('Tazas personalizadas', 'tazas', 1),
    ('Camisetas', 'camisetas', 2),
    ('Grabado láser', 'grabado-laser', 3)
  on conflict (slug) do update set name = excluded.name
  returning id, slug
),
inserted_products as (
  insert into public.products (
    name,
    slug,
    description,
    short_description,
    long_description,
    price,
    previous_price,
    is_featured,
    sort_order
  )
  values
    (
      'Taza blanca personalizada',
      'taza-blanca-personalizada',
      'Taza con diseño personalizado a elección.',
      'Taza con diseño a pedido.',
      'Taza de cerámica blanca, ideal para regalos o branding. Personalizable con nombre, foto o logo.',
      35000,
      42000,
      true,
      1
    ),
    (
      'Camiseta sublimada',
      'camiseta-sublimada',
      'Camiseta con impresión full color.',
      'Camiseta personalizada en full color.',
      'Camiseta de algodón con sublimación de alta calidad para eventos, marcas o regalos.',
      85000,
      99000,
      true,
      2
    ),
    (
      'Placa grabada láser',
      'placa-grabada-laser',
      'Placa de acrílico o madera con grabado.',
      'Placa para señalética o decoración.',
      'Grabado láser en placa de acrílico o madera con texto y diseño personalizado.',
      55000,
      null,
      false,
      3
    )
  on conflict (slug) do update
  set
    short_description = excluded.short_description,
    long_description = excluded.long_description,
    description = excluded.description,
    price = excluded.price,
    previous_price = excluded.previous_price,
    is_featured = excluded.is_featured
  returning id, slug
)
insert into public.product_categories (product_id, category_id)
select p.id, c.id
from inserted_products p
join inserted_categories c
  on (p.slug = 'taza-blanca-personalizada' and c.slug = 'tazas')
  or (p.slug = 'camiseta-sublimada' and c.slug = 'camisetas')
  or (p.slug = 'placa-grabada-laser' and c.slug = 'grabado-laser')
on conflict do nothing;
