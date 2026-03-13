import Link from "next/link";

export default function NotFound() {
  return (
    <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
      <h1 className="text-2xl font-semibold text-slate-900">No encontramos esta página</h1>
      <p className="mt-2 text-slate-500">Puede que el producto o ruta ya no exista.</p>
      <Link href="/shop" className="mt-6 inline-flex rounded-lg bg-brand-primary px-4 py-2 text-white">
        Volver a tienda
      </Link>
    </section>
  );
}
