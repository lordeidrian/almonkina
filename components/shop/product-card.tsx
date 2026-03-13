"use client";

import Link from "next/link";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatMoney } from "@/lib/format";
import type { Product } from "@/types/domain";

type ProductCardProps = {
  product: Product;
  currencyCode: string;
};

export function ProductCard({ product, currencyCode }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <article className="group overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/shop/${product.slug}`}>
        <div className="relative aspect-[4/3] bg-slate-100">
          {product.main_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={product.main_image_url} alt={product.name} className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-slate-400">Sin imagen</div>
          )}
          {product.is_featured ? (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-medium text-slate-700">Destacado</span>
          ) : null}
        </div>
      </Link>

      <div className="space-y-4 p-4">
        <div>
          <h3 className="line-clamp-1 text-base font-semibold text-slate-900">{product.name}</h3>
          <p className="mt-1 min-h-10 text-sm text-slate-500 line-clamp-2">
            {product.short_description ?? product.description ?? "Producto personalizado"}
          </p>
        </div>

        <div className="flex items-end justify-between gap-3">
          <div>
            {product.previous_price ? (
              <p className="text-xs text-slate-400 line-through">{formatMoney(product.previous_price, currencyCode)}</p>
            ) : null}
            <p className="text-base font-bold text-brand-primary">{formatMoney(product.price, currencyCode)}</p>
          </div>
          <button type="button" onClick={() => addItem(product)} className="btn-primary px-3.5 py-2 text-xs sm:text-sm">
            Agregar
          </button>
        </div>
      </div>
    </article>
  );
}
