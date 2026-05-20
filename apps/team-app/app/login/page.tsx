import { redirect } from "next/navigation";
import { getAuthMode, hasSupabaseEnv, isLocalAuthMode } from "@/lib/env";
import { getLocalAuthUserFromSession } from "@/lib/local-auth";
import { login } from "./actions";

type LoginPageProps = {
  searchParams?: Promise<{
    error?: string;
  }>;
};

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = searchParams ? await searchParams : undefined;
  const error = params?.error;
  const authMode = getAuthMode();
  const localAuth = isLocalAuthMode();
  const missingSupabase = !hasSupabaseEnv();

  if (localAuth) {
    const user = await getLocalAuthUserFromSession();

    if (user) {
      redirect("/dashboard");
    }
  }

  return (
    <main className="flex min-h-screen-dynamic min-h-screen w-full items-center justify-center px-3 py-6 sm:px-6">
      <section className="w-full max-w-md rounded-[1.75rem] border border-line/70 surface-panel p-5 shadow-panel sm:p-7 md:p-8">
        <div className="mb-6 sm:mb-8">
          <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.24em] text-accent sm:text-xs">
            Cabestany Avant Tout
          </p>
          <h1 className="section-title text-[2rem] font-semibold leading-none text-ink sm:text-[2.4rem]">
            Connexion équipe
          </h1>
          <p className="mt-3 text-sm leading-6 text-muted sm:text-[0.95rem]">
            {localAuth
              ? "Authentification locale active : comptes stockes dans PostgreSQL."
              : "Point d'entree prevu pour Supabase Auth. Cette page sert de base d'integration au MVP."}
          </p>
        </div>

        {localAuth ? (
          <p className="mb-4 rounded-2xl border border-success/20 bg-success/[0.10] px-4 py-3 text-sm text-success">
            `AUTH_MODE=local` est actif. Utilisez un compte cree dans la table
            `users` avec un `password_hash`.
          </p>
        ) : null}

        {!localAuth && missingSupabase ? (
          <p className="mb-4 rounded-2xl border border-warning/20 bg-warning/[0.10] px-4 py-3 text-sm text-warning">
            Renseignez `NEXT_PUBLIC_SUPABASE_URL` et
            `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`.
          </p>
        ) : null}

        <form action={login} className="space-y-3.5 sm:space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink sm:mb-2">Email</span>
            <input
              className="min-h-[44px] w-full rounded-2xl border border-line/70 bg-elevated px-3.5 py-3 text-base outline-none transition focus:border-accent sm:text-sm"
              type="email"
              name="email"
              placeholder="equipe@cabestanyavanttout.fr"
              autoComplete="email"
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium text-ink sm:mb-2">Mot de passe</span>
            <input
              className="min-h-[44px] w-full rounded-2xl border border-line/70 bg-elevated px-3.5 py-3 text-base outline-none transition focus:border-accent sm:text-sm"
              type="password"
              name="password"
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </label>

          {error ? (
            <p className="rounded-2xl border border-danger/20 bg-danger/[0.10] px-4 py-3 text-sm text-danger">
              {error}
            </p>
          ) : null}

          <button
            className="min-h-[48px] w-full rounded-2xl bg-ink px-4 py-3 text-base font-medium text-white transition active:bg-ink/95 sm:text-sm motion-safe:hover:bg-ink/90"
            type="submit"
            disabled={!localAuth && missingSupabase}
          >
            {localAuth ? "Se connecter en local" : "Se connecter"}
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-line/60 pt-4">
          <p className="text-xs uppercase tracking-[0.18em] text-muted">Mode auth courant</p>
          <p className="text-xs font-medium text-ink">{authMode}</p>
        </div>
      </section>
    </main>
  );
}
