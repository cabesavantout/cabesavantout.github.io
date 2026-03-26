import { describe, expect, it } from "vitest";
import { buildNavigation } from "@/lib/navigation";

describe("buildNavigation", () => {
  it("affiche seulement les pages de base sans permissions métier", () => {
    expect(buildNavigation([])).toEqual([
      { href: "/dashboard", label: "Dashboard" },
      { href: "/polling-stations", label: "Bureaux" },
    ]);
  });

  it("affiche la recherche dès qu'un module exploitable est lisible", () => {
    const navigation = buildNavigation(["tasks.read"]);

    expect(navigation).toEqual(
      expect.arrayContaining([
        { href: "/search", label: "Recherche" },
        { href: "/tasks", label: "Tâches" },
      ]),
    );
  });

  it("ouvre tous les écrans pour un superadmin", () => {
    const navigation = buildNavigation(["*"]);
    const hrefs = navigation.map((item) => item.href);

    expect(hrefs).toEqual([
      "/dashboard",
      "/search",
      "/polling-stations",
      "/electoral-analysis",
      "/insee",
      "/team",
      "/tasks",
      "/meetings",
      "/field-reports",
      "/field-analysis",
      "/citizens",
      "/contacts",
      "/users",
    ]);
  });

  it("affiche les écrans civiques et contacts quand les permissions sont présentes", () => {
    const navigation = buildNavigation([
      "citizens.read",
      "contacts.read",
      "field_reports.read",
    ]);

    expect(navigation).toEqual(
      expect.arrayContaining([
        { href: "/search", label: "Recherche" },
        { href: "/field-reports", label: "Terrain" },
        { href: "/field-analysis", label: "Analyse terrain" },
        { href: "/citizens", label: "Citoyens" },
        { href: "/contacts", label: "Contacts" },
      ]),
    );
  });
});
