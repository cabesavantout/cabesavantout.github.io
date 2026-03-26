import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/citizens/actions", () => ({
  createCitizen: vi.fn(),
  updateCitizen: vi.fn(),
}));

import { CitizensPage } from "@/components/citizens-page";

describe("CitizensPage", () => {
  it("affiche une fiche citoyen avec son historique récent", () => {
    render(
      <CitizensPage
        canManageCitizens
        citizens={[
          {
            id: "cit-1",
            fullName: "Jeanne Martin",
            phone: "06 00 00 00 00",
            email: "jeanne@example.com",
            address: "Rue des fleurs",
            neighborhood: "Centre",
            pollingStationCode: "0003",
            supportLevel: "supportive",
            tags: ["parents", "ecole"],
            notes: "Disponible pour aider sur le terrain.",
            createdByName: "Superadmin",
            updatedAtLabel: "25 mars 2026",
            recentReports: [
              {
                id: "fr-1",
                topic: "Stationnement",
                summary: "Souhaite plus de rotation au centre-ville.",
                status: "in_progress",
                reportedAtLabel: "24 mars 2026",
              },
            ],
            relatedTasks: [
              {
                id: "task-1",
                title: "Rappeler Jeanne Martin",
                status: "todo",
                dueAtLabel: "26 mars 2026",
              },
            ],
          },
        ]}
        filters={{ q: "", supportLevel: "", pollingStationCode: "" }}
        pollingStations={[{ code: "0003", label: "0003 · Centre culturel" }]}
      />,
    );

    expect(screen.getByText("Jeanne Martin")).toBeInTheDocument();
    expect(screen.getAllByText("Favorable").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Bureau 0003")).toBeInTheDocument();
    expect(screen.getByText("#parents")).toBeInTheDocument();
    expect(screen.getByText("Stationnement")).toBeInTheDocument();
    expect(screen.getByText("En traitement")).toBeInTheDocument();
    expect(screen.getByText("Rappeler Jeanne Martin")).toBeInTheDocument();
    expect(screen.getByText(/ajouter une fiche/i)).toBeInTheDocument();
  });

  it("affiche l'état vide sans panneau d'ajout si l'utilisateur ne gère pas les fiches", () => {
    render(
      <CitizensPage
        canManageCitizens={false}
        citizens={[]}
        filters={{ q: "", supportLevel: "", pollingStationCode: "" }}
        pollingStations={[]}
      />,
    );

    expect(screen.queryByText(/ajouter une fiche/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/aucune fiche citoyen enregistrée pour le moment/i),
    ).toBeInTheDocument();
  });
});
