import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { ElectoralAnalysisPage } from "@/components/electoral-analysis-page";

describe("ElectoralAnalysisPage", () => {
  it("affiche une lecture communale fondée sur l'historique consolidé", () => {
    render(
      <ElectoralAnalysisPage
        data={{
          latestElection: {
            electionId: "municipales-2026-t2",
            electionType: "municipales",
            electionYear: 2026,
            roundNumber: 2,
            dateScrutin: "2026-03-22",
            inscrits: 8670,
            votants: 5346,
            exprimes: 5175,
            turnoutPct: 61.66,
            topLabel: "LA PASSION DE CABESTANY",
            topCandidate: "Mme Édith PUGNET",
            topNuance: "LUG",
            topVotes: 2920,
            topShare: 56.43,
            sourceLabel: "Municipales",
          },
          latestByType: [
            {
              electionType: "municipales",
              label: "Municipales",
              electionCount: 3,
              averageTurnoutPct: 55.61,
              latest: {
                electionId: "municipales-2026-t2",
                electionType: "municipales",
                electionYear: 2026,
                roundNumber: 2,
                dateScrutin: "2026-03-22",
                inscrits: 8670,
                votants: 5346,
                exprimes: 5175,
                turnoutPct: 61.66,
                topLabel: "LA PASSION DE CABESTANY",
                topCandidate: "Mme Édith PUGNET",
                topNuance: "LUG",
                topVotes: 2920,
                topShare: 56.43,
                sourceLabel: "Municipales",
              },
            },
            {
              electionType: "presidentielles",
              label: "Présidentielles",
              electionCount: 4,
              averageTurnoutPct: 76.2,
              latest: {
                electionId: "presidentielles-2022-t2",
                electionType: "presidentielles",
                electionYear: 2022,
                roundNumber: 2,
                dateScrutin: "2022-04-24",
                inscrits: 8176,
                votants: 6151,
                exprimes: 5566,
                turnoutPct: 75.23,
                topLabel: "Mme Marine LE PEN",
                topCandidate: "Mme Marine LE PEN",
                topNuance: null,
                topVotes: 2955,
                topShare: 53.09,
                sourceLabel: "Présidentielles",
              },
            },
          ],
          history: [
            {
              electionId: "municipales-2026-t2",
              electionType: "municipales",
              electionYear: 2026,
              roundNumber: 2,
              dateScrutin: "2026-03-22",
              inscrits: 8670,
              votants: 5346,
              exprimes: 5175,
              turnoutPct: 61.66,
              topLabel: "LA PASSION DE CABESTANY",
              topCandidate: "Mme Édith PUGNET",
              topNuance: "LUG",
              topVotes: 2920,
              topShare: 56.43,
              sourceLabel: "Municipales",
            },
            {
              electionId: "presidentielles-2022-t2",
              electionType: "presidentielles",
              electionYear: 2022,
              roundNumber: 2,
              dateScrutin: "2022-04-24",
              inscrits: 8176,
              votants: 6151,
              exprimes: 5566,
              turnoutPct: 75.23,
              topLabel: "Mme Marine LE PEN",
              topCandidate: "Mme Marine LE PEN",
              topNuance: null,
              topVotes: 2955,
              topShare: 53.09,
              sourceLabel: "Présidentielles",
            },
          ],
          electionDocuments: [
            {
              label: "Municipales 2026 commune csv",
              href: "/api/documents?path=data%2Felections%2Fmunicipales%2F2026-municipales-cabestany-commune.csv",
              note: "Fichier source local des résultats électoraux.",
              electionType: "municipales",
              electionYear: 2026,
            },
          ],
          municipalDocuments: [
            {
              label: "Prochain conseil municipal",
              href: "https://ville-cabestany.fr/prochain-conseil-municipal/",
              note: "Source municipale liée au conseil, utile pour suivre convocations et actes autour des décisions publiques.",
              year: null,
            },
          ],
          sequences: [
            {
              electionId: "municipales-2026-t2",
              electionType: "municipales",
              electionYear: 2026,
              roundNumber: 2,
              dateScrutin: "2026-03-22",
              turnoutPct: 61.66,
              topLabel: "LA PASSION DE CABESTANY",
              topCandidate: "Mme Édith PUGNET",
              topShare: 56.43,
              bureauCoverageCount: 1,
              bureauHighlights: [
                {
                  pollingStationCode: "0003",
                  turnoutPct: 54.4,
                  topLabel: "LA PASSION DE CABESTANY",
                  topShare: 56.4,
                  note: "Participation 54.4 % · tête LA PASSION DE CABESTANY (56.4 %).",
                },
              ],
              documents: [
                {
                  label: "Municipales 2026 commune csv",
                  href: "/api/documents?path=data%2Felections%2Fmunicipales%2F2026-municipales-cabestany-commune.csv",
                  note: "Fichier source local des résultats électoraux.",
                },
              ],
              municipalDocuments: [
                {
                  label: "Prochain conseil municipal",
                  href: "https://ville-cabestany.fr/prochain-conseil-municipal/",
                  note: "Source municipale liée au conseil, utile pour suivre convocations et actes autour des décisions publiques.",
                },
              ],
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Élections" })).toBeInTheDocument();
    expect(screen.getByText("Lecture communale")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Vue actuelle" })).toBeInTheDocument();
    expect(screen.getByText(/scrutin suivi/i)).toBeInTheDocument();
    expect(screen.getAllByText(/municipales 2026/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/la passion de cabestany/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/pas de comparaison disponible/i)).toBeInTheDocument();
    expect(screen.getByText("Prochaine lecture utile")).toBeInTheDocument();
    expect(screen.getByText("Pièces et bureaux associés")).toBeInTheDocument();
    expect(screen.getByText("Bureaux à relire")).toBeInTheDocument();
    expect(screen.getByText(/bureau 0003/i)).toBeInTheDocument();
    expect(screen.getByText("Sources électorales locales")).toBeInTheDocument();
    expect(screen.getByText("Actes municipaux liés")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ouvrir la source" })).toHaveAttribute(
      "href",
      "/api/documents?path=data%2Felections%2Fmunicipales%2F2026-municipales-cabestany-commune.csv",
    );
    expect(screen.getAllByRole("link", { name: "Voir l'historique électoral" })[0]).toHaveAttribute(
      "href",
      "/elections/history",
    );
    expect(screen.getAllByRole("link", { name: "Ouvrir la carte" }).length).toBeGreaterThan(0);

    fireEvent.click(screen.getByRole("button", { name: "Présidentielles" }));

    expect(screen.getAllByText(/présidentielles 2022/i).length).toBeGreaterThan(0);
    expect(screen.getByText("Aucun scrutin comparable")).toBeInTheDocument();
  });

  it("affiche un état vide si aucun scrutin ne correspond au filtre", () => {
    render(
      <ElectoralAnalysisPage
        data={{
          latestElection: null,
          latestByType: [],
          history: [],
        }}
      />,
    );

    expect(screen.getByText("Aucun scrutin")).toBeInTheDocument();
    expect(screen.getAllByText(/voir l'historique électoral/i).length).toBeGreaterThan(0);
  });
});
