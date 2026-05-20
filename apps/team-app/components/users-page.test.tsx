import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/users/actions", () => ({
  createUser: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  updateUserAccess: vi.fn(),
  updateUserPermissions: vi.fn(),
}));

import { UsersPage } from "@/components/users-page";

const baseProps = {
  currentUserEmail: "cabestanyavanttout@gmail.com",
  orgFunctions: [{ id: "f1", code: "dir-campagne", label: "Directeur de campagne" }],
  permissions: [
    { id: "p1", code: "users.read", label: "Lire les utilisateurs", module: "users" },
    { id: "p2", code: "users.manage", label: "Gerer les utilisateurs", module: "users" },
    { id: "p3", code: "crm.read", label: "Lire le CRM", module: "crm" },
  ],
  users: [
    {
      id: "u1",
      email: "cabestanyavanttout@gmail.com",
      fullName: "Superadmin",
      role: "superadmin",
      isActive: true,
      orgFunctionId: "f1",
      orgFunctionLabel: "Directeur de campagne",
      passwordUpdatedAt: "2026-03-25 19:00",
      directPermissionIds: ["p1"],
      effectivePermissionCodes: ["users.read", "users.manage", "crm.read"],
    },
    {
      id: "u2",
      email: "lecture@example.com",
      fullName: "Lecteur",
      role: "lecture",
      isActive: false,
      orgFunctionId: null,
      orgFunctionLabel: null,
      passwordUpdatedAt: null,
      directPermissionIds: [],
      effectivePermissionCodes: [],
    },
  ],
};

describe("UsersPage", () => {
  it("affiche une liste compacte, des filtres simples et l'ajout d'utilisateur", () => {
    render(<UsersPage {...baseProps} canManageUsers />);

    expect(screen.getByText("Utilisateurs")).toBeInTheDocument();
    expect(screen.getByText("Liste des utilisateurs")).toBeInTheDocument();
    expect(screen.getByText("Superadmin")).toBeInTheDocument();
    expect(screen.getByText("cabestanyavanttout@gmail.com")).toBeInTheDocument();
    expect(screen.getAllByText("Directeur de campagne").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Admin").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("Actif")).toBeInTheDocument();
    expect(screen.getByText("Permissions: Admin · users, crm")).toBeInTheDocument();
    expect(screen.getByText("Ajouter utilisateur")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Tous" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Actifs" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Désactivés" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Admins" })).toBeInTheDocument();
  });

  it("ouvre un drawer avec infos, sécurité, permissions et actions sensibles", () => {
    render(<UsersPage {...baseProps} canManageUsers />);

    fireEvent.click(screen.getAllByRole("button", { name: "Gérer" })[0]);

    expect(screen.getByText("Infos utilisateur")).toBeInTheDocument();
    expect(screen.getByText("Sécurité")).toBeInTheDocument();
    expect(screen.getByText("Permissions")).toBeInTheDocument();
    expect(screen.getByText("Actions sensibles")).toBeInTheDocument();
    expect(screen.getByText("Dernière mise à jour du mot de passe: 2026-03-25 19:00")).toBeInTheDocument();
    expect(screen.getByText("Modules: users, crm")).toBeInTheDocument();
  });

  it("applique le filtre admins", () => {
    render(<UsersPage {...baseProps} canManageUsers />);

    fireEvent.click(screen.getByRole("button", { name: "Admins" }));

    expect(screen.getByText("Superadmin")).toBeInTheDocument();
    expect(screen.queryByText("Lecteur")).not.toBeInTheDocument();
  });

  it("masque l'ajout et les actions sensibles quand la gestion est interdite", () => {
    render(<UsersPage {...baseProps} canManageUsers={false} />);

    expect(screen.queryByText("Ajouter utilisateur")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Modifier rôle" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Désactiver" })).not.toBeInTheDocument();

    fireEvent.click(screen.getAllByRole("button", { name: "Gérer" })[0]);

    expect(screen.getByText("Infos utilisateur")).toBeInTheDocument();
    expect(screen.getByText("Sécurité")).toBeInTheDocument();
    expect(screen.getByText("Permissions")).toBeInTheDocument();
    expect(screen.queryByText("Actions sensibles")).not.toBeInTheDocument();
  });
});
