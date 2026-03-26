"use server";

import { redirect } from "next/navigation";
import { hasSupabaseEnv, isLocalAuthMode } from "@/lib/env";
import {
  authenticateLocalUser,
  createLocalAuthSession,
  LocalAuthSchemaError,
} from "@/lib/local-auth";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function login(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (isLocalAuthMode()) {
    if (!email || !password) {
      redirect("/login?error=Email%20et%20mot%20de%20passe%20requis");
    }

    try {
      const user = await authenticateLocalUser(email, password);

      if (!user) {
        redirect("/login?error=Identifiants%20invalides");
      }

      await createLocalAuthSession(user);
    } catch (error) {
      if (error instanceof LocalAuthSchemaError) {
        redirect(
          "/login?error=Initialiser%20l%27auth%20locale%20dans%20PostgreSQL",
        );
      }

      throw error;
    }

    redirect("/dashboard");
  }

  if (!email || !password) {
    redirect("/login?error=Email%20et%20mot%20de%20passe%20requis");
  }

  if (!hasSupabaseEnv()) {
    redirect("/login?error=Configurer%20Supabase%20dans%20.env.local");
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}
