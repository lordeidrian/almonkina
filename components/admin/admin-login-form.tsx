"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const reason = searchParams.get("reason");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });

      if (signInError) {
        setError(signInError.message);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("No se pudo iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md surface p-6 sm:p-7">
      <p className="badge-soft">Admin</p>
      <h1 className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">Acceso administrador</h1>
      <p className="mt-1 text-sm text-slate-500">Gestiona catálogo, branding y solicitudes.</p>

      {reason === "unauthorized" ? (
        <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">No tienes permisos de administrador.</p>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Email</span>
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required className="input-base" />
        </label>

        <label className="block space-y-1">
          <span className="text-sm font-medium text-slate-700">Contraseña</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
            className="input-base"
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-60">
          {loading ? "Ingresando..." : "Ingresar"}
        </button>
      </form>
    </div>
  );
}
