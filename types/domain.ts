export type Category = {
  id: string;
  name: string;
  slug: string;
  is_active: boolean;
  sort_order: number;
};

export type Product = {
  id: string;
  name: string;
  slug: string;
  short_description: string | null;
  long_description: string | null;
  description: string | null;
  price: number;
  previous_price: number | null;
  main_image_url: string | null;
  image_url: string | null;
  gallery_urls: string[];
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  deleted_at: string | null;
  categories: Category[];
};

export type SiteSettings = {
  business_name: string;
  logo_url: string | null;
  favicon_url: string | null;
  whatsapp_number: string;
  currency_code: string;
  order_message_template: string;
  color_primary: string;
  color_secondary: string;
  color_tertiary: string | null;
  color_background: string | null;
  color_text: string | null;
};

export type CartItem = {
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
};

export type OrderLeadStatus = "pending_whatsapp" | "confirmed" | "cancelled";

export type OrderLeadInsert = {
  customer_name?: string | null;
  customer_phone?: string | null;
  items_json: CartItem[];
  total_estimated: number;
  status?: OrderLeadStatus;
};
