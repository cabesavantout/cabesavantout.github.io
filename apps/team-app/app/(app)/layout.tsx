import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { AppShell } from "@/components/app-shell";
import { hasSupabaseEnv, isLocalAuthMode } from "@/lib/env";
import { getLocalAuthUserFromSession } from "@/lib/local-auth";
import { getCurrentAccessContext } from "@/lib/permissions";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function InternalLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  if (isLocalAuthMode()) {
    const { user, permissions } = await getCurrentAccessContext();

    if (!user) {
      redirect("/login");
    }

    return (
      <AppShell
        userEmail={user.email}
        authMode="local"
        userRole={user.role}
        permissions={permissions}
      >
        {children}
      </AppShell>
    );
  }

  if (!hasSupabaseEnv()) {
    redirect("/login?error=Configurer%20Supabase%20dans%20.env.local");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <AppShell
      userEmail={session.user.email ?? null}
      authMode="supabase"
      userRole={null}
      permissions={[]}
    >
      {children}
    </AppShell>
  );
}
