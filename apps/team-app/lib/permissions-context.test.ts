import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  redirectMock,
  queryMock,
  getLocalAuthUserFromSessionMock,
  isSuperadminMock,
} = vi.hoisted(() => ({
  redirectMock: vi.fn(() => {
    throw new Error("NEXT_REDIRECT");
  }),
  queryMock: vi.fn(),
  getLocalAuthUserFromSessionMock: vi.fn(),
  isSuperadminMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: redirectMock,
}));

vi.mock("@/lib/postgres", () => ({
  getPool: () => ({
    query: queryMock,
  }),
}));

vi.mock("@/lib/local-auth", () => ({
  getLocalAuthUserFromSession: getLocalAuthUserFromSessionMock,
  isSuperadmin: isSuperadminMock,
}));

import {
  getCurrentAccessContext,
  getPermissionsForUser,
  requirePermission,
} from "@/lib/permissions";

describe("permission access context", () => {
  beforeEach(() => {
    queryMock.mockReset();
    redirectMock.mockClear();
    getLocalAuthUserFromSessionMock.mockReset();
    isSuperadminMock.mockReset();
  });

  it("retourne les permissions récupérées pour un utilisateur", async () => {
    queryMock.mockResolvedValue({
      rows: [
        { code: "tasks.read" },
        { code: "tasks.read" },
        { code: "field_reports.read" },
      ],
    });

    await expect(getPermissionsForUser("user-1")).resolves.toEqual([
      "tasks.read",
      "tasks.read",
      "field_reports.read",
    ]);
    expect(queryMock).toHaveBeenCalledTimes(1);
  });

  it("retourne un contexte vide si aucun utilisateur n'est connecté", async () => {
    getLocalAuthUserFromSessionMock.mockResolvedValue(null);

    await expect(getCurrentAccessContext()).resolves.toEqual({
      user: null,
      permissions: [],
    });
  });

  it("donne toutes les permissions à un superadmin", async () => {
    const user = {
      id: "user-1",
      email: "cabestanyavanttout@gmail.com",
      fullName: "Superadmin",
      role: "superadmin",
    };

    getLocalAuthUserFromSessionMock.mockResolvedValue(user);
    isSuperadminMock.mockReturnValue(true);

    await expect(getCurrentAccessContext()).resolves.toEqual({
      user,
      permissions: ["*"],
    });
    expect(queryMock).not.toHaveBeenCalled();
  });

  it("charge les permissions d'un utilisateur standard", async () => {
    const user = {
      id: "user-2",
      email: "coord@example.com",
      fullName: "Coordination",
      role: "coordinateur",
    };

    getLocalAuthUserFromSessionMock.mockResolvedValue(user);
    isSuperadminMock.mockReturnValue(false);
    queryMock.mockResolvedValue({
      rows: [{ code: "tasks.read" }, { code: "meetings.read" }],
    });

    await expect(getCurrentAccessContext()).resolves.toEqual({
      user,
      permissions: ["tasks.read", "meetings.read"],
    });
  });

  it("redirige si la permission requise est absente", async () => {
    getLocalAuthUserFromSessionMock.mockResolvedValue({
      id: "user-3",
      email: "militant@example.com",
      fullName: "Militant",
      role: "militant",
    });
    isSuperadminMock.mockReturnValue(false);
    queryMock.mockResolvedValue({
      rows: [{ code: "field_reports.read" }],
    });

    await expect(requirePermission("users.manage")).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(redirectMock).toHaveBeenCalledWith("/dashboard");
  });

  it("redirige aussi si aucun utilisateur n'est connecté", async () => {
    getLocalAuthUserFromSessionMock.mockResolvedValue(null);

    await expect(requirePermission("tasks.read")).rejects.toThrow(
      "NEXT_REDIRECT",
    );
    expect(redirectMock).toHaveBeenCalledWith("/dashboard");
  });

  it("retourne le contexte si la permission requise est présente", async () => {
    const user = {
      id: "user-4",
      email: "admin@example.com",
      fullName: "Admin",
      role: "admin",
    };

    getLocalAuthUserFromSessionMock.mockResolvedValue(user);
    isSuperadminMock.mockReturnValue(false);
    queryMock.mockResolvedValue({
      rows: [{ code: "users.manage" }, { code: "users.read" }],
    });

    await expect(requirePermission("users.manage")).resolves.toEqual({
      user,
      permissions: ["users.manage", "users.read"],
    });
    expect(redirectMock).not.toHaveBeenCalled();
  });
});
