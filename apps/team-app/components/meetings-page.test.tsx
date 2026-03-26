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
  it("affiche une réunion, ses notes et ses actions", () => {
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
            startsAtLabel: "2026-03-25 18:30",
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
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /réunions et actions/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Réunion quartier centre")).toBeInTheDocument();
    expect(screen.getByText(/préparer la réunion publique/i)).toBeInTheDocument();
    expect(screen.getByText(/prévoir un point stationnement/i)).toBeInTheDocument();
    expect(screen.getByText("Préparer la salle")).toBeInTheDocument();
    expect(screen.getByText("Jeanne Martin · 2026-03-26 09:00")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^Ajouter une réunion$/i }),
    ).toBeInTheDocument();
  });

  it("affiche l'état vide sans ajout si l'utilisateur ne gère pas les réunions", () => {
    render(
      <MeetingsPage
        canManageMeetings={false}
        activeUsers={[]}
        meetings={[]}
      />,
    );

    expect(screen.queryByText(/ajouter une réunion/i)).not.toBeInTheDocument();
    expect(
      screen.getByText(/aucune réunion enregistrée pour le moment/i),
    ).toBeInTheDocument();
  });
});
