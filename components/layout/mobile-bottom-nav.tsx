"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCartStore } from "@/hooks/use-cart-store";

function HomeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V20h14V9.5" />
    </svg>
  );
}

function ShopIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M4 9h16l-1 11H5L4 9Z" />
      <path d="M9 9V7a3 3 0 0 1 6 0v2" />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
      <path d="M3 4h2l2.2 10.2a1 1 0 0 0 1 .8h8.8a1 1 0 0 0 1-.8L20 7H7" />
      <circle cx="10" cy="19" r="1.5" />
      <circle cx="17" cy="19" r="1.5" />
    </svg>
  );
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const totalItems = useCartStore((state) => state.totalItems());

  if (pathname.startsWith("/admin")) {
    return null;
  }

  const links = [
    { href: "/", label: "Home", icon: <HomeIcon /> },
    { href: "/shop", label: "Shop", icon: <ShopIcon /> },
    { href: "/cart", label: "Cart", icon: <CartIcon />, badge: totalItems }
  ];

  return (
    <nav className="fixed bottom-3 left-1/2 z-40 w-[calc(100%-1.25rem)] max-w-md -translate-x-1/2 rounded-2xl border border-slate-200/80 bg-white/95 p-2 shadow-lg backdrop-blur md:hidden">
      <ul className="grid grid-cols-3 gap-1">
        {links.map((link) => {
          const isActive = pathname === link.href || (link.href !== "/" && pathname.startsWith(link.href));

          return (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative flex flex-col items-center gap-1 rounded-xl px-2 py-2 text-xs font-medium transition ${
                  isActive ? "bg-slate-100 text-brand-primary" : "text-slate-500 hover:bg-slate-50"
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge ? (
                  <span className="absolute right-4 top-1 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-secondary px-1 text-[10px] font-semibold text-white">
                    {link.badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
