import { cache } from "react";
import { createSupabaseServerClient, hasSupabasePublicEnv } from "@/lib/supabase/server";
import type { Category, Product, SiteSettings } from "@/types/domain";

const defaultSettings: SiteSettings = {
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
};

function safeColor(input: string | null | undefined, fallback: string): string {
  if (!input) {
    return fallback;
  }

  const value = input.trim();
  const isHex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/.test(value);
  if (isHex) {
    return value;
  }

  return fallback;
}

export const getPublicSettings = cache(async (): Promise<SiteSettings> => {
  if (!hasSupabasePublicEnv()) {
    return defaultSettings;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return defaultSettings;
  }

  const { data, error } = await supabase.from("site_settings").select("*").single();
  if (error || !data) {
    return defaultSettings;
  }

  return {
    business_name: data.business_name,
    logo_url: data.logo_url,
    favicon_url: data.favicon_url,
    whatsapp_number: data.whatsapp_number,
    currency_code: data.currency_code,
    order_message_template: data.order_message_template,
    color_primary: safeColor(data.color_primary, defaultSettings.color_primary),
    color_secondary: safeColor(data.color_secondary, defaultSettings.color_secondary),
    color_tertiary: data.color_tertiary ? safeColor(data.color_tertiary, defaultSettings.color_tertiary ?? "#14B8A6") : null,
    color_background: data.color_background
      ? safeColor(data.color_background, defaultSettings.color_background ?? "#F8FAFC")
      : null,
    color_text: data.color_text ? safeColor(data.color_text, defaultSettings.color_text ?? "#0F172A") : null
  };
});

export const getCategories = cache(async (): Promise<Category[]> => {
  if (!hasSupabasePublicEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }
  const { data } = await supabase
    .from("categories")
    .select("id,name,slug,is_active,sort_order")
    .eq("is_active", true)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  return (data ?? []) as Category[];
});

function mapProduct(row: any): Product {
  const gallery = Array.isArray(row.gallery_urls)
    ? row.gallery_urls.filter((item: unknown): item is string => typeof item === "string")
    : [];

  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    short_description: row.short_description ?? row.description,
    long_description: row.long_description,
    description: row.description,
    price: Number(row.price),
    previous_price: row.previous_price != null ? Number(row.previous_price) : null,
    main_image_url: row.main_image_url ?? row.image_url,
    image_url: row.image_url,
    gallery_urls: gallery,
    is_active: row.is_active,
    is_featured: row.is_featured,
    sort_order: row.sort_order,
    deleted_at: row.deleted_at,
    categories: (row.product_categories ?? [])
      .map((item: { categories?: Category | null }) => item.categories)
      .filter((category: Category | null | undefined): category is Category => Boolean(category))
  };
}

export async function getProducts(params: {
  search?: string;
  category?: string;
  featured?: boolean;
}): Promise<Product[]> {
  if (!hasSupabasePublicEnv()) {
    return [];
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return [];
  }

  let query = supabase
    .from("products")
    .select(
      "id,name,slug,short_description,long_description,description,price,previous_price,main_image_url,image_url,gallery_urls,is_active,is_featured,sort_order,deleted_at,product_categories(categories(id,name,slug,is_active,sort_order))"
    )
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("sort_order", { ascending: true })
    .order("name", { ascending: true });

  if (params.search) {
    query = query.or(
      `name.ilike.%${params.search}%,short_description.ilike.%${params.search}%,long_description.ilike.%${params.search}%,description.ilike.%${params.search}%`
    );
  }

  if (params.featured) {
    query = query.eq("is_featured", true);
  }

  const { data } = await query;
  const mapped = (data ?? []).map((row: any) => mapProduct(row));

  if (params.category) {
    return mapped.filter((product) => product.categories.some((category) => category.slug === params.category));
  }

  return mapped;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!hasSupabasePublicEnv()) {
    return null;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,slug,short_description,long_description,description,price,previous_price,main_image_url,image_url,gallery_urls,is_active,is_featured,sort_order,deleted_at,product_categories(categories(id,name,slug,is_active,sort_order))"
    )
    .eq("slug", slug)
    .eq("is_active", true)
    .is("deleted_at", null)
    .single();

  if (error || !data) {
    return null;
  }

  return mapProduct(data);
}
