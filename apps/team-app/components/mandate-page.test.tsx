import React from "react";
import { render, screen } from "@testing-library/react";
import { MandatePage } from "@/components/mandate-page";

describe("MandatePage", () => {
  it("affiche les promesses pilotées, les repères budgétaires et les sources", () => {
    render(
      <MandatePage
        data={{
          annualRows: [
            {
              label: "Budget total",
              years: [
                {
                  yearLabel: "2024",
                  value: "22 866 962 €",
                  sourceLabel: "CFU 2024",
                  note: "Repère global.",
                },
                {
                  yearLabel: "2025",
                  value: "20 956 985 €",
                  sourceLabel: "ROB 2026",
                  note: "Repère calculé.",
                },
                {
                  yearLabel: "2026",
                  value: "À consolider",
                  sourceLabel: "ROB 2026",
                  note: "À reprendre.",
                },
              ],
            },
          ],
          commitments: [
            {
              id: "ecole",
              title: "École Jacques Prévert",
              category: "Équipement public",
              status: "engage",
              summary: "Projet majeur du mandat.",
              budgetSignal: "3 M€ environ.",
              timeline: "2026-2027",
              evidence: "ROB 2026",
            },
          ],
          sourceDocuments: [
            {
              label: "ROB 2026",
              href: "/api/documents?path=data%2F20260216_Rapport-dorientations-budgetaires-2026.pdf",
              note: "Document principal.",
            },
            {
              label: "Procès verbal conseil municipal 2025",
              href: "https://ville-cabestany.fr/wp-content/uploads/2025/02/proces-verbal-conseil-municipal.pdf",
              note: "2025 · Procès-verbal ou compte rendu municipal, utile pour vérifier ce qui a été acté.",
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: /^promesses$/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /suivi des promesses/i })).toBeInTheDocument();
    expect(screen.getAllByText("À risque").length).toBeGreaterThan(0);
    expect(screen.getAllByText("À documenter").length).toBeGreaterThan(0);
    expect(screen.getAllByText("En cours").length).toBeGreaterThan(0);
    expect(screen.getByText("École Jacques Prévert")).toBeInTheDocument();
    expect(screen.getAllByText("Équipement public").length).toBeGreaterThan(0);
    expect(screen.getByText("Engagé")).toBeInTheDocument();
    expect(screen.getByText(/confirmer l'avancement réel/i)).toBeInTheDocument();
    expect(screen.getByText(/preuve partielle/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /actions secondaires/i })).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: /^ouvrir$/i }).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /^ouvrir$/i })[1]).toHaveAttribute(
      "href",
      "/api/documents?path=data%2F20260216_Rapport-dorientations-budgetaires-2026.pdf",
    );
    expect(screen.getByRole("link", { name: /ouvrir le budget/i })).toHaveAttribute("href", "/budget");
    expect(screen.getByRole("link", { name: /voir tous les documents/i })).toHaveAttribute("href", "/documents");
  });
});
