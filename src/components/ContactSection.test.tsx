import { render, screen } from "@testing-library/react";
import ContactSection from "./ContactSection";

describe("ContactSection", () => {
  it("renders the contact section header", () => {
    render(<ContactSection />);

    expect(
      screen.getByRole("heading", { name: /contactez-nous/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/vous avez une question, une suggestion/i),
    ).toBeInTheDocument();
  });

  it("renders the expected contact links", () => {
    render(<ContactSection />);

    expect(screen.getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      "mailto:cabesavantout@yahoo.com",
    );
    expect(screen.getByRole("link", { name: /téléphone/i })).toHaveAttribute(
      "href",
      "tel:+33688994860",
    );
    expect(screen.getByRole("link", { name: /facebook/i })).toHaveAttribute(
      "href",
      "https://www.facebook.com/cabesavantout",
    );
    expect(screen.getByRole("link", { name: /instagram/i })).toHaveAttribute(
      "href",
      "https://www.instagram.com/cabestany_avant_tout/",
    );
  });
});
