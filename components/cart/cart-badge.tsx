"use client";

import Link from "next/link";
import { useCartStore } from "@/hooks/use-cart-store";

export function CartBadge() {
  const totalItems = useCartStore((state) => state.totalItems());

  return (
    <Link href="/cart" className="relative inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-slate-700 transition hover:border-slate-400 hover:bg-slate-50">
      <span>Carrito</span>
      <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-brand-secondary px-2 py-0.5 text-xs font-semibold text-white">
        {totalItems}
      </span>
    </Link>
  );
}
