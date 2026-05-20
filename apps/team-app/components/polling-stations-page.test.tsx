import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/polling-stations-map-shell", () => ({
  PollingStationsMapShell: () => <div>Carte mockée</div>,
}));

import { PollingStationsPage } from "@/components/polling-stations-page";

describe("PollingStationsPage", () => {
  it("affiche une carte orientée terrain et une liste simple de zones", () => {
    render(
      <PollingStationsPage
        geoJson={{
          type: "FeatureCollection",
          features: [],
        }}
        sectors={[
          {
            id: "sector-1",
            code: "SEC-001",
            label: "Secteur Centre",
            pollingStationCode: "0003",
            neighborhood: "Centre",
            priorityRank: 1,
            notes: null,
            primaryOwnerId: "user-1",
            primaryOwnerName: "Camille Martin",
            citizenCount: 34,
            reportCount: 3,
            urgentReportCount: 1,
            turnoutPct: null,
            topCandidateLabel: null,
            topCandidateShare: null,
            priorityScore: 32,
            streets: ["Rue de la Mairie", "Avenue Jean Jaurès"],
            streetCount: 2,
            streetSource: "citizens",
          },
        ]}
        stations={[
          {
            pollingStationCode: "0003",
            pollingStationNumber: 3,
            placeName: "Centre culturel",
            address: "Avenue du 19 mars 1962",
            isCentralizer: true,
            geometryType: "Polygon",
            reportCount: 4,
            urgentCount: 1,
            opposedOrSkepticalCount: 2,
            recentTurnoutPct: 57.8,
            historicalTurnoutAvg: 53.2,
            turnoutTrendPct: 4.6,
            electionsCount: 12,
            latestElectionLabel: "europeennes 2024 T1",
          },
          {
            pollingStationCode: "0008",
            pollingStationNumber: 8,
            placeName: "École Ludovic Masse",
            address: "Rue des écoles",
            isCentralizer: false,
            geometryType: "Polygon",
            reportCount: 0,
            urgentCount: 0,
            opposedOrSkepticalCount: 0,
            recentTurnoutPct: 54.8,
            historicalTurnoutAvg: 52.4,
            turnoutTrendPct: 2.4,
            electionsCount: 10,
            latestElectionLabel: "europeennes 2024 T1",
          },
        ]}
      />,
    );

    expect(screen.getAllByRole("heading", { name: "Carte" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Carte mockée")).toBeInTheDocument();
    expect(screen.getByText("Zones prioritaires")).toBeInTheDocument();
    expect(screen.getByText(/1 zone demande une attention immédiate/i)).toBeInTheDocument();
    expect(screen.getByText("Secteur Centre")).toBeInTheDocument();
    expect(screen.getAllByText("Urgent").length).toBeGreaterThan(0);
    expect(screen.getByText(/Le terrain remonte déjà une alerte qualifiée/i)).toBeInTheDocument();
    expect(screen.getByText(/4 signaux · 1 urgents/i)).toBeInTheDocument();
    expect(screen.getByText("Actions secondaires")).toBeInTheDocument();
    expect(screen.getAllByRole("button", { name: "Voir sur la carte" }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Voir les retours" })[0]).toHaveAttribute("href", "/field-reports");
    expect(screen.getAllByRole("link", { name: "Voir l'équipe" })[0]).toHaveAttribute("href", "/team");
    expect(screen.queryByText(/europeennes 2024 T1/i)).not.toBeInTheDocument();
  });

  it("affiche les états vides lisibles sans données", () => {
    render(<PollingStationsPage geoJson={null} stations={[]} sectors={[]} />);

    expect(screen.getByText(/carte indisponible/i)).toBeInTheDocument();
    expect(screen.getByText(/aucun secteur exploitable/i)).toBeInTheDocument();
    expect(screen.getByText(/aucune zone à afficher/i)).toBeInTheDocument();
  });
});
