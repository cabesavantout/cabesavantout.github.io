import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { DocumentsPage } from "@/components/documents-page";

describe("DocumentsPage", () => {
  it("affiche les documents mairie filtrables", () => {
    render(
      <DocumentsPage
        data={{
          stats: [
            { label: "Documents repérés", value: "12" },
            { label: "PDF détectés", value: "9", tone: "accent" },
            { label: "Archives locales", value: "6", tone: "pine" },
          ],
          documents: [
            {
              label: "Rapport d orientations budgetaires 2026",
              href: "https://ville-cabestany.fr/wp-content/uploads/2026/03/rapport-orientations-budgetaires-2026.pdf",
              kind: "pdf",
              category: "budget",
              confidence: "high",
              year: "2026",
              note: "2026 · Document mairie classé budget, utile pour relire les arbitrages et pièces financières.",
              sourceOrigin: "mairie_site",
              sessionDate: "2026-03-11",
            },
            {
              label: "Proces verbal conseil municipal 2025",
              href: "https://ville-cabestany.fr/wp-content/uploads/2025/02/proces-verbal-conseil-municipal.pdf",
              kind: "pdf",
              category: "proces_verbal",
              confidence: "high",
              year: "2025",
              note: "2025 · Procès-verbal ou compte rendu municipal, utile pour vérifier ce qui a été acté.",
              sourceOrigin: "local_archive",
              sessionDate: "2025-02-04",
            },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "Actes municipaux" })).toBeInTheDocument();
    expect(screen.getByText("Documents repérés")).toBeInTheDocument();
    expect(screen.getByText("Pieces a rouvrir d'abord")).toBeInTheDocument();
    expect(screen.getByText("Archive filtrable")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Budget" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Toutes années" })).toBeInTheDocument();
    expect(screen.getByText("2 documents visibles.")).toBeInTheDocument();
    expect(screen.getAllByText(/rapport d orientations budgetaires 2026/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: "Ouvrir" })[0]).toHaveAttribute(
      "href",
      "https://ville-cabestany.fr/wp-content/uploads/2026/03/rapport-orientations-budgetaires-2026.pdf",
    );

    fireEvent.click(screen.getByRole("button", { name: "2025" }));

    expect(screen.getByText("1 document visible en 2025.")).toBeInTheDocument();
    expect(screen.getAllByText(/proces verbal conseil municipal 2025/i).length).toBeGreaterThan(0);
  });
});
