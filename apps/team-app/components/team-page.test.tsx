import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/team/actions", () => ({
  assignSectorOwner: vi.fn(),
}));

import { TeamPage } from "@/components/team-page";

describe("TeamPage", () => {
  it("affiche les secteurs à traiter, le résumé de couverture et la liste compacte", () => {
    const sector = {
      id: "s1",
      code: "SEC-001",
      label: "Secteur centre",
      pollingStationCode: "0003",
      priorityRank: 1,
      neighborhood: "Centre",
      notes: null,
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
          coveredCount: 1,
          uncoveredCount: 1,
          urgentSectorCount: 1,
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

    expect(screen.getByRole("heading", { name: /^Équipe terrain$/i })).toBeInTheDocument();
    expect(screen.getByText(/secteurs à traiter maintenant/i)).toBeInTheDocument();
    expect(screen.getByText(/liste des secteurs/i)).toBeInTheDocument();
    expect(screen.getAllByText("Secteur centre").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/zone 0003/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/secteurs couverts/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^Sans responsable$/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/couverture/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("button", { name: /assigner/i }).length).toBeGreaterThan(0);
  });

  it("affiche les états vides quand il n'y a rien à traiter", () => {
    render(
      <TeamPage
        canManageTeam={false}
        activeUsers={[]}
        data={{
          coveredCount: 0,
          uncoveredCount: 0,
          urgentSectorCount: 0,
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

    expect(screen.getByText(/aucun secteur à traiter/i)).toBeInTheDocument();
    expect(screen.getByText(/aucun secteur pour ce filtre/i)).toBeInTheDocument();
  });
});
