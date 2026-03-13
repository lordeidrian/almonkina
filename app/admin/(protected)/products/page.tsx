import Link from "next/link";
import { softDeleteProductAction, toggleProductActiveAction } from "@/lib/admin/actions";
import { getAdminProducts } from "@/lib/queries/admin";
import { formatMoney } from "@/lib/format";

type AdminProductsPageProps = {
  searchParams: Promise<{ saved?: string; created?: string }>;
};

export default async function AdminProductsPage({ searchParams }: AdminProductsPageProps) {
  const [params, products] = await Promise.all([searchParams, getAdminProducts()]);

  return (
    <div className="space-y-5">
      <section className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Productos</h1>
          <p className="text-sm text-slate-500">Administra el catálogo principal.</p>
        </div>
        <Link href="/admin/products/new" className="btn-primary">
          Crear producto
        </Link>
      </section>

      {params.saved || params.created ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Cambios guardados correctamente.</p>
      ) : null}

      <div className="surface overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-slate-50 text-left text-slate-600">
              <tr>
                <th className="px-4 py-3">Nombre</th>
                <th className="px-4 py-3">Precio</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product: any) => (
                <tr key={product.id} className="border-t border-slate-100">
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-900">{product.name}</p>
                    <p className="text-xs text-slate-500">/{product.slug}</p>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{formatMoney(Number(product.price), "PYG")}</td>
                  <td className="px-4 py-3">
                    {product.deleted_at ? (
                      <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">Eliminado lógico</span>
                    ) : product.is_active ? (
                      <span className="rounded-full bg-emerald-100 px-2 py-1 text-xs text-emerald-700">Activo</span>
                    ) : (
                      <span className="rounded-full bg-amber-100 px-2 py-1 text-xs text-amber-700">Inactivo</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link href={`/admin/products/${product.id}`} className="btn-secondary px-3 py-1.5 text-xs">
                        Editar
                      </Link>

                      <form action={toggleProductActiveAction.bind(null, product.id, Boolean(product.is_active))}>
                        <button type="submit" className="btn-secondary px-3 py-1.5 text-xs">
                          {product.is_active ? "Desactivar" : "Activar"}
                        </button>
                      </form>

                      <form action={softDeleteProductAction.bind(null, product.id)}>
                        <button type="submit" className="rounded-xl border border-red-300 bg-white px-3 py-1.5 text-xs text-red-700 hover:bg-red-50">
                          Eliminar lógico
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
