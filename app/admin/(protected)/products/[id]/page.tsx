import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/product-form";
import { getAdminCategories, getAdminProductById } from "@/lib/queries/admin";

type AdminEditProductPageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminEditProductPage({ params, searchParams }: AdminEditProductPageProps) {
  const { id } = await params;
  const query = await searchParams;
  const [categories, product] = await Promise.all([getAdminCategories(), getAdminProductById(id)]);

  if (!product) {
    notFound();
  }

  return (
    <div className="space-y-5">
      <h1 className="text-3xl font-bold tracking-tight text-slate-900">Editar producto</h1>
      {query.saved ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Producto actualizado.</p>
      ) : null}
      <ProductForm mode="edit" categories={categories} product={product as any} />
    </div>
  );
}
