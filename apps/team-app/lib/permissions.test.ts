import { describe, expect, it } from "vitest";
import { hasPermission } from "@/lib/permissions";

describe("hasPermission", () => {
  it("retourne vrai si la permission exacte est présente", () => {
    expect(hasPermission(["tasks.read"], "tasks.read")).toBe(true);
  });

  it("retourne faux si la permission est absente", () => {
    expect(hasPermission(["tasks.read"], "users.manage")).toBe(false);
  });

  it("retourne vrai pour le joker superadmin", () => {
    expect(hasPermission(["*"], "users.manage")).toBe(true);
  });
});
