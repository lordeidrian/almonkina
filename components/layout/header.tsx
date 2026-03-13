import Link from "next/link";
import { CartBadge } from "@/components/cart/cart-badge";

type HeaderProps = {
  businessName: string;
  logoUrl: string | null;
};

export function Header({ businessName, logoUrl }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:py-4">
        <Link href="/" className="flex items-center gap-3">
          {logoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={logoUrl} alt={businessName} className="h-10 w-10 rounded-xl border border-slate-200 object-cover" />
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-primary/95 text-sm font-semibold text-white">A</div>
          )}
          <span className="max-w-[160px] truncate text-base font-semibold text-slate-900 sm:max-w-none sm:text-lg">{businessName}</span>
        </Link>

        <nav className="flex items-center gap-2 text-sm font-medium sm:gap-4">
          <Link href="/shop" className="rounded-lg px-3 py-2 text-slate-700 transition hover:bg-slate-100 hover:text-brand-primary">
            Tienda
          </Link>
          <CartBadge />
        </nav>
      </div>
    </header>
  );
}
