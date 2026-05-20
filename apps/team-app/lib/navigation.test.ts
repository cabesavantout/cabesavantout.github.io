import { describe, expect, it } from "vitest";
import {
  buildNavigation,
  getNavigationContext,
  getNavigationCoverageIssues,
} from "@/lib/navigation";

describe("buildNavigation", () => {
  it("garde le dashboard et la carte meme sans permissions metier", () => {
    expect(buildNavigation([])).toEqual([
      {
        key: "home",
        label: "Vue d'ensemble",
        href: "/dashboard",
        children: [{ key: "dashboard", label: "Vue d'ensemble", href: "/dashboard", status: "live" }],
      },
      {
        key: "map",
        label: "Territoire",
        href: "/polling-stations",
        children: [{ key: "map", label: "Carte des bureaux", href: "/polling-stations", status: "live" }],
      },
      {
        key: "settings",
        label: "Administration",
        href: "/campaign",
        children: [
          { key: "campaign", label: "Campagne", href: "/campaign", status: "live" },
          { key: "social-media", label: "Reseaux sociaux", href: "/social-media", status: "live" },
          { key: "press-releases", label: "Communiques", href: "/press-releases", status: "live" },
          { key: "press", label: "Presse et articles", href: "/press", status: "live" },
          { key: "interviews", label: "Interviews", href: "/interviews", status: "live" },
          { key: "editorial-calendar", label: "Calendrier editorial", href: "/editorial-calendar", status: "live" },
          { key: "messaging", label: "Messages cles", href: "/messaging", status: "live" },
          { key: "sources", label: "Sources de donnees", href: "/data-sources", status: "live" },
          { key: "settings", label: "Reglages", href: "/settings", status: "live" },
        ],
      },
    ]);
  });

  it("expose les modules par famille metier selon les permissions", () => {
    expect(
      buildNavigation([
        "tasks.read",
        "field_reports.read",
        "contacts.read",
        "users.read",
        "elections.read",
        "budget.read",
        "meetings.read",
      ]),
    ).toEqual([
      {
        key: "home",
        label: "Vue d'ensemble",
        href: "/dashboard",
        children: [{ key: "dashboard", label: "Vue d'ensemble", href: "/dashboard", status: "live" }],
      },
      {
        key: "promises",
        label: "Engagements",
        href: "/mandate",
        children: [
          { key: "mandate", label: "Engagements du mandat", href: "/mandate", status: "live" },
          { key: "budget", label: "Budget communal", href: "/budget", status: "live" },
          { key: "municipal-documents", label: "Documents officiels", href: "/documents", status: "live" },
          { key: "tasks", label: "Plan d'action", href: "/tasks", status: "live" },
          { key: "meetings", label: "Reunions", href: "/meetings", status: "live" },
        ],
      },
      {
        key: "compare",
        label: "Elections",
        href: "/elections",
        children: [
          { key: "elections", label: "Synthese electorale", href: "/elections", status: "live" },
          { key: "history", label: "Historique electoral", href: "/elections/history", status: "live" },
          { key: "field-analysis", label: "Analyse comparative", href: "/field-analysis", status: "live" },
        ],
      },
      {
        key: "map",
        label: "Territoire",
        href: "/polling-stations",
        children: [
          { key: "map", label: "Carte des bureaux", href: "/polling-stations", status: "live" },
          { key: "field-reports", label: "Retours terrain", href: "/field-reports", status: "live" },
          { key: "contacts", label: "Contacts", href: "/contacts", status: "live" },
        ],
      },
      {
        key: "settings",
        label: "Administration",
        href: "/campaign",
        children: [
          { key: "campaign", label: "Campagne", href: "/campaign", status: "live" },
          { key: "social-media", label: "Reseaux sociaux", href: "/social-media", status: "live" },
          { key: "press-releases", label: "Communiques", href: "/press-releases", status: "live" },
          { key: "press", label: "Presse et articles", href: "/press", status: "live" },
          { key: "interviews", label: "Interviews", href: "/interviews", status: "live" },
          { key: "editorial-calendar", label: "Calendrier editorial", href: "/editorial-calendar", status: "live" },
          { key: "messaging", label: "Messages cles", href: "/messaging", status: "live" },
          { key: "users", label: "Utilisateurs", href: "/users", status: "live" },
          { key: "sources", label: "Sources de donnees", href: "/data-sources", status: "live" },
          { key: "settings", label: "Reglages", href: "/settings", status: "live" },
        ],
      },
    ]);
  });

  it("redirige un groupe vers le premier sous-item accessible", () => {
    const promisesGroup = buildNavigation(["budget.read"]).find((group) => group.key === "promises");

    expect(promisesGroup?.href).toBe("/mandate");
    expect(promisesGroup?.children.map((item) => item.href)).toEqual(["/mandate", "/budget", "/documents"]);
  });

  it("identifie le groupe actif et la sous-navigation a partir de la route", () => {
    const navigation = getNavigationContext("/meetings", ["meetings.read", "tasks.read"]);

    expect(navigation.activeGroup?.key).toBe("promises");
    expect(navigation.activeItem?.href).toBe("/meetings");
    expect(navigation.subNavigation.map((item) => item.href)).toEqual(["/tasks", "/meetings"]);
  });

  it("couvre toutes les routes de l'application dans la navigation", () => {
    expect(getNavigationCoverageIssues()).toEqual([]);
  });
});
