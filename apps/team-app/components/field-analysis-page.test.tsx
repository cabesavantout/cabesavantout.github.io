import React from "react";
import { render, screen } from "@testing-library/react";

import { FieldAnalysisPage } from "@/components/field-analysis-page";

describe("FieldAnalysisPage", () => {
  it("affiche les stats, thèmes, soutiens et urgences", () => {
    render(
      <FieldAnalysisPage
        data={{
          summary: {
            totalReports: 12,
            openReports: 7,
            urgentReports: 2,
            linkedCitizens: 5,
          },
          topicBreakdown: [{ topic: "Stationnement", reportCount: 4 }],
          supportBreakdown: [{ supportLevel: "skeptical", reportCount: 3 }],
          stationBreakdown: [
            {
              pollingStationCode: "0003",
              placeName: "Centre culturel",
              reportCount: 4,
              urgentCount: 2,
            },
          ],
          urgentReports: [
            {
              id: "fr1",
              topic: "Voirie",
              summary: "Danger piéton sur un carrefour.",
              pollingStationCode: "0003",
              supportLevel: "supportive",
              status: "in_progress",
              reportedAtLabel: "2026-03-25 10:30",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /analyse terrain/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Retours total")).toBeInTheDocument();
    expect(screen.getByText("Stationnement")).toBeInTheDocument();
    expect(screen.getByText("Réservé")).toBeInTheDocument();
    expect(screen.getAllByText("Bureau 0003").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Voirie")).toBeInTheDocument();
    expect(screen.getByText(/danger piéton/i)).toBeInTheDocument();
  });

  it("affiche l'état vide des urgences", () => {
    render(
      <FieldAnalysisPage
        data={{
          summary: {
            totalReports: 0,
            openReports: 0,
            urgentReports: 0,
            linkedCitizens: 0,
          },
          topicBreakdown: [],
          supportBreakdown: [],
          stationBreakdown: [],
          urgentReports: [],
        }}
      />,
    );

    expect(
      screen.getByText(/aucune urgence ouverte pour le moment/i),
    ).toBeInTheDocument();
  });
});
