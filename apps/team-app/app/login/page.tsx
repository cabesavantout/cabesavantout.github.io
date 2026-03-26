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
    <main className="flex min-h-screen items-center justify-center p-6">
      <section className="w-full max-w-md rounded-3xl border border-white/70 bg-white/90 p-8 shadow-panel backdrop-blur">
        <div className="mb-8">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.24em] text-accent">
            Cabestany Avant Tout
          </p>
          <h1 className="text-3xl font-semibold">Connexion equipe</h1>
          <p className="mt-3 text-sm text-ink/70">
            {localAuth
              ? "Authentification locale active : comptes stockes dans PostgreSQL."
              : "Point d'entree prevu pour Supabase Auth. Cette page sert de base d'integration au MVP."}
          </p>
        </div>

        {localAuth ? (
          <p className="mb-4 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            `AUTH_MODE=local` est actif. Utilisez un compte cree dans la table
            `users` avec un `password_hash`.
          </p>
        ) : null}

        {!localAuth && missingSupabase ? (
          <p className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Renseignez `NEXT_PUBLIC_SUPABASE_URL` et
            `NEXT_PUBLIC_SUPABASE_ANON_KEY` dans `.env.local`.
          </p>
        ) : null}

        <form action={login} className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm font-medium">Email</span>
            <input
              className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
              type="email"
              name="email"
              placeholder="equipe@cabestanyavanttout.fr"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Mot de passe</span>
            <input
              className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
              type="password"
              name="password"
              placeholder="••••••••"
            />
          </label>

          {error ? (
            <p className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          ) : null}

          <button
            className="w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white transition hover:bg-ink/90"
            type="submit"
            disabled={!localAuth && missingSupabase}
          >
            {localAuth ? "Se connecter en local" : "Se connecter"}
          </button>
        </form>

        <p className="mt-4 text-xs text-ink/55">Mode auth courant: {authMode}</p>
      </section>
    </main>
  );
}
