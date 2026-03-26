import React from "react";
import { render, screen } from "@testing-library/react";

import { DashboardPage } from "@/components/dashboard-page";

describe("DashboardPage", () => {
  it("affiche les blocs principaux du tableau de bord", () => {
    render(
      <DashboardPage
        data={{
          stats: [
            { label: "Retours ouverts", value: "12", tone: "accent" },
            { label: "Tâches ouvertes", value: "8", tone: "default" },
          ],
          actionItems: [
            {
              label: "Voir les retours urgents",
              summary: "Traiter les signaux les plus sensibles.",
              href: "/field-reports",
              tone: "accent",
            },
          ],
          priorityHighlights: [
            {
              label: "Urgences terrain",
              summary: "3 retours prioritaires à qualifier.",
              value: "3",
              tone: "accent",
            },
          ],
          sectorAlerts: [
            {
              sectorLabel: "Bureau 0003",
              ownerName: null,
              priorityScore: 7,
              reportCount: 4,
              urgentCount: 2,
            },
          ],
          upcomingMeetings: [
            {
              title: "Point équipe",
              startsAtLabel: "2026-03-26 18:00",
              location: "Local",
            },
          ],
          recentActivity: [
            {
              kind: "field_report",
              title: "Retour stationnement",
              summary: "Signalement au centre-ville",
              happenedAtLabel: "2026-03-25 10:00",
            },
          ],
          teamHighlights: [
            {
              label: "Responsables actifs",
              value: "5",
              summary: "Référents actuellement mobilisés.",
            },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /tableau de bord général/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Retours ouverts")).toBeInTheDocument();
    expect(screen.getByText("Voir les retours urgents")).toBeInTheDocument();
    expect(screen.getByText("Bureau 0003")).toBeInTheDocument();
    expect(screen.getByText("Point équipe")).toBeInTheDocument();
    expect(screen.getByText("Retour stationnement")).toBeInTheDocument();
    expect(screen.getByText("Responsables actifs")).toBeInTheDocument();
  });

  it("affiche les états vides quand il n'y a rien à surveiller", () => {
    render(
      <DashboardPage
        data={{
          stats: [],
          actionItems: [],
          priorityHighlights: [],
          sectorAlerts: [],
          upcomingMeetings: [],
          recentActivity: [],
          teamHighlights: [],
        }}
      />,
    );

    expect(
      screen.getByText(/aucun secteur ne remonte comme prioritaire/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/aucune réunion planifiée sur les sept prochains jours/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/aucune activité récente à afficher/i),
    ).toBeInTheDocument();
  });
});
