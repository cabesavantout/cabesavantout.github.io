import React from "react";
import { render, screen } from "@testing-library/react";
import { vi } from "vitest";

vi.mock("@/app/(app)/users/actions", () => ({
  createUser: vi.fn(),
  deleteUser: vi.fn(),
  resetUserPassword: vi.fn(),
  updateUserAccess: vi.fn(),
  updateUserPermissions: vi.fn(),
}));

import { UsersPage } from "@/components/users-page";

describe("UsersPage", () => {
  it("affiche les utilisateurs, les stats et le panneau d'ajout", () => {
    render(
      <UsersPage
        currentUserEmail="cabestanyavanttout@gmail.com"
        canManageUsers
        orgFunctions={[{ id: "f1", code: "dir-campagne", label: "Directeur de campagne" }]}
        permissions={[
          { id: "p1", code: "users.read", label: "Lire les utilisateurs", module: "users" },
        ]}
        users={[
          {
            id: "u1",
            email: "cabestanyavanttout@gmail.com",
            fullName: "Superadmin",
            role: "superadmin",
            isActive: true,
            orgFunctionId: "f1",
            orgFunctionLabel: "Directeur de campagne",
            passwordUpdatedAt: "2026-03-25 19:00",
            directPermissionIds: [],
            effectivePermissionCodes: ["users.read", "users.manage"],
          },
        ]}
      />,
    );

    expect(
      screen.getByRole("heading", { name: /^Utilisateurs$/i, level: 2 }),
    ).toBeInTheDocument();
    expect(screen.getByText("Comptes total")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /^Superadmin$/i, level: 3 }),
    ).toBeInTheDocument();
    expect(screen.getByText("cabestanyavanttout@gmail.com")).toBeInTheDocument();
    expect(
      screen.getAllByText("Directeur de campagne").length,
    ).toBeGreaterThanOrEqual(1);
    expect(
      screen.getByRole("heading", { name: /^Ajouter un utilisateur$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("users.manage")).toBeInTheDocument();
  });

  it("masque l'ajout si l'utilisateur ne peut pas gérer les comptes", () => {
    render(
      <UsersPage
        currentUserEmail="lecture@example.com"
        canManageUsers={false}
        orgFunctions={[]}
        permissions={[]}
        users={[
          {
            id: "u1",
            email: "lecture@example.com",
            fullName: "Lecteur",
            role: "lecture",
            isActive: true,
            orgFunctionId: null,
            orgFunctionLabel: null,
            passwordUpdatedAt: null,
            directPermissionIds: [],
            effectivePermissionCodes: [],
          },
        ]}
      />,
    );

    expect(screen.queryByText(/ajouter un utilisateur/i)).not.toBeInTheDocument();
    expect(screen.getByText("Lecteur")).toBeInTheDocument();
  });
});
