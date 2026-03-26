import { redirect } from "next/navigation";
import { getAuthMode, hasSupabaseEnv, isLocalAuthMode } from "@/lib/env";
import { getLocalAuthUserFromSession } from "@/lib/local-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  if (isLocalAuthMode()) {
    const localUser = await getLocalAuthUserFromSession();
    redirect(localUser ? "/dashboard" : "/login");
  }

  if (!hasSupabaseEnv()) {
    redirect("/login?error=Configurer%20Supabase%20dans%20.env.local");
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  redirect(session ? "/dashboard" : `/login?mode=${getAuthMode()}`);
}
