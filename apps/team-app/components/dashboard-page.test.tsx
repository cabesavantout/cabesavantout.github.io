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
          municipalCouncilPublication: {
            title: "Conseil municipal d’installation",
            startsAtLabel: "27/03 18:30",
            location: "Centre culturel Jean Ferrat",
            isUpcoming: false,
          },
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
      screen.getByRole("heading", { name: /^dashboard$/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /ce qu'il faut faire maintenant/i })).toBeInTheDocument();
    expect(screen.getByText("3 urgences terrain ouvertes")).toBeInTheDocument();
    expect(screen.getByText("Urgences terrain")).toBeInTheDocument();
    expect(screen.getAllByText("Bureau 0003").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Point équipe")).toBeInTheDocument();
    expect(screen.getByText(/dernier conseil publié/i)).toBeInTheDocument();
    expect(screen.getByText(/actions secondaires/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /voir les promesses/i })).toHaveAttribute("href", "/mandate");
    expect(screen.getByRole("link", { name: /ouvrir la carte/i })).toHaveAttribute("href", "/polling-stations");
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
          municipalCouncilPublication: null,
          recentActivity: [],
          teamHighlights: [],
        }}
      />,
    );

    expect(screen.getByText(/aucun secteur prioritaire/i)).toBeInTheDocument();
    expect(screen.getByText(/aucune décision urgente/i)).toBeInTheDocument();
    expect(screen.getByText(/aucun signal consolidé/i)).toBeInTheDocument();
  });
});
