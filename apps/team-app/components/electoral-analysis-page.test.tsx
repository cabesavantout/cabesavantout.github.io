import React from "react";
import { render, screen } from "@testing-library/react";

import { ElectoralAnalysisPage } from "@/components/electoral-analysis-page";

describe("ElectoralAnalysisPage", () => {
  it("affiche les scores candidats, la lecture par bureau et le croisement terrain", () => {
    render(
      <ElectoralAnalysisPage
        data={{
          communeSummary: {
            validatedBureaus: 5,
            totalValidatedVotes: 2821,
            topCandidate: "Édith PUGNET",
            topCandidateVotes: 1210,
          },
          candidateScores: [
            {
              candidateLabel: "Édith PUGNET",
              candidateGroup: "Cabestany avant tout",
              votes: 1210,
              share: 42.9,
            },
          ],
          bureauBreakdown: [
            {
              pollingStationCode: "0003",
              placeName: "Centre culturel",
              turnoutPct: 60.2,
              exprimes: 513,
              topCandidateLabel: "Édith PUGNET",
              topCandidateVotes: 218,
              topCandidateShare: 42.5,
            },
          ],
          fieldOverlay: [
            {
              pollingStationCode: "0003",
              placeName: "Centre culturel",
              turnoutPct: 60.2,
              topCandidateLabel: "Édith PUGNET",
              topCandidateShare: 42.5,
              reportCount: 4,
              urgentCount: 1,
              opposedOrSkepticalCount: 2,
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /analyse électorale/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Édith PUGNET").length).toBeGreaterThan(0);
    expect(screen.getByText(/1210 voix/i)).toBeInTheDocument();
    expect(screen.getAllByText(/bureau 0003/i).length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/513 exprimés/i)).toBeInTheDocument();
    expect(screen.getByText(/4 retours/i)).toBeInTheDocument();
    expect(screen.getByText(/1 urgents/i)).toBeInTheDocument();
    expect(screen.getByText(/2 réservés \/ opposés/i)).toBeInTheDocument();
  });

  it("affiche le message sans alerte qualifiée quand il n'y a pas de signaux négatifs", () => {
    render(
      <ElectoralAnalysisPage
        data={{
          communeSummary: {
            validatedBureaus: 1,
            totalValidatedVotes: 100,
            topCandidate: null,
            topCandidateVotes: null,
          },
          candidateScores: [],
          bureauBreakdown: [],
          fieldOverlay: [
            {
              pollingStationCode: "0008",
              placeName: "École Ludovic Masse",
              turnoutPct: null,
              topCandidateLabel: null,
              topCandidateShare: null,
              reportCount: 1,
              urgentCount: 0,
              opposedOrSkepticalCount: 0,
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByText(/aucun signal réservé\/opposé/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/sans alerte qualifiée majeure à ce stade/i),
    ).toBeInTheDocument();
  });
});
