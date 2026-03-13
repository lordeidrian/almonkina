"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdminPage } from "@/lib/auth-admin";
import { uploadPublicFile } from "@/lib/admin/storage";
import {
  categorySchema,
  productSchema,
  settingsBrandingSchema,
  settingsGeneralSchema
} from "@/lib/validation/admin";

function toNullableString(value: FormDataEntryValue | null): string | null {
  if (typeof value !== "string") {
    return null;
  }
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
}

function toNumber(value: FormDataEntryValue | null): number {
  if (typeof value !== "string") {
    return 0;
  }
  const parsed = Number(value.replace(/,/g, "."));
  return Number.isFinite(parsed) ? parsed : 0;
}

function toBoolean(value: FormDataEntryValue | null): boolean {
  return value === "on" || value === "true";
}

function parseGalleryUrls(value: FormDataEntryValue | null): string[] {
  if (typeof value !== "string") {
    return [];
  }

  return value
    .split(/\r?\n/)
    .map((v) => v.trim())
    .filter(Boolean);
}

export async function signOutAdminAction() {
  const { supabase } = await requireAdminPage();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

export async function createCategoryAction(formData: FormData) {
  const { supabase } = await requireAdminPage();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    is_active: toBoolean(formData.get("is_active")),
    sort_order: toNumber(formData.get("sort_order"))
  });

  if (!parsed.success) {
    throw new Error("Datos de categoría inválidos");
  }

  const { error } = await supabase.from("categories").insert(parsed.data);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  redirect("/admin/categories?saved=1");
}

export async function updateCategoryAction(id: string, formData: FormData) {
  const { supabase } = await requireAdminPage();

  const parsed = categorySchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    is_active: toBoolean(formData.get("is_active")),
    sort_order: toNumber(formData.get("sort_order"))
  });

  if (!parsed.success) {
    throw new Error("Datos de categoría inválidos");
  }

  const { error } = await supabase.from("categories").update(parsed.data).eq("id", id);
  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  redirect("/admin/categories?saved=1");
}

export async function toggleCategoryAction(id: string, current: boolean) {
  const { supabase } = await requireAdminPage();
  const { error } = await supabase.from("categories").update({ is_active: !current }).eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/categories");
  revalidatePath("/shop");
  redirect("/admin/categories?saved=1");
}

export async function createProductAction(formData: FormData) {
  const { supabase } = await requireAdminPage();

  const mainImageFile = formData.get("main_image_file");
  let mainImageUrl = toNullableString(formData.get("main_image_url"));
  if (mainImageFile instanceof File && mainImageFile.size > 0) {
    mainImageUrl = await uploadPublicFile({
      supabase,
      bucket: "products",
      file: mainImageFile,
      folder: "main"
    });
  }

  const galleryUrls = parseGalleryUrls(formData.get("gallery_urls"));
  const galleryFiles = formData.getAll("gallery_files").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of galleryFiles) {
    const uploaded = await uploadPublicFile({ supabase, bucket: "products", file, folder: "gallery" });
    galleryUrls.push(uploaded);
  }

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    short_description: toNullableString(formData.get("short_description")),
    long_description: toNullableString(formData.get("long_description")),
    price: toNumber(formData.get("price")),
    previous_price: toNullableString(formData.get("previous_price"))
      ? toNumber(formData.get("previous_price"))
      : null,
    category_id: formData.get("category_id"),
    is_active: toBoolean(formData.get("is_active")),
    is_featured: toBoolean(formData.get("is_featured")),
    main_image_url: mainImageUrl,
    gallery_urls: galleryUrls
  });

  if (!parsed.success) {
    throw new Error("Datos de producto inválidos");
  }

  const { data, error } = await supabase
    .from("products")
    .insert({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.short_description,
      short_description: parsed.data.short_description,
      long_description: parsed.data.long_description,
      price: parsed.data.price,
      previous_price: parsed.data.previous_price,
      image_url: parsed.data.main_image_url,
      main_image_url: parsed.data.main_image_url,
      gallery_urls: parsed.data.gallery_urls,
      is_active: parsed.data.is_active,
      is_featured: parsed.data.is_featured
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "No se pudo crear el producto");
  }

  await supabase.from("product_categories").delete().eq("product_id", data.id);
  const { error: categoryError } = await supabase
    .from("product_categories")
    .insert({ product_id: data.id, category_id: parsed.data.category_id });

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products?created=1");
}

