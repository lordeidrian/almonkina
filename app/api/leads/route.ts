import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { createLeadSchema } from "@/lib/validation/lead";

export async function POST(request: Request) {
  if (process.env.ENABLE_LEAD_CAPTURE !== "true") {
    return NextResponse.json({ ok: false, error: "Lead capture is disabled" }, { status: 403 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ ok: false, error: "Missing server configuration" }, { status: 500 });
  }

  const body = await request.json();
  const parsed = createLeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Validation failed", issues: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false }
  });

  const { data, error } = await supabase
    .from("order_leads")
    .insert({
      customer_name: parsed.data.customer_name ?? null,
      customer_phone: parsed.data.customer_phone ?? null,
      items_json: parsed.data.items_json,
      total_estimated: parsed.data.total_estimated,
      status: parsed.data.status
    })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: data.id });
}
