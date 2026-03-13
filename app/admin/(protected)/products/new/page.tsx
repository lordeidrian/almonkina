import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories } from "@/lib/queries/admin";

export default async function AdminNewProductPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Nuevo producto</h1>
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
