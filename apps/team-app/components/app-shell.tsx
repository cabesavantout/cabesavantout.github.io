import type { ReactNode } from "react";
import Link from "next/link";
import {
  BarChart3,
  BookUser,
  CalendarRange,
  ClipboardList,
  Database,
  LayoutDashboard,
  LogOut,
  MapPinned,
  Megaphone,
  Search,
  Settings2,
  ShieldUser,
  Users,
  UserRound,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { buildNavigation } from "@/lib/navigation";
import { logout } from "@/app/(app)/actions";

export function AppShell({
  children,
  userEmail,
  authMode,
  userRole,
  permissions,
}: {
  children: ReactNode;
  userEmail: string | null;
  authMode: "local" | "supabase";
  userRole?: string | null;
  permissions?: string[];
}) {
  const navigation = buildNavigation(permissions);
  const iconByHref: Record<string, LucideIcon> = {
    "/dashboard": LayoutDashboard,
    "/search": Search,
    "/polling-stations": MapPinned,
    "/electoral-analysis": BarChart3,
    "/insee": Database,
    "/team": ShieldUser,
    "/tasks": ClipboardList,
    "/meetings": CalendarRange,
    "/field-reports": Users,
    "/field-analysis": BarChart3,
    "/citizens": UserRound,
    "/contacts": BookUser,
    "/users": Settings2,
  } as const;

  return (
    <div className="mx-auto min-h-screen max-w-[1720px] px-2 py-2 sm:px-4 sm:py-4 lg:px-5">
      <div className="grid min-h-[calc(100vh-1rem)] gap-3 lg:min-h-[calc(100vh-1.5rem)] lg:gap-4 lg:grid-cols-[300px_1fr] xl:grid-cols-[320px_1fr]">
        <aside className="glass-panel overflow-hidden rounded-[28px] border border-white/70 shadow-panel lg:sticky lg:top-4 lg:self-start lg:rounded-[34px]">
          <div className="border-b border-white/50 bg-gradient-to-br from-accent/95 via-accent to-[#9d3302] px-4 py-4 text-white sm:px-6 sm:py-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.68rem] font-semibold uppercase tracking-[0.34em] text-white/70">
                  Espace équipe
                </p>
                <h1 className="section-title mt-3 text-[2rem] leading-none text-white sm:text-3xl">
                  Cabestany
                  <br />
                  Avant Tout
                </h1>
              </div>
              <div className="rounded-2xl border border-white/20 bg-white/10 p-3">
                <Megaphone className="h-5 w-5 text-white" />
              </div>
            </div>
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/80 sm:mt-5">
              Poste de commandement terrain, données et coordination.
            </p>
          </div>

          <div className="px-3 py-3 sm:px-5 sm:py-4">
            <nav className="soft-scroll -mx-1 flex gap-2 overflow-x-auto pb-1 lg:mx-0 lg:block lg:max-h-[calc(100vh-360px)] lg:space-y-2 lg:overflow-auto lg:pr-1">
              {navigation.map(({ href, label }) => {
                const Icon = iconByHref[href];

                return (
                  <Link
                    key={href}
                    className={cn(
                      "group inline-flex min-w-max items-center gap-3 rounded-2xl border border-transparent bg-white/45 px-4 py-3 text-sm font-medium text-ink/72 transition hover:-translate-y-0.5 hover:border-white/70 hover:bg-white/80 hover:text-ink lg:flex",
                    )}
                    href={href}
                  >
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-ink/5 text-ink/70 transition group-hover:bg-accent/10 group-hover:text-accent">
                      <Icon className="h-4 w-4" />
                    </span>
                    <span>{label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 rounded-[24px] bg-[#1f1b16] p-4 text-white sm:mt-5 sm:rounded-[28px] sm:p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.3em] text-white/50">
                Session
              </p>
              <p className="mt-3 break-words text-sm font-medium text-white">
                {userEmail ?? "Utilisateur connecté"}
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[0.68rem] uppercase tracking-[0.22em] text-white/58">
                <span>{authMode === "local" ? "Authentification locale" : "Supabase Auth"}</span>
                {userRole ? <span>Rôle {userRole}</span> : null}
              </div>
              <p className="mt-4 text-sm leading-6 text-white/72">
                Base de travail pour piloter équipe, signaux terrain et exécution.
              </p>
              <form action={logout}>
                <button
                  className="mt-6 inline-flex items-center gap-2 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-medium text-white transition hover:bg-white/12"
                  type="submit"
                >
                  <LogOut className="h-4 w-4" />
                  {authMode === "local" ? "Fermer la session" : "Se déconnecter"}
                </button>
              </form>
            </div>
          </div>
        </aside>

        <main className="min-w-0">
          <div className="glass-panel min-h-full rounded-[28px] border border-white/70 px-4 py-4 shadow-panel sm:px-6 sm:py-6 lg:rounded-[34px] lg:px-8 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
