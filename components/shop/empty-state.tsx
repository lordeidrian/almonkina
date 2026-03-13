import Link from "next/link";

export function EmptyState() {
  return (
    <section className="surface border-dashed p-10 text-center">
      <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">?</div>
      <h2 className="text-xl font-semibold text-slate-900">No encontramos productos</h2>
      <p className="mt-2 text-sm text-slate-500">Prueba con otra búsqueda o cambia la categoría.</p>
      <Link href="/shop" className="btn-primary mt-6">
        Ver todo el catálogo
      </Link>
    </section>
  );
}
