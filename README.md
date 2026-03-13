# Almonkina MVP

Base funcional para catálogo tipo tienda con carrito local y pedido por WhatsApp.

## Stack

- Next.js App Router
- TypeScript estricto
- Tailwind CSS
- Supabase (DB/Auth/Storage)
- Netlify

## Requisitos

- Node.js 18+ (recomendado 20+)
- Proyecto Supabase creado

## Instalación

1. Instalar dependencias:

```bash
npm install
```

2. Copiar variables:

```bash
cp .env.example .env.local
```

3. Completar `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_SITE_URL`
- `ENABLE_LEAD_CAPTURE=true` (opcional)

4. Ejecutar migración y seed en Supabase SQL editor:

- `supabase/migrations/001_init.sql`
- `supabase/migrations/002_admin_panel.sql`
- `supabase/seed.sql`

5. Levantar en local:

```bash
npm run dev
```

Abrir `http://localhost:3000`.

## Flujo MVP implementado

- Home + tienda + detalle de producto
- Búsqueda y filtro por categoría
- Carrito cliente con `localStorage` (Zustand)
- Pedido por WhatsApp con mensaje automático
- Registro opcional de lead en `order_leads`
- Panel admin protegido en `/admin`
- CRUD de productos/categorías
- Settings generales y branding con subida de archivos a Supabase Storage

## Setup admin

1. Crea un usuario en **Supabase Auth** (Email/Password).
2. Inserta ese usuario en `admin_users`:

```sql
insert into public.admin_users (user_id, is_active)
values ('UUID_DEL_USUARIO_AUTH', true)
on conflict (user_id) do update set is_active = excluded.is_active;
```

3. Ingresa en `/admin/login` con ese email/contraseña.

## Deploy en Netlify

- Conectar repositorio en Netlify
- Configurar las mismas variables de entorno
- Se usa `@netlify/plugin-nextjs` vía `netlify.toml`
