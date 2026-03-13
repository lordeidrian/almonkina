import { CartView } from "@/components/cart/cart-view";
import { getPublicSettings } from "@/lib/queries/public";

export default async function CartPage() {
  const settings = await getPublicSettings();
  const captureLeadEnabled = process.env.ENABLE_LEAD_CAPTURE === "true";

  return (
    <div className="space-y-6">
      <section className="surface p-6 sm:p-7">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Carrito</h1>
        <p className="mt-2 text-slate-600">Revisa productos, ajusta cantidades y envía tu pedido por WhatsApp.</p>
      </section>

      <CartView settings={settings} captureLeadEnabled={captureLeadEnabled} />
    </div>
  );
}
