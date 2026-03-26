import { describe, expect, it, vi } from "vitest";

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

vi.mock("@/lib/postgres", () => ({
  getPool: vi.fn(),
}));

import {
  hashPassword,
  isSuperadmin,
  verifyPassword,
} from "@/lib/local-auth";

describe("local auth helpers", () => {
  it("hache un mot de passe dans le format attendu", () => {
    const hash = hashPassword("Perpignan66!!");

    expect(hash).toMatch(/^scrypt\$[0-9a-f]+\$[0-9a-f]+$/);
  });

  it("produit des hashes différents pour un même mot de passe", () => {
    const first = hashPassword("Perpignan66!!");
    const second = hashPassword("Perpignan66!!");

    expect(first).not.toBe(second);
  });

  it("valide un mot de passe avec son hash", () => {
    const password = "Perpignan66!!";
    const hash = hashPassword(password);

    expect(verifyPassword(password, hash)).toBe(true);
    expect(verifyPassword("mauvais-mot-de-passe", hash)).toBe(false);
  });

  it("refuse un hash invalide", () => {
    expect(verifyPassword("secret", "bad-format")).toBe(false);
  });

  it("détecte correctement un superadmin", () => {
    expect(
      isSuperadmin({
        id: "1",
        email: "cabestanyavanttout@gmail.com",
        fullName: "Superadmin",
        role: "superadmin",
      }),
    ).toBe(true);

    expect(
      isSuperadmin({
        id: "2",
        email: "admin@example.com",
        fullName: "Admin",
        role: "admin",
      }),
    ).toBe(false);
    expect(isSuperadmin(null)).toBe(false);
  });
});
