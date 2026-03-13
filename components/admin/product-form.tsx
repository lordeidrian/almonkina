import { createProductAction, updateProductAction } from "@/lib/admin/actions";

type CategoryOption = {
  id: string;
  name: string;
};

type ProductLike = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  description: string | null;
  price: number;
  previous_price: number | null;
  is_active: boolean;
  is_featured: boolean;
  main_image_url: string | null;
  image_url: string | null;
  gallery_urls: string[] | null;
  product_categories: { category_id: string }[];
};

type ProductFormProps = {
  mode: "create" | "edit";
  categories: CategoryOption[];
  product?: ProductLike;
};

export function ProductForm({ mode, categories, product }: ProductFormProps) {
  const defaultCategory = product?.product_categories?.[0]?.category_id ?? categories[0]?.id ?? "";
  const action = mode === "create" ? createProductAction : updateProductAction.bind(null, product?.id ?? "");

  return (
    <form action={action} className="surface space-y-5 p-6">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">Nombre</span>
          <input name="name" required defaultValue={product?.name ?? ""} className="input-base" />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Slug</span>
          <input name="slug" required defaultValue={product?.slug ?? ""} className="input-base" />
        </label>
      </div>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Descripción corta</span>
        <textarea name="short_description" rows={2} defaultValue={product?.short_description ?? product?.description ?? ""} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </label>

      <label className="block space-y-1">
        <span className="text-sm font-medium">Descripción larga (opcional)</span>
        <textarea name="long_description" rows={4} defaultValue={product?.long_description ?? ""} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
      </label>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm font-medium">Precio</span>
          <input type="number" step="0.01" min="0" name="price" required defaultValue={product?.price ?? 0} className="input-base" />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Precio anterior</span>
          <input type="number" step="0.01" min="0" name="previous_price" defaultValue={product?.previous_price ?? ""} className="input-base" />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Categoría</span>
          <select name="category_id" defaultValue={defaultCategory} className="input-base">
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">URL imagen principal</span>
          <input type="url" name="main_image_url" defaultValue={product?.main_image_url ?? product?.image_url ?? ""} className="input-base" />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Subir imagen principal</span>
          <input type="file" name="main_image_file" accept="image/*" className="input-base h-auto py-2" />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm font-medium">Galería (una URL por línea)</span>
          <textarea name="gallery_urls" rows={4} defaultValue={(product?.gallery_urls ?? []).join("\n")} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Subir imágenes de galería</span>
          <input type="file" name="gallery_files" accept="image/*" multiple className="input-base h-auto py-2" />
        </label>
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_active" defaultChecked={product?.is_active ?? true} /> Activo
        </label>
        <label className="inline-flex items-center gap-2 text-sm">
          <input type="checkbox" name="is_featured" defaultChecked={product?.is_featured ?? false} /> Destacado
        </label>
      </div>

      <button type="submit" className="btn-primary">
        {mode === "create" ? "Crear producto" : "Guardar cambios"}
      </button>
    </form>
  );
}
