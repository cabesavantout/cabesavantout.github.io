import React from "react";
import { render, screen } from "@testing-library/react";
import { SearchPage } from "@/components/search-page";

describe("SearchPage", () => {
  it("affiche le message d'attente sans requête", () => {
    render(
      <SearchPage
        data={{
          query: "",
          citizens: [],
          fieldReports: [],
          tasks: [],
        }}
      />,
    );

    expect(
      screen.getByText(
        /lancez une recherche pour interroger plusieurs modules d’un coup/i,
      ),
    ).toBeInTheDocument();
    expect(screen.getAllByText(/aucun résultat\./i)).toHaveLength(3);
  });

  it("affiche le total et les résultats multi-modules", () => {
    render(
      <SearchPage
        data={{
          query: "stationnement",
          citizens: [
            {
              id: "cit-1",
              fullName: "Jeanne Martin",
              supportLevel: "supportive",
              pollingStationCode: "0003",
            },
          ],
          fieldReports: [
            {
              id: "fr-1",
              topic: "Stationnement",
              summary: "Rotation demandée au centre-ville.",
              status: "new",
              citizenName: "Jeanne Martin",
              pollingStationCode: "0003",
            },
          ],
          tasks: [
            {
              id: "task-1",
              title: "Préparer note stationnement",
              status: "blocked",
              priority: "high",
              ownerName: "Claire Martin",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByText(/3 résultat\(s\) pour “stationnement”\./i),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Jeanne Martin")).toHaveLength(2);
    expect(screen.getByText("Favorable")).toBeInTheDocument();
    expect(screen.getByText("Stationnement")).toBeInTheDocument();
    expect(screen.getByText("Nouveau")).toBeInTheDocument();
    expect(screen.getByText("Préparer note stationnement")).toBeInTheDocument();
    expect(screen.getByText("Bloquée")).toBeInTheDocument();
    expect(screen.getByText("Haute")).toBeInTheDocument();
  });
});
