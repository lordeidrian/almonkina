import Link from "next/link";
import { requireAdminPage } from "@/lib/auth-admin";
import { signOutAdminAction } from "@/lib/admin/actions";

export const dynamic = "force-dynamic";

const navItems = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/products", label: "Productos" },
  { href: "/admin/categories", label: "Categorías" },
  { href: "/admin/settings", label: "Settings" },
  { href: "/admin/branding", label: "Branding" }
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user } = await requireAdminPage();

  return (
    <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
      <aside className="surface h-fit p-4 lg:sticky lg:top-24">
        <p className="text-xs uppercase tracking-wide text-slate-500">Panel Admin</p>
        <p className="mt-1 truncate text-sm font-medium text-slate-800">{user.email}</p>

        <nav className="mt-5 space-y-1.5">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="block rounded-xl px-3 py-2.5 text-sm text-slate-700 transition hover:bg-slate-100">
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={signOutAdminAction} className="mt-6">
          <button type="submit" className="btn-secondary w-full">
            Cerrar sesión
          </button>
        </form>
      </aside>

      <section className="min-w-0">{children}</section>
    </div>
  );
}
