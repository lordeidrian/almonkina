import { z } from "zod";

export const productSchema = z.object({
  name: z.string().trim().min(2).max(140),
  slug: z.string().trim().min(2).max(180),
  short_description: z.string().trim().max(300).nullable(),
  long_description: z.string().trim().max(4000).nullable(),
  price: z.number().min(0),
  previous_price: z.number().min(0).nullable(),
  category_id: z.string().uuid(),
  is_active: z.boolean(),
  is_featured: z.boolean(),
  main_image_url: z.string().url().nullable(),
  gallery_urls: z.array(z.string().url()).max(10)
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(80),
  slug: z.string().trim().min(2).max(100),
  is_active: z.boolean(),
  sort_order: z.number().int().min(0)
});

export const settingsGeneralSchema = z.object({
  business_name: z.string().trim().min(2).max(120),
  whatsapp_number: z.string().trim().min(6).max(30),
  currency_code: z.string().trim().min(3).max(8),
  order_message_template: z.string().trim().min(5).max(1000)
});

export const settingsBrandingSchema = z.object({
  color_primary: z.string().trim().min(4).max(20),
  color_secondary: z.string().trim().min(4).max(20),
  color_tertiary: z.string().trim().max(20).nullable(),
  color_background: z.string().trim().max(20).nullable(),
  color_text: z.string().trim().max(20).nullable(),
  logo_url: z.string().url().nullable(),
  favicon_url: z.string().url().nullable()
});
