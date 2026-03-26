import React from "react";
import { render, screen } from "@testing-library/react";

import { InseePage } from "@/components/insee-page";

describe("InseePage", () => {
  it("affiche les repères INSEE principaux", () => {
    render(
      <InseePage
        data={{
          headline: [
            {
              label: "Population municipale",
              value: "10 245",
              summary: "Dernière population municipale disponible.",
            },
            {
              label: "65 ans ou plus",
              value: "2 410",
              summary: "Poids électoral des seniors.",
            },
            {
              label: "Inscrits 2026",
              value: "8 734",
              summary: "Repère de mobilisation.",
            },
          ],
          ageBreakdown: [
            { label: "0-14 ans", count: "1 520", share: "14,8 %" },
            { label: "65 ans ou plus", count: "2 410", share: "23,5 %" },
          ],
          housingHighlights: [
            { label: "Résidences principales", value: "4 320" },
            { label: "Propriétaires", value: "62 %" },
          ],
        }}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /repères insee/i }),
    ).toBeInTheDocument();
    expect(screen.getAllByText("Population municipale").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("10 245").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("0-14 ans")).toBeInTheDocument();
    expect(screen.getAllByText("65 ans ou plus").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Résidences principales")).toBeInTheDocument();
    expect(screen.getByText("4 320")).toBeInTheDocument();
  });
});
