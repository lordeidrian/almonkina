import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function getAdminContext() {
  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return null;
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id,is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) {
    return null;
  }

  return { supabase, user };
}

export async function requireAdminPage() {
  const context = await getAdminContext();
  if (!context) {
    redirect("/admin/login");
  }
  return context;
}

export async function requireAdminApi() {
  const context = await getAdminContext();
  if (!context) {
    return { ok: false as const };
  }
  return { ok: true as const, ...context };
}
