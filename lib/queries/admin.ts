import { requireAdminPage } from "@/lib/auth-admin";

export async function getDashboardStats() {
  const { supabase } = await requireAdminPage();

  const [{ count: productsCount }, { count: categoriesCount }, { count: leadsCount }] = await Promise.all([
    supabase.from("products").select("id", { count: "exact", head: true }).is("deleted_at", null),
    supabase.from("categories").select("id", { count: "exact", head: true }),
    supabase.from("order_leads").select("id", { count: "exact", head: true })
  ]);

  return {
    products: productsCount ?? 0,
    categories: categoriesCount ?? 0,
    leads: leadsCount ?? 0
  };
}

export async function getAdminProducts() {
  const { supabase } = await requireAdminPage();

  const { data } = await supabase
    .from("products")
    .select(
      "id,name,slug,price,previous_price,is_active,is_featured,main_image_url,image_url,deleted_at,product_categories(category_id,categories(name,slug))"
    )
    .order("created_at", { ascending: false });

  return data ?? [];
}

export async function getAdminProductById(id: string) {
  const { supabase } = await requireAdminPage();

  const { data } = await supabase
    .from("products")
    .select(
      "id,name,slug,short_description,long_description,description,price,previous_price,is_active,is_featured,main_image_url,image_url,gallery_urls,product_categories(category_id)"
    )
    .eq("id", id)
    .maybeSingle();

  return data;
}

export async function getAdminCategories() {
  const { supabase } = await requireAdminPage();
  const { data } = await supabase
    .from("categories")
    .select("id,name,slug,is_active,sort_order")
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return data ?? [];
}

export async function getAdminSettings() {
  const { supabase } = await requireAdminPage();
  const { data } = await supabase.from("site_settings").select("*").maybeSingle();

  return (
    data ?? {
      business_name: "Mi Negocio",
      logo_url: null,
      favicon_url: null,
      whatsapp_number: "595000000000",
      currency_code: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY ?? "PYG",
      order_message_template: "Hola, quiero hacer este pedido:",
      color_primary: "#111827",
      color_secondary: "#2563EB",
      color_tertiary: "#14B8A6",
      color_background: "#F8FAFC",
      color_text: "#0F172A"
    }
  );
}
