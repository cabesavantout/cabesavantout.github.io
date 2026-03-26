import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/field-reports/actions", () => ({
  createFieldReport: vi.fn(),
  updateFieldReport: vi.fn(),
}));

vi.mock("@/app/(app)/tasks/actions", () => ({
  createTaskFromFieldReport: vi.fn(),
}));

import { FieldReportsPage } from "@/components/field-reports-page";

describe("FieldReportsPage", () => {
  it("affiche les filtres, un retour et sa tâche liée", () => {
    render(
      <FieldReportsPage
        canCreateReports
        canManageReports
        canManageTasks
        citizens={[{ id: "cit-1", label: "Jeanne Martin" }]}
        pollingStations={[{ code: "0003", label: "0003 · Centre culturel" }]}
        reports={[
          {
            id: "fr-1",
            citizenId: "cit-1",
            citizenName: "Jeanne Martin",
            neighborhood: "Centre",
            pollingStationCode: "0003",
            topic: "Stationnement",
            tags: ["voirie", "centre"],
            summary: "Demande plus de rotation sur les arrêts minute.",
            source: "terrain",
            reportedAtLabel: "25 mars 2026",
            authorName: "Superadmin",
            supportLevel: "skeptical",
            priority: "high",
            status: "in_progress",
            sentiment: -1,
            linkedTaskId: "task-1",
            linkedTaskTitle: "Préparer une proposition sur le stationnement",
          },
        ]}
        filters={{
          q: "station",
          supportLevel: "",
          status: "",
          pollingStationCode: "",
        }}
      />,
    );

    expect(
      screen.getByPlaceholderText(/rechercher un sujet, résumé/i),
    ).toHaveValue("station");
    expect(screen.getAllByText("Stationnement").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Réservé").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Priorité haute")).toBeInTheDocument();
    expect(screen.getAllByText("En traitement").length).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByText(/préparer une proposition sur le stationnement/i),
    ).toBeInTheDocument();
    expect(screen.getByText("#voirie")).toBeInTheDocument();
    expect(screen.getByText(/ajouter un retour/i)).toBeInTheDocument();
  });

  it("affiche l'état vide sans formulaire si l'utilisateur ne peut pas créer", () => {
    render(
      <FieldReportsPage
        canCreateReports={false}
        canManageReports={false}
        canManageTasks={false}
        citizens={[]}
        pollingStations={[]}
        reports={[]}
        filters={{ q: "", supportLevel: "", status: "", pollingStationCode: "" }}
      />,
    );

    expect(screen.queryByText(/ajouter un retour/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/aucun retour terrain enregistré pour le moment/i),
    ).toBeInTheDocument();
  });
});
