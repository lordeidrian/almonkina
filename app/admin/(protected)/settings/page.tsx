import { updateGeneralSettingsAction } from "@/lib/admin/actions";
import { getAdminSettings } from "@/lib/queries/admin";

type AdminSettingsPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminSettingsPage({ searchParams }: AdminSettingsPageProps) {
  const [params, settings] = await Promise.all([searchParams, getAdminSettings()]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Settings generales</h1>
        <p className="text-sm text-slate-500">Datos base del negocio y del mensaje de pedido.</p>
      </div>

      {params.saved ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Settings guardados correctamente.</p>
      ) : null}

      <form action={updateGeneralSettingsAction} className="surface space-y-4 p-6">
        <label className="block space-y-1">
          <span className="text-sm font-medium">Nombre del negocio</span>
          <input name="business_name" required defaultValue={settings.business_name} className="input-base" />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Número de WhatsApp</span>
          <input name="whatsapp_number" required defaultValue={settings.whatsapp_number} className="input-base" />
        </label>

        <label className="space-y-1">
          <span className="text-sm font-medium">Moneda</span>
          <input name="currency_code" required defaultValue={settings.currency_code} className="input-base" />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium">Plantilla mensaje pedido</span>
          <textarea name="order_message_template" rows={4} required defaultValue={settings.order_message_template} className="w-full rounded-xl border border-slate-300 px-3 py-2" />
        </label>

        <button type="submit" className="btn-primary">
          Guardar settings
        </button>
      </form>
    </div>
  );
}
