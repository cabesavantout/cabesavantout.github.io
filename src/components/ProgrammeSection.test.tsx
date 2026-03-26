import { fireEvent, render, screen } from "@testing-library/react";
import ProgrammeSection from "./ProgrammeSection";

describe("ProgrammeSection", () => {
  it("renders the main programme section and document links", () => {
    render(<ProgrammeSection />);

    expect(
      screen.getByRole("heading", { name: /notre programme/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/un projet ambitieux, solide et original/i)).toBeInTheDocument();
    expect(screen.getByText(/profession de foi/i)).toBeInTheDocument();
    expect(screen.getByText(/bulletin de vote/i)).toBeInTheDocument();
  });

  it("opens the Colomines focus modal from the Urbanisme card", () => {
    render(<ProgrammeSection />);

    fireEvent.click(
      screen.getByRole("button", {
        name: /projet d'écolodges aux colomines/i,
      }),
    );

    expect(
      screen.getByRole("heading", {
        name: /les colomines : l'alternative durable pour cabestany/i,
      }),
    ).toBeInTheDocument();
  });

  it("opens the Marché focus modal from the Culture card", () => {
    render(<ProgrammeSection />);

    fireEvent.click(
      screen.getByRole("button", { name: /marché catalan transfrontalier/i }),
    );

    expect(
      screen.getByRole("heading", {
        name: /marché catalan transfrontalier : un événement phare pour cabestany/i,
      }),
    ).toBeInTheDocument();
  });

  it("opens the Pépinière focus modal from the Agriculture card", () => {
    render(<ProgrammeSection />);

    fireEvent.click(
      screen.getByRole("button", { name: /créer une pépinière pédagogique/i }),
    );

    expect(
      screen.getByRole("heading", {
        name: /la pépinière pédagogique : faire grandir demain/i,
      }),
    ).toBeInTheDocument();
  });
});
