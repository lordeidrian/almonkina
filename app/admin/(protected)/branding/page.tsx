import { updateBrandingSettingsAction } from "@/lib/admin/actions";
import { getAdminSettings } from "@/lib/queries/admin";

type AdminBrandingPageProps = {
  searchParams: Promise<{ saved?: string }>;
};

export default async function AdminBrandingPage({ searchParams }: AdminBrandingPageProps) {
  const [params, settings] = await Promise.all([searchParams, getAdminSettings()]);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Branding</h1>
        <p className="text-sm text-slate-500">Colores y activos visuales del sitio público.</p>
      </div>

      {params.saved ? (
        <p className="rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">Branding actualizado.</p>
      ) : null}

      <form action={updateBrandingSettingsAction} className="surface space-y-5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">URL logo</span>
            <input type="url" name="logo_url" defaultValue={settings.logo_url ?? ""} className="input-base" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Subir logo</span>
            <input type="file" name="logo_file" accept="image/*" className="input-base h-auto py-2" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">URL favicon</span>
            <input type="url" name="favicon_url" defaultValue={settings.favicon_url ?? ""} className="input-base" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Subir favicon</span>
            <input type="file" name="favicon_file" accept="image/*" className="input-base h-auto py-2" />
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="space-y-1">
            <span className="text-sm font-medium">Color principal</span>
            <input name="color_primary" defaultValue={settings.color_primary} className="input-base" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Color secundario</span>
            <input name="color_secondary" defaultValue={settings.color_secondary} className="input-base" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Color terciario</span>
            <input name="color_tertiary" defaultValue={settings.color_tertiary ?? ""} className="input-base" />
          </label>
          <label className="space-y-1">
            <span className="text-sm font-medium">Color fondo</span>
            <input name="color_background" defaultValue={settings.color_background ?? ""} className="input-base" />
          </label>
          <label className="space-y-1 md:col-span-2">
            <span className="text-sm font-medium">Color texto</span>
            <input name="color_text" defaultValue={settings.color_text ?? ""} className="input-base" />
          </label>
        </div>

        <button type="submit" className="btn-primary">
          Guardar branding
        </button>
      </form>
    </div>
  );
}
