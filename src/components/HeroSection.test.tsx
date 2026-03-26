import { render, screen } from "@testing-library/react";
import HeroSection from "./HeroSection";

describe("HeroSection", () => {
  it("renders the main campaign messaging and CTAs", () => {
    render(<HeroSection />);

    expect(screen.getByText("Élections Municipales 2026")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /agir ensemble pour cabestany/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /notre programme/i }),
    ).toHaveAttribute("href", "#programme");
    expect(
      screen.getByRole("link", { name: /nous contacter/i }),
    ).toHaveAttribute("href", "#contact");
  });

  it("shows the key figures and candidate card", () => {
    render(<HeroSection />);

    expect(screen.getByText("33")).toBeInTheDocument();
    expect(screen.getByText("Colistiers engagés")).toBeInTheDocument();
    expect(screen.getByText("7")).toBeInTheDocument();
    expect(screen.getByText("Thèmes du programme")).toBeInTheDocument();
    expect(screen.getByText("15 & 22")).toBeInTheDocument();
    expect(screen.getByText("Mars 2026")).toBeInTheDocument();
    expect(
      screen.getByAltText(/éric poupet, tête de liste cabestany avant tout/i),
    ).toBeInTheDocument();
  });
});
