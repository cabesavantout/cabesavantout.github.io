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
          contacts: [],
        }}
      />,
    );

    expect(
      screen.getByText(/lancez une recherche pour retrouver rapidement un citoyen/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/aucune recherche lancée/i)).toBeInTheDocument();
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
              priority: "critical",
              citizenName: "Jeanne Martin",
              pollingStationCode: "0003",
              reportedAtLabel: "26/03 10:00",
            },
          ],
          tasks: [
            {
              id: "task-1",
              title: "Préparer note stationnement",
              status: "blocked",
              priority: "high",
              ownerName: "Claire Martin",
              updatedAtLabel: "26/03 11:00",
            },
          ],
          contacts: [
            {
              id: "contact-1",
              fullName: "Claire Martin",
              contactKind: "partner",
              organization: "Comité de quartier",
              roleLabel: "Présidente",
              email: "claire@example.org",
              phone: "0600000000",
              updatedAtLabel: "26/03 09:00",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByText(/4 résultat\(s\) utile\(s\) pour “stationnement”\./i),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /meilleurs résultats/i })).toBeInTheDocument();
    expect(screen.getAllByText("Jeanne Martin").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/favorable/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Stationnement").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/rotation demandée au centre-ville/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText("Préparer note stationnement").length).toBeGreaterThan(0);
    expect(screen.getAllByText(/responsable : claire martin/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/comité de quartier/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /ouvrir/i }).length).toBeGreaterThan(0);
  });
});
