import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/meetings/actions", () => ({
  createMeeting: vi.fn(),
  createMeetingAction: vi.fn(),
  createMeetingNote: vi.fn(),
}));

import { MeetingsPage } from "@/components/meetings-page";

describe("MeetingsPage", () => {
  it("met en avant la prochaine réunion et sépare préparation et suivi", () => {
    render(
      <MeetingsPage
        canManageMeetings
        activeUsers={[{ id: "u1", fullName: "Jeanne Martin", email: "jeanne@example.com" }]}
        meetings={[
          {
            id: "m1",
            title: "Réunion quartier centre",
            description: "Préparer la réunion publique.",
            location: "Centre culturel",
            status: "planned",
            origin: "internal",
            startsAtLabel: "2026-04-02 18:30",
            createdByName: "Superadmin",
            notesCount: 1,
            openActionsCount: 1,
            notes: [
              {
                id: "n1",
                body: "Prévoir un point stationnement.",
                authorName: "Superadmin",
                createdAtLabel: "2026-03-25 19:00",
              },
            ],
            actions: [
              {
                id: "a1",
                title: "Préparer la salle",
                ownerName: "Jeanne Martin",
                dueAtLabel: "2026-03-26 09:00",
                isDone: false,
              },
            ],
          },
          {
            id: "m2",
            title: "Debrief terrain",
            description: "Clôturer les points après porte-à-porte.",
            location: "Local de campagne",
            status: "completed",
            origin: "internal",
            startsAtLabel: "2026-03-20 18:30",
            createdByName: "Superadmin",
            notesCount: 2,
            openActionsCount: 0,
            notes: [],
            actions: [],
          },
        ]}
      />,
    );

    expect(screen.getByRole("heading", { name: /^Réunions$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Prochaine réunion/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /À préparer/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Réunions récentes/i })).toBeInTheDocument();
    expect(screen.getByText("Réunion quartier centre")).toBeInTheDocument();
    expect(screen.getByText(/préparer la réunion publique/i)).toBeInTheDocument();
    expect(screen.getByText(/1 action\(s\) ouverte\(s\)/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^Ouvrir$/i })).toBeInTheDocument();
    expect(screen.getByText("Debrief terrain")).toBeInTheDocument();
    expect(screen.getByText(/^Nouvelle réunion$/i)).toBeInTheDocument();
  });

  it("affiche l'état vide sans ajout si l'utilisateur ne gère pas les réunions", () => {
    render(
      <MeetingsPage
        canManageMeetings={false}
        activeUsers={[]}
        meetings={[]}
      />,
    );

    expect(screen.queryByText(/^Nouvelle réunion$/i)).not.toBeInTheDocument();
    expect(screen.getByText(/aucune réunion à venir/i)).toBeInTheDocument();
    expect(screen.getByText(/aucune réunion récente/i)).toBeInTheDocument();
  });

  it("signale les conseils municipaux importes depuis la mairie", () => {
    render(
      <MeetingsPage
        canManageMeetings
        activeUsers={[]}
        meetings={[
          {
            id: "mairie-council-2026-03-27",
            title: "Conseil municipal",
            description: "Date publique publiée par la mairie.",
            location: "Salle du conseil, Hôtel de ville",
            status: "planned",
            origin: "mairie",
            startsAtLabel: "2026-03-27 18:30",
            createdByName: "Mairie de Cabestany",
            notesCount: 0,
            openActionsCount: 0,
            notes: [],
            actions: [],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /historique des conseils municipaux publiés/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/archives visibles des séances relevées sur le site de la mairie/i)).toBeInTheDocument();
    expect(screen.getByText(/source mairie/i)).toBeInTheDocument();
    expect(screen.getByText(/conseil municipal/i)).toBeInTheDocument();
  });
});
