import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/citizens/actions", () => ({
  createCitizen: vi.fn(),
  updateCitizen: vi.fn(),
}));

import { CitizensPage } from "@/components/citizens-page";

describe("CitizensPage", () => {
  it("affiche une liste CRM compacte et ouvre le détail secondaire", () => {
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

    expect(screen.getByRole("heading", { name: "Citoyens" })).toBeInTheDocument();
    expect(screen.getByText("Liste des citoyens")).toBeInTheDocument();
    expect(screen.getByText("Jeanne Martin")).toBeInTheDocument();
    expect(screen.getByText("Centre · Bureau 0003")).toBeInTheDocument();
    expect(screen.getAllByText("Favorable").length).toBeGreaterThan(0);
    expect(screen.getByText("Tâche ouverte")).toBeInTheDocument();
    expect(screen.getByText("Suivre la tâche ouverte")).toBeInTheDocument();
    expect(screen.getByText(/stationnement .*24 mars 2026/i)).toBeInTheDocument();
    expect(screen.getByText(/#parents #ecole/i)).toBeInTheDocument();
    expect(screen.getByText("En traitement")).toBeInTheDocument();
    expect(screen.getByText("Ajouter")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Ouvrir" }));

    expect(screen.getByRole("heading", { name: "Jeanne Martin" })).toBeInTheDocument();
    expect(screen.getByText("Rappeler Jeanne Martin")).toBeInTheDocument();
    expect(screen.getAllByText("Disponible pour aider sur le terrain.").length).toBeGreaterThan(0);
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

    expect(screen.queryByText("Ajouter")).not.toBeInTheDocument();
    expect(
      screen.getAllByText(/aucune fiche citoyen/i).length,
    ).toBeGreaterThanOrEqual(1);
  });
});
