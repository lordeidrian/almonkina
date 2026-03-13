import { notFound } from "next/navigation";
import { ProductActions } from "@/components/shop/product-detail-actions";
import { formatMoney } from "@/lib/format";
import { getProductBySlug, getPublicSettings } from "@/lib/queries/public";

type ProductDetailPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  const [settings, product] = await Promise.all([getPublicSettings(), getProductBySlug(slug)]);

  if (!product) {
    notFound();
  }

  return (
    <article className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="surface overflow-hidden">
        <div className="aspect-[4/3] bg-slate-100">
          {product.main_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.main_image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-400">Sin imagen</div>
          )}
        </div>
      </div>

      <div className="surface p-6 sm:p-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">{product.name}</h1>
        <p className="mt-2 text-sm text-slate-500">{product.categories.map((category) => category.name).join(" · ")}</p>

        <div className="mt-5">
          {product.previous_price ? (
            <p className="text-sm text-slate-400 line-through">{formatMoney(product.previous_price, settings.currency_code)}</p>
          ) : null}
          <p className="text-3xl font-bold text-brand-primary">{formatMoney(product.price, settings.currency_code)}</p>
        </div>

        <p className="mt-5 whitespace-pre-line leading-relaxed text-slate-700">
          {product.long_description ?? product.short_description ?? product.description ?? "Producto personalizado"}
        </p>

        <div className="mt-8">
          <ProductActions product={product} />
        </div>
      </div>
    </article>
  );
}
