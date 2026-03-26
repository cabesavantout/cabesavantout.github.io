import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getAuthMode,
  hasSupabaseAuthConfig,
  hasSupabaseEnv,
  isLocalAuthMode,
} from "@/lib/env";

describe("env auth helpers", () => {
  const originalEnv = { ...process.env };

  afterEach(() => {
    process.env = { ...originalEnv };
    vi.unstubAllEnvs();
  });

  it("utilise le mode local par défaut", () => {
    delete process.env.AUTH_MODE;

    expect(getAuthMode()).toBe("local");
    expect(isLocalAuthMode()).toBe(true);
  });

  it("détecte la config Supabase complète", () => {
    process.env.AUTH_MODE = "supabase";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    expect(hasSupabaseEnv()).toBe(true);
    expect(hasSupabaseAuthConfig()).toBe(true);
  });

  it("n'active pas Supabase si l'environnement est incomplet", () => {
    process.env.AUTH_MODE = "supabase";
    delete process.env.NEXT_PUBLIC_SUPABASE_URL;
    delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    expect(hasSupabaseEnv()).toBe(false);
    expect(hasSupabaseAuthConfig()).toBe(false);
  });

  it("reste en mode local si AUTH_MODE vaut explicitement local", () => {
    process.env.AUTH_MODE = "local";
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "anon-key";

    expect(getAuthMode()).toBe("local");
    expect(isLocalAuthMode()).toBe(true);
    expect(hasSupabaseEnv()).toBe(true);
    expect(hasSupabaseAuthConfig()).toBe(false);
  });
});
