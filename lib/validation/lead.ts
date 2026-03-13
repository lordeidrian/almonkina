import { z } from "zod";

export const leadItemSchema = z.object({
  productId: z.string().min(1),
  slug: z.string().min(1),
  name: z.string().min(1),
  price: z.number().min(0),
  imageUrl: z.string().nullable(),
  quantity: z.number().int().positive()
});

export const createLeadSchema = z.object({
  customer_name: z.string().trim().min(2).max(80).optional().nullable(),
  customer_phone: z.string().trim().min(6).max(30).optional().nullable(),
  items_json: z.array(leadItemSchema).min(1),
  total_estimated: z.number().min(0),
  status: z.enum(["pending_whatsapp", "confirmed", "cancelled"]).default("pending_whatsapp")
});
