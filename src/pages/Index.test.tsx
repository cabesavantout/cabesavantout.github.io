import { render, screen } from "@testing-library/react";
import Index from "./Index";

describe("Index page", () => {
  it("renders the main public site sections", () => {
    render(<Index />);

    expect(
      screen.getByRole("heading", { name: /agir ensemble pour cabestany/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /notre programme/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /contactez-nous/i }),
    ).toBeInTheDocument();
  });
});
