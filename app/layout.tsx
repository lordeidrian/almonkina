import type { Metadata } from "next";
import type { CSSProperties } from "react";
import "@/app/globals.css";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { getPublicSettings } from "@/lib/queries/public";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();

  return {
    title: settings.business_name,
    description: "Catálogo de productos personalizados",
    icons: settings.favicon_url ? { icon: settings.favicon_url } : undefined
  };
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const settings = await getPublicSettings();

  const style = {
    "--brand-primary": settings.color_primary,
    "--brand-secondary": settings.color_secondary,
    "--brand-tertiary": settings.color_tertiary ?? "#14b8a6",
    "--brand-bg": settings.color_background ?? "#f8fafc",
    "--brand-text": settings.color_text ?? "#0f172a"
  } as CSSProperties;

  return (
    <html lang="es">
      <body style={style}>
        <Header businessName={settings.business_name} logoUrl={settings.logo_url} />
        <main className="mx-auto min-h-[70vh] max-w-6xl px-4 py-8 pb-28 md:pb-8">{children}</main>
        <Footer />
        <MobileBottomNav />
      </body>
    </html>
  );
}
