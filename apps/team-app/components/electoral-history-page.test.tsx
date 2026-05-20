import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";

import { ElectoralHistoryPage } from "@/components/electoral-history-page";

describe("ElectoralHistoryPage", () => {
  it("affiche l'historique filtrable des scrutins consolidés", () => {
    render(
      <ElectoralHistoryPage
        data={{
          latestElection: null,
          latestByType: [],
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
              label: "Presidentielles 2022 2eme tour csv",
              href: "/api/documents?path=data%2Felections%2Fpresidentielles%2Fpresidentielles_2022_2eme_tour.csv",
              note: "Fichier source local des résultats électoraux.",
              electionType: "presidentielles",
              electionYear: 2022,
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
                  pollingStationCode: "0008",
                  turnoutPct: 52.1,
                  topLabel: "LA PASSION DE CABESTANY",
                  topShare: 56.4,
                  note: "Participation 52.1 % · tête LA PASSION DE CABESTANY (56.4 %).",
                },
              ],
              documents: [],
              municipalDocuments: [],
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Historique électoral" })).toBeInTheDocument();
    expect(screen.getByText("Chronologie des scrutins")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Présidentielles" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toutes années" })).toBeInTheDocument();
    expect(screen.getByText("2 scrutins visibles.")).toBeInTheDocument();
    expect(screen.getByText("Sources électorales locales")).toBeInTheDocument();
    expect(screen.getByText("Actes municipaux liés")).toBeInTheDocument();
    expect(screen.getByText(/bureau à surveiller: 0008/i)).toBeInTheDocument();
    expect(screen.getAllByText(/la passion de cabestany/i).length).toBeGreaterThan(0);
    expect(screen.getByRole("link", { name: "Voir la synthèse" })).toHaveAttribute("href", "/elections");

    fireEvent.click(screen.getByRole("button", { name: "2022" }));

    expect(screen.getByText("1 scrutin visible en 2022.")).toBeInTheDocument();
    expect(screen.getByText(/mme marine le pen/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ouvrir la source" })).toHaveAttribute(
      "href",
      "/api/documents?path=data%2Felections%2Fpresidentielles%2Fpresidentielles_2022_2eme_tour.csv",
    );
    expect(screen.queryByText(/la passion de cabestany/i)).not.toBeInTheDocument();
  });

  it("affiche un état vide si aucun scrutin n'est disponible", () => {
    render(
      <ElectoralHistoryPage
        data={{
          latestElection: null,
          latestByType: [],
          history: [],
        }}
      />,
    );

    expect(screen.getByText(/aucun scrutin ne correspond à ce filtre/i)).toBeInTheDocument();
  });
});
