"use client";

import { useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { Category } from "@/types/domain";

type ShopFiltersProps = {
  categories: Category[];
};

export function ShopFilters({ categories }: ShopFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const activeCategory = searchParams.get("category") ?? "";
  const activeQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(activeQuery);

  const categoryOptions = useMemo(() => [{ slug: "", name: "Todas" }, ...categories], [categories]);

  const update = (nextQuery: string, nextCategory: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (nextQuery.trim()) {
      params.set("q", nextQuery.trim());
    } else {
      params.delete("q");
    }

    if (nextCategory) {
      params.set("category", nextCategory);
    } else {
      params.delete("category");
    }

    const next = params.toString();
    router.push(next ? `${pathname}?${next}` : pathname);
  };

  return (
    <section className="surface p-4 sm:p-5">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          update(query, activeCategory);
        }}
        className="grid gap-3 md:grid-cols-[1.8fr_1fr_auto]"
      >
        <input
          type="search"
          placeholder="Buscar productos..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          className="input-base"
        />

        <select
          value={activeCategory}
          onChange={(event) => update(query, event.target.value)}
          className="input-base"
        >
          {categoryOptions.map((category) => (
            <option key={category.slug || "all"} value={category.slug}>
              {category.name}
            </option>
          ))}
        </select>

        <button type="submit" className="btn-primary h-11 px-5">
          Buscar
        </button>
      </form>
      <p className="mt-3 text-xs text-slate-500">Usa búsqueda y filtros para encontrar más rápido.</p>
    </section>
  );
}
