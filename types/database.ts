export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          is_active: boolean;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
      };
      products: {
        Row: {
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
          gallery_urls: Json;
          is_active: boolean;
          is_featured: boolean;
          sort_order: number;
          deleted_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      product_categories: {
        Row: {
          product_id: string;
          category_id: string;
        };
      };
      site_settings: {
        Row: {
          id: boolean;
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
          updated_by: string | null;
          updated_at: string;
        };
      };
      order_leads: {
        Row: {
          id: string;
          customer_name: string | null;
          customer_phone: string | null;
          items_json: Json;
          total_estimated: number;
          status: "pending_whatsapp" | "confirmed" | "cancelled";
          created_at: string;
        };
        Insert: {
          customer_name?: string | null;
          customer_phone?: string | null;
          items_json: Json;
          total_estimated: number;
          status?: "pending_whatsapp" | "confirmed" | "cancelled";
        };
      };
    };
  };
};
