import { EmptyState } from "@/components/shop/empty-state";
import { ProductGrid } from "@/components/shop/product-grid";
import { ShopFilters } from "@/components/shop/shop-filters";
import { getCategories, getProducts, getPublicSettings } from "@/lib/queries/public";

type ShopPageProps = {
  searchParams: Promise<{
    q?: string;
    category?: string;
  }>;
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [settings, categories, products] = await Promise.all([
    getPublicSettings(),
    getCategories(),
    getProducts({ search: params.q, category: params.category })
  ]);

  return (
    <div className="space-y-6">
      <section className="surface p-6 sm:p-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Tienda</h1>
        <p className="mt-2 text-slate-600">Explora, filtra y agrega al carrito lo que quieras personalizar.</p>
      </section>

      <ShopFilters categories={categories} />

      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {products.length} resultado{products.length === 1 ? "" : "s"}
        </p>
      </div>

      {products.length > 0 ? (
        <ProductGrid products={products} currencyCode={settings.currency_code} />
      ) : (
        <EmptyState />
      )}
    </div>
  );
}
