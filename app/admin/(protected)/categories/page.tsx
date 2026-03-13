import { createCategoryAction, toggleCategoryAction, updateCategoryAction } from "@/lib/admin/actions";
import { getAdminCategories } from "@/lib/queries/admin";

type AdminCategoriesPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminCategoriesPage({ searchParams }: AdminCategoriesPageProps) {
  const [params, categories] = await Promise.all([searchParams, getAdminCategories()]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Categorías</h1>
        <p className="text-sm text-slate-500">Organiza los productos por tipo de servicio o producto.</p>
      </div>

      {params.saved ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Cambios guardados correctamente.</p>
      ) : null}

      <form action={createCategoryAction} className="surface grid gap-3 p-5 md:grid-cols-5">
        <input name="name" placeholder="Nombre" required className="input-base" />
        <input name="slug" placeholder="slug" required className="input-base" />
        <input name="sort_order" type="number" defaultValue={0} className="input-base" />
        <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
          <input type="checkbox" name="is_active" defaultChecked /> Activa
        </label>
        <button type="submit" className="btn-primary">
          Crear
        </button>
      </form>

      <div className="space-y-3">
        {categories.map((category: any) => (
          <form key={category.id} action={updateCategoryAction.bind(null, category.id)} className="surface grid gap-3 p-4 md:grid-cols-6">
            <input name="name" defaultValue={category.name} required className="input-base" />
            <input name="slug" defaultValue={category.slug} required className="input-base" />
            <input name="sort_order" type="number" defaultValue={category.sort_order} className="input-base" />
            <label className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-700">
              <input type="checkbox" name="is_active" defaultChecked={Boolean(category.is_active)} /> Activa
            </label>
            <button type="submit" className="btn-secondary">
              Guardar
            </button>
            <button formAction={toggleCategoryAction.bind(null, category.id, Boolean(category.is_active))} className="btn-secondary">
              {category.is_active ? "Desactivar" : "Activar"}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
