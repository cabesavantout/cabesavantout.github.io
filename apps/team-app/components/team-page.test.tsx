import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/team/actions", () => ({
  assignSectorOwner: vi.fn(),
}));

import { TeamPage } from "@/components/team-page";

describe("TeamPage", () => {
  it("affiche les priorités, les paniers d'action et les secteurs", () => {
    const sector = {
      id: "s1",
      label: "Secteur centre",
      pollingStationCode: "0003",
      neighborhood: "Centre",
      primaryOwnerId: "u1",
      primaryOwnerName: "Jeanne Martin",
      citizenCount: 12,
      reportCount: 5,
      urgentReportCount: 2,
      priorityScore: 8,
      turnoutPct: 61.2,
      topCandidateLabel: "Édith PUGNET",
      topCandidateShare: 43.6,
    };

    render(
      <TeamPage
        canManageTeam
        activeUsers={[{ id: "u1", fullName: "Jeanne Martin", email: "jeanne@example.com" }]}
        data={{
          priorityLeaders: [sector],
          actionBuckets: {
            assignThisWeek: [
              { ...sector, id: "s2", primaryOwnerId: null, primaryOwnerName: null },
            ],
            reviewPolitically: [sector],
            activateField: [sector],
          },
          sectors: [sector],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /couverture terrain/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Priorités de couverture")).toBeInTheDocument();
    expect(screen.getAllByText("Secteur centre").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/bureau 0003/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/jeanne martin · 5 retours · 12 fiches/i)).toBeInTheDocument();
    expect(screen.getByText(/responsable actuel : jeanne martin/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /enregistrer/i })).toBeInTheDocument();
  });

  it("affiche les états vides quand il n'y a rien à traiter", () => {
    render(
      <TeamPage
        canManageTeam={false}
        activeUsers={[]}
        data={{
          priorityLeaders: [],
          actionBuckets: {
            assignThisWeek: [],
            reviewPolitically: [],
            activateField: [],
          },
          sectors: [],
        }}
      />,
    );

    expect(
      screen.getByText(/aucun secteur sans responsable à ce stade/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/aucune alerte politique forte détectée/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/aucun secteur couvert avec signal activable/i),
    ).toBeInTheDocument();
  });
});
