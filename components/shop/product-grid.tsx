import { ProductCard } from "@/components/shop/product-card";
import type { Product } from "@/types/domain";

type ProductGridProps = {
  products: Product[];
  currencyCode: string;
};

export function ProductGrid({ products, currencyCode }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} currencyCode={currencyCode} />
      ))}
    </div>
  );
}
