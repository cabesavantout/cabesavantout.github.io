import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => "/meetings",
}));

vi.mock("@/app/(app)/actions", () => ({
  logout: vi.fn(),
}));

import { AppShell } from "@/components/app-shell";

describe("AppShell", () => {
  it("affiche une navigation produit simplifiée sans topbar", () => {
    render(
      <AppShell
        authMode="local"
        permissions={[
          "tasks.read",
          "field_reports.read",
          "contacts.read",
          "users.read",
          "budget.read",
          "meetings.read",
        ]}
        userEmail="cabestanyavanttout@gmail.com"
        userRole="superadmin"
      >
        <div>Contenu principal</div>
      </AppShell>,
    );

    expect(screen.getByText(/cabestany avant tout/i)).toBeInTheDocument();
    expect(screen.getAllByText(/^vue d'ensemble$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^engagements$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^elections$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^territoire$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^administration$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByRole("link", { name: /reunions/i })[0]).toHaveAttribute(
      "href",
      "/meetings",
    );
    expect(screen.getAllByRole("link", { name: /^plan d'action$/i })[0]).toHaveAttribute("href", "/tasks");
    expect(screen.getAllByText("cabestanyavanttout@gmail.com").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText(/role superadmin/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fermer la session/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /replier engagements/i })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ouvrir administration/i }));
    expect(screen.getAllByRole("link", { name: /^campagne$/i })[0]).toHaveAttribute("href", "/campaign");
    expect(screen.getAllByRole("link", { name: /^reseaux sociaux$/i })[0]).toHaveAttribute("href", "/social-media");
    expect(screen.getByText("Contenu principal")).toBeInTheDocument();
  });

  it("garde un shell simple si seules les routes de base sont accessibles", () => {
    render(
      <AppShell authMode="supabase" permissions={[]} userEmail={null}>
        <div>Vue simple</div>
      </AppShell>,
    );

    expect(screen.getAllByText(/^vue d'ensemble$/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/^territoire$/i).length).toBeGreaterThan(0);
    expect(screen.queryAllByText(/^engagements$/i)).toHaveLength(0);
    expect(screen.queryAllByText(/^elections$/i)).toHaveLength(0);
    expect(screen.getAllByText(/^administration$/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/utilisateur connecte/i)).toBeInTheDocument();
    expect(screen.getByText(/connexion securisee/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /se deconnecter/i })).toBeInTheDocument();
  });
});
