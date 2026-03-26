import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/components/polling-stations-map", () => ({
  PollingStationsMap: () => <div>Carte mockée</div>,
}));

import { PollingStationsPage } from "@/components/polling-stations-page";

describe("PollingStationsPage", () => {
  it("affiche la carte et les bureaux chargés", () => {
    render(
      <PollingStationsPage
        geoJson={{
          type: "FeatureCollection",
          features: [],
        }}
        stations={[
          {
            pollingStationCode: "0003",
            pollingStationNumber: 3,
            placeName: "Centre culturel",
            address: "Avenue du 19 mars 1962",
            isCentralizer: true,
            geometryType: "Polygon",
            hasValidatedResults: true,
            inscrits2026: 900,
            votants2026: 520,
            exprimes2026: 500,
            topCandidateLabel: "Édith PUGNET",
            topCandidateGroup: "Cabestany avant tout",
            topCandidateVotes: 218,
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /bureaux de vote/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Carte mockée")).toBeInTheDocument();
    expect(screen.getByText("Centre culturel")).toBeInTheDocument();
    expect(screen.getAllByText(/résultats validés/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Édith PUGNET")).toBeInTheDocument();
    expect(screen.getByText("900")).toBeInTheDocument();
  });

  it("affiche les états vides sans données", () => {
    render(<PollingStationsPage geoJson={null} stations={[]} />);

    expect(screen.getByText(/geojson non chargé/i)).toBeInTheDocument();
    expect(screen.getByText(/aucun bureau chargé/i)).toBeInTheDocument();
  });
});
