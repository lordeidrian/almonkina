import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createSupabaseMiddlewareClient } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  const supabase = createSupabaseMiddlewareClient(request, response);

  if (!supabase) {
    return NextResponse.redirect(new URL("/admin/login?reason=session", request.url));
  }

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(new URL("/admin/login?reason=session", request.url));
  }

  const { data: admin } = await supabase
    .from("admin_users")
    .select("user_id,is_active")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .maybeSingle();

  if (!admin) {
    return NextResponse.redirect(new URL("/admin/login?reason=unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*"]
};