export async function updateProductAction(id: string, formData: FormData) {
  const { supabase } = await requireAdminPage();

  const mainImageFile = formData.get("main_image_file");
  let mainImageUrl = toNullableString(formData.get("main_image_url"));
  if (mainImageFile instanceof File && mainImageFile.size > 0) {
    mainImageUrl = await uploadPublicFile({
      supabase,
      bucket: "products",
      file: mainImageFile,
      folder: "main"
    });
  }

  const galleryUrls = parseGalleryUrls(formData.get("gallery_urls"));
  const galleryFiles = formData.getAll("gallery_files").filter((f): f is File => f instanceof File && f.size > 0);
  for (const file of galleryFiles) {
    const uploaded = await uploadPublicFile({ supabase, bucket: "products", file, folder: "gallery" });
    galleryUrls.push(uploaded);
  }

  const parsed = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    short_description: toNullableString(formData.get("short_description")),
    long_description: toNullableString(formData.get("long_description")),
    price: toNumber(formData.get("price")),
    previous_price: toNullableString(formData.get("previous_price"))
      ? toNumber(formData.get("previous_price"))
      : null,
    category_id: formData.get("category_id"),
    is_active: toBoolean(formData.get("is_active")),
    is_featured: toBoolean(formData.get("is_featured")),
    main_image_url: mainImageUrl,
    gallery_urls: galleryUrls
  });

  if (!parsed.success) {
    throw new Error("Datos de producto inválidos");
  }

  const { error } = await supabase
    .from("products")
    .update({
      name: parsed.data.name,
      slug: parsed.data.slug,
      description: parsed.data.short_description,
      short_description: parsed.data.short_description,
      long_description: parsed.data.long_description,
      price: parsed.data.price,
      previous_price: parsed.data.previous_price,
      image_url: parsed.data.main_image_url,
      main_image_url: parsed.data.main_image_url,
      gallery_urls: parsed.data.gallery_urls,
      is_active: parsed.data.is_active,
      is_featured: parsed.data.is_featured,
      deleted_at: null
    })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  await supabase.from("product_categories").delete().eq("product_id", id);
  const { error: categoryError } = await supabase
    .from("product_categories")
    .insert({ product_id: id, category_id: parsed.data.category_id });

  if (categoryError) {
    throw new Error(categoryError.message);
  }

  revalidatePath("/admin/products");
  revalidatePath(`/admin/products/${id}`);
  revalidatePath("/shop");
  redirect(`/admin/products/${id}?saved=1`);
}

export async function toggleProductActiveAction(id: string, current: boolean) {
  const { supabase } = await requireAdminPage();

  const { error } = await supabase
    .from("products")
    .update({ is_active: !current, deleted_at: !current ? null : new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products?saved=1");
}

export async function softDeleteProductAction(id: string) {
  const { supabase } = await requireAdminPage();

  const { error } = await supabase
    .from("products")
    .update({ deleted_at: new Date().toISOString(), is_active: false })
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/admin/products");
  revalidatePath("/shop");
  redirect("/admin/products?saved=1");
}

export async function updateGeneralSettingsAction(formData: FormData) {
  const { supabase, user } = await requireAdminPage();

  const parsed = settingsGeneralSchema.safeParse({
    business_name: formData.get("business_name"),
    whatsapp_number: formData.get("whatsapp_number"),
    currency_code: formData.get("currency_code"),
    order_message_template: formData.get("order_message_template")
  });

  if (!parsed.success) {
    throw new Error("Configuración general inválida");
  }

  const { error } = await supabase.from("site_settings").upsert({
    id: true,
    ...parsed.data,
    updated_by: user.id
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/settings");
  redirect("/admin/settings?saved=1");
}

export async function updateBrandingSettingsAction(formData: FormData) {
  const { supabase, user } = await requireAdminPage();

  let logoUrl = toNullableString(formData.get("logo_url"));
  let faviconUrl = toNullableString(formData.get("favicon_url"));

  const logoFile = formData.get("logo_file");
  if (logoFile instanceof File && logoFile.size > 0) {
    logoUrl = await uploadPublicFile({ supabase, bucket: "branding", file: logoFile, folder: "logo" });
  }

  const faviconFile = formData.get("favicon_file");
  if (faviconFile instanceof File && faviconFile.size > 0) {
    faviconUrl = await uploadPublicFile({ supabase, bucket: "branding", file: faviconFile, folder: "favicon" });
  }

  const parsed = settingsBrandingSchema.safeParse({
    color_primary: formData.get("color_primary"),
    color_secondary: formData.get("color_secondary"),
    color_tertiary: toNullableString(formData.get("color_tertiary")),
    color_background: toNullableString(formData.get("color_background")),
    color_text: toNullableString(formData.get("color_text")),
    logo_url: logoUrl,
    favicon_url: faviconUrl
  });

  if (!parsed.success) {
    throw new Error("Configuración de branding inválida");
  }

  const { error } = await supabase.from("site_settings").upsert({
    id: true,
    ...parsed.data,
    updated_by: user.id
  });

  if (error) {
    throw new Error(error.message);
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/branding");
  redirect("/admin/branding?saved=1");
}
