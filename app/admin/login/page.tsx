import { redirect } from "next/navigation";
import { getAdminContext } from "@/lib/auth-admin";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage() {
  const admin = await getAdminContext();
  if (admin) {
    redirect("/admin");
  }

  return <AdminLoginForm />;
}
