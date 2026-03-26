import React from "react";
import { render, screen } from "@testing-library/react";
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

vi.mock("@/app/(app)/actions", () => ({
  logout: vi.fn(),
}));

import { AppShell } from "@/components/app-shell";

describe("AppShell", () => {
  it("affiche la navigation selon les permissions utiles", () => {
    render(
      <AppShell
        authMode="local"
        permissions={["tasks.read", "field_reports.read", "contacts.read", "users.read"]}
        userEmail="cabestanyavanttout@gmail.com"
        userRole="superadmin"
      >
        <div>Contenu principal</div>
      </AppShell>,
    );

    expect(screen.getByText(/espace équipe/i)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /dashboard/i })).toHaveAttribute(
      "href",
      "/dashboard",
    );
    expect(screen.getByRole("link", { name: /recherche/i })).toHaveAttribute(
      "href",
      "/search",
    );
    expect(screen.getByRole("link", { name: /tâches/i })).toHaveAttribute(
      "href",
      "/tasks",
    );
    expect(screen.getByRole("link", { name: /^terrain$/i })).toHaveAttribute(
      "href",
      "/field-reports",
    );
    expect(screen.getByRole("link", { name: /contacts/i })).toHaveAttribute(
      "href",
      "/contacts",
    );
    expect(screen.getByRole("link", { name: /utilisateurs/i })).toHaveAttribute(
      "href",
      "/users",
    );
    expect(screen.queryByRole("link", { name: /insee/i })).not.toBeInTheDocument();
    expect(screen.getByText("cabestanyavanttout@gmail.com")).toBeInTheDocument();
    expect(screen.getByText(/rôle superadmin/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /fermer la session/i })).toBeInTheDocument();
    expect(screen.getByText("Contenu principal")).toBeInTheDocument();
  });

  it("affiche le libellé Supabase et limite le menu sans permissions", () => {
    render(
      <AppShell authMode="supabase" permissions={[]} userEmail={null}>
        <div>Vue simple</div>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /bureaux/i })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /recherche/i })).not.toBeInTheDocument();
    expect(screen.getByText(/utilisateur connecté/i)).toBeInTheDocument();
    expect(screen.getByText(/supabase auth/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /se déconnecter/i })).toBeInTheDocument();
  });
});
