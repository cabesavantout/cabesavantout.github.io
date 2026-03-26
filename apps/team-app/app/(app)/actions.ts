"use server";

import { redirect } from "next/navigation";
import { isLocalAuthMode } from "@/lib/env";
import { clearLocalAuthSession } from "@/lib/local-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function logout() {
  if (isLocalAuthMode()) {
    await clearLocalAuthSession();
    redirect("/login");
  }

  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/login");
}
