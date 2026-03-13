"use client";

import { useMemo, useState } from "react";
import { useCartStore } from "@/hooks/use-cart-store";
import { formatMoney } from "@/lib/format";
import { buildOrderMessage, buildWhatsAppUrl } from "@/lib/whatsapp/message";
import type { SiteSettings } from "@/types/domain";

type CartViewProps = {
  settings: SiteSettings;
  captureLeadEnabled: boolean;
};

export function CartView({ settings, captureLeadEnabled }: CartViewProps) {
  const items = useCartStore((state) => state.items);
  const increase = useCartStore((state) => state.increase);
  const decrease = useCartStore((state) => state.decrease);
  const remove = useCartStore((state) => state.remove);
  const clear = useCartStore((state) => state.clear);
  const subtotal = useCartStore((state) => state.subtotal());

  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);

  const hasItems = items.length > 0;

  const message = useMemo(
    () =>
      buildOrderMessage({
        businessName: settings.business_name,
        template: settings.order_message_template,
        items,
        subtotal,
        currencyCode: settings.currency_code
      }),
    [items, settings.business_name, settings.currency_code, settings.order_message_template, subtotal]
  );

  const handleWhatsApp = async () => {
    if (!hasItems) {
      return;
    }

    setIsSending(true);

    if (captureLeadEnabled) {
      await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items_json: items,
          total_estimated: subtotal,
          status: "pending_whatsapp"
        })
      });
    }

    const url = buildWhatsAppUrl(settings.whatsapp_number, message);
    window.open(url, "_blank", "noopener,noreferrer");
    setSent(true);
    setIsSending(false);
  };

  if (!hasItems) {
    return (
      <section className="surface border-dashed p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-500">C</div>
        <h2 className="text-xl font-semibold text-slate-900">Tu carrito está vacío</h2>
        <p className="mt-2 text-sm text-slate-500">Agrega productos desde la tienda para generar tu pedido.</p>
      </section>
    );
  }

  return (
    <section className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="surface overflow-hidden">
        {items.map((item) => (
          <div key={item.productId} className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 md:flex-row md:items-center">
            <div className="min-w-0 flex-1">
              <p className="truncate font-semibold text-slate-900">{item.name}</p>
              <p className="text-sm text-slate-500">{formatMoney(item.price, settings.currency_code)}</p>
            </div>

            <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
              <button type="button" onClick={() => decrease(item.productId)} className="h-8 w-8 rounded-lg text-slate-700 hover:bg-white">
                -
              </button>
              <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
              <button type="button" onClick={() => increase(item.productId)} className="h-8 w-8 rounded-lg text-slate-700 hover:bg-white">
                +
              </button>
            </div>

            <div className="text-right">
              <p className="font-semibold text-slate-900">{formatMoney(item.price * item.quantity, settings.currency_code)}</p>
              <button type="button" onClick={() => remove(item.productId)} className="text-xs text-red-600 hover:underline">
                Eliminar
              </button>
            </div>
          </div>
        ))}
      </div>

      <aside className="surface h-fit p-5">
        <h2 className="text-lg font-semibold text-slate-900">Resumen</h2>
        <p className="mt-2 text-sm text-slate-500">{items.length} producto(s) en el carrito</p>

        <p className="mt-5 text-xl font-bold text-brand-primary">{formatMoney(subtotal, settings.currency_code)}</p>

        <div className="mt-5 space-y-2">
          <button type="button" onClick={handleWhatsApp} disabled={isSending} className="btn-primary w-full bg-green-600 hover:bg-green-700 disabled:opacity-60">
            {isSending ? "Procesando..." : "Hacer pedido por WhatsApp"}
          </button>

          <button type="button" onClick={clear} className="btn-secondary w-full">
            Vaciar carrito
          </button>
        </div>

        {sent ? <p className="mt-3 text-xs font-medium text-emerald-700">Mensaje listo. Se abrió WhatsApp en una nueva pestaña.</p> : null}
      </aside>
    </section>
  );
}
