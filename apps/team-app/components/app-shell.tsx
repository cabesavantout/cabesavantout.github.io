import type { ReactNode } from "react";
import { LogOut, Megaphone } from "lucide-react";
import { logout } from "@/app/(app)/actions";
import { MobileNavigation } from "@/components/mobile-navigation";
import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui";

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
  const safePermissions = permissions ?? [];

  return (
    <div className="mx-auto min-h-dvh w-full max-w-app px-3 pb-[5.75rem] pt-3 sm:px-4 md:px-5 md:pb-5 lg:px-6">
      <div className="grid min-h-[calc(100dvh-1.5rem)] items-stretch gap-4 lg:grid-cols-[18rem_minmax(0,1fr)] xl:grid-cols-[19rem_minmax(0,1fr)]">
        <aside className="hidden self-stretch lg:block">
          <div className="sticky top-3 flex h-[calc(100dvh-1.5rem)] flex-col overflow-hidden rounded-[1.75rem] border border-line bg-panel shadow-panel-sm">
            <div className="border-b border-line px-5 py-5">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-accent/[0.12] text-accent">
                  <Megaphone className="h-4 w-4" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-ink">Cabestany Avant Tout</p>
                  <p className="text-sm text-muted">Pilotage politique et terrain</p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-4 soft-scroll">
              <Sidebar permissions={safePermissions} />
            </div>

            <div className="border-t border-line px-5 py-5">
              <div className="space-y-4 rounded-[1.5rem] border border-line bg-elevated p-4">
                <div className="min-w-0">
                  <p className="break-words text-sm font-medium text-ink">
                    {userEmail ?? "Utilisateur connecte"}
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    {userRole ? `Role ${userRole}` : authMode === "local" ? "Connexion locale" : "Connexion securisee"}
                  </p>
                </div>
                <form action={logout}>
                  <Button className="w-full justify-center" type="submit" variant="secondary">
                    <LogOut className="h-4 w-4" aria-hidden />
                    {authMode === "local" ? "Fermer la session" : "Se deconnecter"}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </aside>

        <div className="min-w-0 self-stretch">
          <main className="min-h-[calc(100dvh-1.5rem)] min-w-0 rounded-[1.75rem] border border-line bg-panel px-3 py-3 shadow-panel-sm sm:px-4 sm:py-4 md:px-5 md:py-5 lg:px-6 lg:py-6">
            {children}
          </main>
        </div>
      </div>

      <MobileNavigation permissions={safePermissions} />
    </div>
  );
}
