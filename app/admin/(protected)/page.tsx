import Link from "next/link";
import { getDashboardStats } from "@/lib/queries/admin";

export default async function AdminPage() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <section className="surface p-6">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1>
        <p className="mt-2 text-slate-500">Resumen general del estado del catálogo y solicitudes.</p>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article className="surface p-5">
          <p className="text-sm text-slate-500">Productos</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.products}</p>
        </article>
        <article className="surface p-5">
          <p className="text-sm text-slate-500">Categorías</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.categories}</p>
        </article>
        <article className="surface p-5 sm:col-span-2 xl:col-span-1">
          <p className="text-sm text-slate-500">Leads</p>
          <p className="mt-2 text-3xl font-bold text-slate-900">{stats.leads}</p>
        </article>
      </section>

      <section className="surface p-5">
        <h2 className="text-lg font-semibold text-slate-900">Accesos rápidos</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link href="/admin/products/new" className="btn-primary">
            Nuevo producto
          </Link>
          <Link href="/admin/categories" className="btn-secondary">
            Gestionar categorías
          </Link>
          <Link href="/admin/branding" className="btn-secondary">
            Branding
          </Link>
        </div>
      </section>
    </div>
  );
}
