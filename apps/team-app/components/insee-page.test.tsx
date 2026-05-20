import React from "react";
import { render, screen } from "@testing-library/react";

import { InseePage } from "@/components/insee-page";

describe("InseePage", () => {
  it("affiche les chiffres utiles, les âges et la répartition socio-professionnelle", () => {
    render(
      <InseePage
        data={{
          headline: [
            {
              label: "Population 2022",
              value: "10 245",
              summary: "Population municipale totale issue du tableau POP_T0.",
            },
            {
              label: "Inscrits municipales 2026",
              value: "8 734",
              summary: "Référence REU utile pour comparer terrain, participation et cible électorale.",
            },
            {
              label: "Logements",
              value: "4 974",
              summary: "Taille du parc résidentiel pour lire l'ancrage et la densité d'occupation.",
            },
            {
              label: "65 ans ou plus",
              value: "3 177",
              summary: "Volume utile pour calibrer messages, services et présence de proximité.",
            },
          ],
          ageBreakdown: [
            { label: "0 à 14 ans", count: "1 520", share: "14,8 %" },
            { label: "15 à 29 ans", count: "1 640", share: "16,0 %" },
            { label: "30 à 44 ans", count: "1 880", share: "18,3 %" },
            { label: "45 à 59 ans", count: "1 950", share: "19,0 %" },
            { label: "60 à 74 ans", count: "1 620", share: "15,8 %" },
            { label: "75 ans ou plus", count: "790", share: "7,7 %" },
          ],
          housingHighlights: [
            { label: "Ménages", value: "4 320" },
            { label: "Résidences principales", value: "4 050" },
            { label: "Logements vacants", value: "123" },
            { label: "Maisons dans le parc", value: "62,0 %" },
          ],
          socioProfessionalBreakdown: [
            { label: "artisans, commerçants, chefs d'entreprise", count: "397", share: "9,4 %" },
            { label: "cadres et professions intellectuelles supérieures", count: "703", share: "16,7 %" },
            { label: "professions intermédiaires", count: "1 169", share: "27,8 %" },
            { label: "employés", count: "1 187", share: "28,2 %" },
            { label: "ouvriers", count: "698", share: "16,6 %" },
          ],
        }}
      />,
    );

    expect(screen.getByRole("heading", { name: "INSEE" })).toBeInTheDocument();
    expect(screen.getByText("Repères clés")).toBeInTheDocument();
    expect(screen.getByText("Habitants")).toBeInTheDocument();
    expect(screen.getByText("Logements")).toBeInTheDocument();
    expect(screen.getByText("Répartition par âge")).toBeInTheDocument();
    expect(screen.getByText("0 à 14 ans")).toBeInTheDocument();
    expect(screen.getByText("Répartition socio-professionnelle")).toBeInTheDocument();
    expect(screen.getByText("professions intermédiaires")).toBeInTheDocument();
    expect(screen.getAllByText(/lecture utile/i)).toHaveLength(2);
    expect(screen.getByText("Habitat")).toBeInTheDocument();
    expect(screen.getAllByText("Résidences principales")).toHaveLength(2);
    expect(screen.getByText("Logements vacants")).toBeInTheDocument();
    expect(screen.getAllByText("Maisons dans le parc")).toHaveLength(2);
    expect(screen.getByText("Compléments utiles")).toBeInTheDocument();
    expect(screen.getByText("65 ans ou plus")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Voir la carte" })).toHaveAttribute("href", "/polling-stations");
    expect(screen.getByRole("link", { name: "Voir les retours terrain" })).toHaveAttribute("href", "/field-reports");
    expect(screen.getByRole("link", { name: "Voir les élections" })).toHaveAttribute("href", "/elections");
    expect(screen.getByRole("link", { name: "Ouvrir INSEE" })).toHaveAttribute(
      "href",
      "https://www.insee.fr/fr/statistiques/2011101?geo=COM-66028",
    );
    expect(screen.getByRole("link", { name: "Ouvrir BANATIC" })).toHaveAttribute(
      "href",
      "https://www.banatic.interieur.gouv.fr/commune/66028-cabestany",
    );
  });

  it("reste lisible quand les blocs principaux sont incomplets", () => {
    render(
      <InseePage
        data={{
          headline: [
            {
              label: "Population 2022",
              value: "10 245",
              summary: "Population municipale totale issue du tableau POP_T0.",
            },
            {
              label: "Inscrits municipales 2026",
              value: "N/A",
              summary: "Référence REU utile pour comparer terrain, participation et cible électorale.",
            },
            {
              label: "Logements",
              value: "N/A",
              summary: "Taille du parc résidentiel pour lire l'ancrage et la densité d'occupation.",
            },
            {
              label: "65 ans ou plus",
              value: "N/A",
              summary: "Volume utile pour calibrer messages, services et présence de proximité.",
            },
          ],
          ageBreakdown: [],
          housingHighlights: [
            { label: "Ménages", value: "N/A" },
            { label: "Résidences principales", value: "N/A" },
            { label: "Logements vacants", value: "N/A" },
            { label: "Maisons dans le parc", value: "N/A" },
          ],
          socioProfessionalBreakdown: [],
        }}
      />,
    );

    expect(screen.getByText("Repères clés")).toBeInTheDocument();
    expect(screen.getByText("10 245")).toBeInTheDocument();
    expect(screen.getByText("Répartition par âge")).toBeInTheDocument();
    expect(screen.getByText("Âges indisponibles")).toBeInTheDocument();
    expect(screen.getByText("Répartition socio-professionnelle")).toBeInTheDocument();
    expect(screen.getByText("Répartition indisponible")).toBeInTheDocument();
    expect(screen.getByText("Habitat indisponible")).toBeInTheDocument();
    expect(screen.getByText("Compléments indisponibles")).toBeInTheDocument();
    expect(screen.queryByText(/N\/A inscrits/i)).not.toBeInTheDocument();
  });
});
