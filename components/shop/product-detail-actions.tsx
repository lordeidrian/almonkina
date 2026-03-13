"use client";

import Link from "next/link";
import { useCartStore } from "@/hooks/use-cart-store";
import type { Product } from "@/types/domain";

type ProductActionsProps = {
  product: Product;
};

export function ProductActions({ product }: ProductActionsProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="flex flex-wrap gap-3">
      <button type="button" onClick={() => addItem(product)} className="btn-primary">
        Agregar al carrito
      </button>
      <Link href="/cart" className="btn-secondary">
        Ir al carrito
      </Link>
    </div>
  );
}
