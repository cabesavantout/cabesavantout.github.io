import { fireEvent, render, screen } from "@testing-library/react";
import SiteHeader from "./SiteHeader";

describe("SiteHeader", () => {
  it("renders the site branding and main navigation labels", () => {
    render(<SiteHeader />);

    expect(
      screen.getByRole("link", { name: /cabestany avant tout/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Programme" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "L'équipe" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Événements" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Contact" })).toBeInTheDocument();
  });

  it("opens the mobile menu and scrolls to the requested section", () => {
    const scrollIntoView = vi.fn();
    const querySelectorSpy = vi
      .spyOn(document, "querySelector")
      .mockReturnValue({ scrollIntoView } as unknown as Element);

    render(<SiteHeader />);

    fireEvent.click(screen.getByRole("button", { name: /menu/i }));
    fireEvent.click(screen.getAllByRole("button", { name: "Contact" })[1]);

    expect(querySelectorSpy).toHaveBeenCalledWith("#contact");
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: "smooth" });

    querySelectorSpy.mockRestore();
  });
});
