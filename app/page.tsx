import Link from "next/link";
import { ProductGrid } from "@/components/shop/product-grid";
import { formatMoney } from "@/lib/format";
import { getCategories, getProducts, getPublicSettings } from "@/lib/queries/public";

export default async function HomePage() {
  const [settings, featuredProducts, categories, catalog] = await Promise.all([
    getPublicSettings(),
    getProducts({ featured: true }),
    getCategories(),
    getProducts({})
  ]);
  const latestProducts = catalog.slice(0, 4);
  const heroProducts = (featuredProducts.length > 0 ? featuredProducts : catalog).slice(0, 2);
  const heroPrimaryProduct = heroProducts[0] ?? null;
  const heroSecondaryProducts = catalog
    .filter((product) => product.id !== heroPrimaryProduct?.id)
    .slice(0, 2);
  const heroCategories = categories.slice(0, 4);
  const fromPrice = catalog.length > 0 ? Math.min(...catalog.map((product) => product.price)) : null;

  return (
    <div className="space-y-10">
      <section className="surface overflow-hidden p-0">
        <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="relative overflow-hidden p-6 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -left-16 top-4 h-44 w-44 rounded-full bg-[color:var(--brand-secondary)]/20 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 right-10 h-48 w-48 rounded-full bg-[color:var(--brand-tertiary)]/20 blur-3xl" />

            <p className="badge-soft bg-[color-mix(in_oklab,var(--brand-secondary),white_84%)] text-slate-700">Tienda online</p>
            <h1 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Todo para tus productos personalizados, en un solo lugar
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Descubre productos listos para personalizar, compara precios y confirma tu pedido de forma directa por WhatsApp.
            </p>
            {fromPrice ? (
              <p className="mt-4 text-sm font-medium text-slate-700">
                Precios desde <span className="font-bold text-brand-primary">{formatMoney(fromPrice, settings.currency_code)}</span>
              </p>
            ) : null}

            <div className="mt-6 flex flex-wrap gap-2">
              {heroCategories.map((category) => (
                <Link
                  key={category.id}
                  href={`/shop?category=${category.slug}`}
                  className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-400 hover:text-slate-900"
                >
                  {category.name}
                </Link>
              ))}
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary h-11 px-6">
                Explorar tienda
              </Link>
              <Link href="/cart" className="btn-secondary h-11 px-6">
                Ver carrito
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-200 bg-slate-50/70 p-5 sm:p-6 lg:border-l lg:border-t-0 lg:p-8">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm font-semibold text-slate-900">Vitrina destacada</p>
              <Link href="/shop" className="text-xs font-medium text-brand-primary hover:underline">
                Ver todo
              </Link>
            </div>

            {heroPrimaryProduct ? (
              <Link href={`/shop/${heroPrimaryProduct.slug}`} className="group block overflow-hidden rounded-2xl border border-slate-200 bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
                  {heroPrimaryProduct.main_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={heroPrimaryProduct.main_image_url}
                      alt={heroPrimaryProduct.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-sm text-slate-400">Sin imagen</div>
                  )}
                  <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-medium text-slate-700">
                    Recomendado
                  </span>
                </div>

                <div className="p-4">
                  <p className="line-clamp-1 text-base font-semibold text-slate-900">{heroPrimaryProduct.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                    {heroPrimaryProduct.short_description ?? heroPrimaryProduct.description ?? "Producto personalizado"}
                  </p>
                  <div className="mt-3 flex items-center justify-between">
                    <p className="text-lg font-bold text-brand-primary">
                      {formatMoney(heroPrimaryProduct.price, settings.currency_code)}
                    </p>
                    <span className="rounded-lg border border-slate-300 px-2.5 py-1 text-xs font-medium text-slate-700 transition group-hover:border-slate-400">
                      Ver detalle
                    </span>
                  </div>
                </div>
              </Link>
            ) : null}

            <div className="mt-3 space-y-3">
              {heroSecondaryProducts.map((product) => (
                <Link
                  key={product.id}
                  href={`/shop/${product.slug}`}
                  className="group flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-3 transition hover:-translate-y-0.5 hover:shadow-sm"
                >
                  <div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-100">
                    {product.main_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={product.main_image_url}
                        alt={product.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[10px] text-slate-400">Sin imagen</div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-sm font-semibold text-slate-900">{product.name}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-slate-500">
                      {product.short_description ?? product.description ?? "Producto personalizado"}
                    </p>
                    <p className="mt-1 text-sm font-bold text-brand-primary">
                      {formatMoney(product.price, settings.currency_code)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-4 rounded-xl border border-dashed border-slate-300 bg-white px-3 py-2">
              <p className="text-xs text-slate-600">
                Pedido online simple: agrega productos, completa nombre y telefono, y envia en un toque a WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Compra por categoría</h2>
            <p className="text-sm text-slate-500">Navega más rápido según el tipo de producto que necesitas.</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-brand-primary hover:underline">
            Ver tienda completa
          </Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="surface group p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <p className="text-sm font-semibold text-slate-900">{category.name}</p>
              <p className="mt-2 text-xs text-slate-500">Explorar productos de esta categoría</p>
              <p className="mt-4 text-xs font-medium text-brand-primary group-hover:underline">Ver productos</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Destacados</h2>
            <p className="text-sm text-slate-500">Selección curada de productos populares.</p>
          </div>
          <Link href="/shop" className="text-sm font-medium text-brand-primary hover:underline">
            Ver todos
          </Link>
        </div>

        {featuredProducts.length > 0 ? (
          <ProductGrid products={featuredProducts} currencyCode={settings.currency_code} />
        ) : (
          <p className="surface p-8 text-sm text-slate-500">Aun no hay destacados configurados.</p>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-semibold text-slate-900">Novedades</h2>
            <p className="text-sm text-slate-500">Productos activos del catálogo para descubrir más opciones.</p>
          </div>
        </div>

        {latestProducts.length > 0 ? (
          <ProductGrid products={latestProducts} currencyCode={settings.currency_code} />
        ) : (
          <p className="surface p-8 text-sm text-slate-500">Todavía no hay productos disponibles.</p>
        )}
      </section>
    </div>
  );
}
