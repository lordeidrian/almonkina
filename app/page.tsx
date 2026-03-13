import Link from "next/link";
import { ProductGrid } from "@/components/shop/product-grid";
import { getProducts, getPublicSettings } from "@/lib/queries/public";

export default async function HomePage() {
  const [settings, featuredProducts] = await Promise.all([
    getPublicSettings(),
    getProducts({ featured: true })
  ]);

  return (
    <div className="space-y-12">
      <section className="surface overflow-hidden p-6 sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div>
            <p className="badge-soft bg-[color-mix(in_oklab,var(--brand-secondary),white_80%)] text-slate-700">Catálogo personalizado</p>
            <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">Productos y servicios hechos a tu medida</h1>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Elige productos personalizados, arma tu carrito y envía tu pedido por WhatsApp en pocos pasos.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/shop" className="btn-primary">
                Explorar tienda
              </Link>
              <Link href="/cart" className="btn-secondary">
                Ver carrito
              </Link>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Proceso rápido</p>
              <p className="mt-1 text-sm font-medium text-slate-800">Catálogo, carrito y WhatsApp sin fricción.</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs uppercase tracking-wide text-slate-500">Branding vivo</p>
              <p className="mt-1 text-sm font-medium text-slate-800">Colores y marca configurables desde admin.</p>
            </article>
          </div>
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
    </div>
  );
}
