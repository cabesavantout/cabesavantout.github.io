import React from "react";
import { render, screen } from "@testing-library/react";
import { BudgetPage } from "@/components/budget-page";

describe("BudgetPage", () => {
  it("met en avant la synthèse stratégique, les lignes utiles et les documents prioritaires", () => {
    render(
      <BudgetPage
        data={{
          stats: [],
          comparisonRows: [
            {
              label: "Budget total",
              values: [
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
            {
              label: "Dette / encours",
              values: [
                {
                  yearLabel: "2024",
                  value: "6 995 442 €",
                  sourceLabel: "CFU 2024",
                  note: "Encours lisible.",
                },
                {
                  yearLabel: "2025",
                  value: "≈ 7,0 M€",
                  sourceLabel: "ROB 2026",
                  note: "Ordre de grandeur lu dans la dette.",
                },
                {
                  yearLabel: "2026",
                  value: "≈ 7,0 M€",
                  sourceLabel: "ROB 2026",
                  note: "Dette toujours autour de 7 M€.",
                },
              ],
            },
            {
              label: "Projet visible",
              values: [
                {
                  yearLabel: "2024",
                  value: "Exécution close",
                  sourceLabel: "CFU 2024",
                  note: "Référence.",
                },
                {
                  yearLabel: "2025",
                  value: "Bâtiments publics · 1,95 M€",
                  sourceLabel: "BP 2025",
                  note: "Le plus gros poste d'investissement lisible.",
                },
                {
                  yearLabel: "2026",
                  value: "Programmation à relire",
                  sourceLabel: "ROB 2026",
                  note: "À relire.",
                },
              ],
            },
          ],
          strategicReadings: [
            {
              title: "Récit politique 2026",
              summary: "Le ROB sert à lire les priorités affichées et les arbitrages annoncés.",
              tone: "accent",
            },
            {
              title: "Exécution réelle 2024",
              summary: "Le CFU permet de vérifier ce qui a vraiment été exécuté.",
              tone: "pine",
            },
          ],
          themeReadings: [],
          documents: [
            {
              slug: "rob-2026",
              documentType: "rapport_orientation_budgetaire",
              yearLabel: "2026",
              sourcePdf: "data/20260216_Rapport-dorientations-budgetaires-2026.pdf",
              pages: 40,
              hasExtractableText: true,
              ocrNeeded: false,
              sectionCount: 14,
              amountLineCount: 124,
              strongestAmount: 16545731,
            },
            {
              slug: "bp-2025",
              documentType: "budget_primitif",
              yearLabel: "2025",
              sourcePdf: "data/AF04-BUDGET-2025-32000-PRINCIPAL-SIGNE.pdf",
              pages: 52,
              hasExtractableText: true,
              ocrNeeded: false,
              sectionCount: 18,
              amountLineCount: 221,
              strongestAmount: 1950000,
            },
          ],
          topAmounts: [],
          sections: [],
          municipalDocuments: [
            {
              label: "Rapport d orientations budgetaires 2026",
              href: "https://ville-cabestany.fr/wp-content/uploads/2026/03/rapport-orientations-budgetaires-2026.pdf",
              note: "2026 · Document mairie classé budget, utile pour relire les arbitrages et pièces financières.",
              category: "budget",
              year: "2026",
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Budget" })).toBeInTheDocument();
    expect(screen.getByText("Ce qu'il faut retenir")).toBeInTheDocument();
    expect(screen.getByText("Récit politique 2026")).toBeInTheDocument();
    expect(screen.getByText(/impact: fixe le récit politique/i)).toBeInTheDocument();
    expect(screen.getByText("Comparaison 2024 / 2025 / 2026")).toBeInTheDocument();
    expect(screen.getByText("Budget total")).toBeInTheDocument();
    expect(screen.getAllByText("À surveiller").length).toBeGreaterThan(0);
    expect(screen.getByText("Dette / encours")).toBeInTheDocument();
    expect(screen.getAllByText("Point sensible").length).toBeGreaterThan(0);
    expect(screen.getByText("Pieces budgetaires a rouvrir")).toBeInTheDocument();
    expect(screen.getByText(/à ouvrir pour lire les arbitrages annoncés/i)).toBeInTheDocument();
    expect(screen.getAllByRole("link", { name: "Ouvrir" })[0]).toHaveAttribute(
      "href",
      "/api/documents?path=data%2F20260216_Rapport-dorientations-budgetaires-2026.pdf",
    );
    expect(screen.getAllByRole("link", { name: "Télécharger" }).length).toBeGreaterThan(0);
    expect(screen.getByText("Sources mairie détectées")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Ouvrir la source mairie" })).toHaveAttribute(
      "href",
      "https://ville-cabestany.fr/wp-content/uploads/2026/03/rapport-orientations-budgetaires-2026.pdf",
    );
  });
});
