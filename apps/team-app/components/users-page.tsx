"use client";

import { useMemo, useState } from "react";
import { Badge, Button, Drawer, FilterChip, Notice, PageHeader, Panel } from "@/components/ui";
import {
  createUser,
  deleteUser,
  resetUserPassword,
  updateUserAccess,
  updateUserPermissions,
} from "@/app/(app)/users/actions";

type OrgFunctionOption = {
  id: string;
  code: string;
  label: string;
};

type UserRow = {
  id: string;
  email: string;
  fullName: string;
  role: string;
  isActive: boolean;
  orgFunctionId: string | null;
  orgFunctionLabel: string | null;
  passwordUpdatedAt: string | null;
  directPermissionIds: string[];
  effectivePermissionCodes: string[];
};

type PermissionOption = {
  id: string;
  code: string;
  label: string;
  module: string;
};

type UserFilter = "all" | "active" | "disabled" | "admins";

const roles = [
  { value: "superadmin", label: "Admin" },
  { value: "admin", label: "Admin" },
  { value: "direction", label: "Manager" },
  { value: "coordinateur", label: "Manager" },
  { value: "militant", label: "Utilisateur" },
  { value: "lecture", label: "Lecture" },
];

function getRoleDisplay(role: string) {
  return roles.find((item) => item.value === role)?.label ?? role;
}

function getRoleTone(role: string) {
  if (role === "superadmin" || role === "admin") return "accent" as const;
  if (role === "direction" || role === "coordinateur") return "pine" as const;
  if (role === "lecture") return "neutral" as const;
  return "warning" as const;
}

function matchesFilter(user: UserRow, filter: UserFilter) {
  switch (filter) {
    case "active":
      return user.isActive;
    case "disabled":
      return !user.isActive;
    case "admins":
      return user.role === "superadmin" || user.role === "admin";
    default:
      return true;
  }
}

function summarizePermissions(user: UserRow) {
  const modules = Array.from(
    new Set(user.effectivePermissionCodes.map((code) => code.split(".")[0]).filter(Boolean)),
  );

  let level = "Read";
  if (user.role === "superadmin" || user.role === "admin") {
    level = "Admin";
  } else if (user.effectivePermissionCodes.some((code) => code.endsWith(".manage") || code.endsWith(".write"))) {
    level = "Edit";
  }

  return {
    modules: modules.slice(0, 4),
    level,
  };
}

function UserListRow({
  canManageUsers,
  user,
  onOpen,
}: {
  canManageUsers: boolean;
  user: UserRow;
  onOpen: (user: UserRow) => void;
}) {
  const summary = summarizePermissions(user);

  return (
    <article className="rounded-[1.25rem] border border-line bg-elevated p-4">
      <div className="flex flex-col gap-4 xl:grid xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)_auto] xl:items-center">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-ink sm:text-base">{user.fullName}</p>
          <p className="mt-1 text-sm leading-6 text-muted">{user.email}</p>
          <p className="mt-1 text-sm text-muted">{user.orgFunctionLabel ?? "Fonction non renseignée"}</p>
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap gap-2">
            <Badge tone={getRoleTone(user.role)}>{getRoleDisplay(user.role)}</Badge>
            <Badge tone={user.isActive ? "pine" : "warning"}>{user.isActive ? "Actif" : "Désactivé"}</Badge>
          </div>
          <p className="mt-2 text-sm text-muted">
            Permissions: {summary.level}
            {summary.modules.length > 0
              ? ` · ${summary.modules.join(", ")}`
              : " · Aucun module"}
          </p>
        </div>

        <div className="flex flex-wrap justify-start gap-2 xl:justify-end">
          {canManageUsers ? (
            <form action={updateUserAccess}>
              <input type="hidden" name="userId" value={user.id} />
              <input type="hidden" name="role" value={user.role} />
              <input type="hidden" name="orgFunctionId" value={user.orgFunctionId ?? ""} />
              {user.isActive ? null : <input type="hidden" name="isActive" value="on" />}
              <button
                className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                type="submit"
              >
                {user.isActive ? "Désactiver" : "Activer"}
              </button>
            </form>
          ) : null}

          {canManageUsers ? (
            <form action={updateUserAccess}>
              <input type="hidden" name="userId" value={user.id} />
              <input
                type="hidden"
                name="role"
                value={user.role === "lecture" ? "militant" : "lecture"}
              />
              <input type="hidden" name="orgFunctionId" value={user.orgFunctionId ?? ""} />
              {user.isActive ? <input type="hidden" name="isActive" value="on" /> : null}
              <button
                className="inline-flex min-h-[2.5rem] items-center rounded-2xl border border-line bg-panel px-4 text-sm font-medium text-ink transition hover:bg-panel/80"
                type="submit"
              >
                Modifier rôle
              </button>
            </form>
          ) : null}

          <Button type="button" variant="secondary" onClick={() => onOpen(user)}>
            Gérer
          </Button>
        </div>
      </div>
    </article>
  );
}

function UserDrawer({
  canManageUsers,
  orgFunctions,
  permissions,
  user,
  onClose,
}: {
  canManageUsers: boolean;
  orgFunctions: OrgFunctionOption[];
  permissions: PermissionOption[];
  user: UserRow;
  onClose: () => void;
}) {
  const permissionsByModule = permissions.reduce<Record<string, PermissionOption[]>>((accumulator, permission) => {
    accumulator[permission.module] ??= [];
    accumulator[permission.module].push(permission);
    return accumulator;
  }, {});
  const summary = summarizePermissions(user);

  return (
    <Drawer
      open
      title={user.fullName}
      subtitle={user.email}
      onClose={onClose}
    >
      <div className="flex flex-wrap gap-2">
        <Badge tone={getRoleTone(user.role)}>{getRoleDisplay(user.role)}</Badge>
        <Badge tone={user.isActive ? "pine" : "warning"}>{user.isActive ? "Actif" : "Désactivé"}</Badge>
      </div>
          <Panel title="Infos utilisateur" subtitle="Les éléments utiles pour comprendre l'accès accordé.">
            <div className="space-y-3 text-sm leading-6 text-muted">
              <p>Rôle: {getRoleDisplay(user.role)}</p>
              <p>Fonction: {user.orgFunctionLabel ?? "Aucune"}</p>
              <p>État: {user.isActive ? "Compte actif" : "Compte désactivé"}</p>
            </div>
          </Panel>

          <Panel title="Sécurité" subtitle="Les opérations de sécurisation restent séparées des changements courants.">
            <div className="space-y-3 text-sm leading-6 text-muted">
              <p>Dernière mise à jour du mot de passe: {user.passwordUpdatedAt ?? "Jamais"}</p>
              {canManageUsers ? (
                <form action={resetUserPassword} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                  <input type="hidden" name="userId" value={user.id} />
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Nouveau mot de passe</span>
                    <input
                      className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 outline-none transition focus:border-accent"
                      name="password"
                      type="password"
                      placeholder="Mot de passe temporaire"
                      required
                    />
                  </label>
                  <div className="flex items-end">
                    <Button type="submit" variant="secondary">Réinitialiser</Button>
                  </div>
                </form>
              ) : null}
            </div>
          </Panel>

          <Panel title="Permissions" subtitle="Vue simplifiée par modules et niveau d'accès.">
            <div className="space-y-3 text-sm leading-6 text-muted">
              <p>Niveau: {summary.level}</p>
              <p>Modules: {summary.modules.length > 0 ? summary.modules.join(", ") : "Aucun module"}</p>
              {canManageUsers ? (
                <form action={updateUserPermissions} className="grid gap-4">
                  <input type="hidden" name="userId" value={user.id} />
                  <div className="grid gap-4 lg:grid-cols-2">
                    {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                      <div key={module} className="rounded-2xl border border-line/70 bg-elevated p-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">{module}</p>
                        <div className="mt-3 space-y-2">
                          {modulePermissions.map((permission) => (
                            <label key={permission.id} className="flex items-start gap-3 text-sm text-ink/80">
                              <input
                                className="mt-1 h-4 w-4 rounded border-line"
                                type="checkbox"
                                name="permissionIds"
                                value={permission.id}
                                defaultChecked={user.directPermissionIds.includes(permission.id)}
                              />
                              <span>{permission.label}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-end">
                    <Button type="submit">Mettre à jour les permissions</Button>
                  </div>
                </form>
              ) : null}
            </div>
          </Panel>

          {canManageUsers ? (
            <Panel title="Actions sensibles" subtitle="Suppression et modifications avancées restent isolées ici.">
              <div className="space-y-4">
                <form action={updateUserAccess} className="grid gap-4">
                  <input type="hidden" name="userId" value={user.id} />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Rôle</span>
                      <select
                        className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 outline-none transition focus:border-accent"
                        name="role"
                        defaultValue={user.role}
                      >
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Fonction</span>
                      <select
                        className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 outline-none transition focus:border-accent"
                        name="orgFunctionId"
                        defaultValue={user.orgFunctionId ?? ""}
                      >
                        <option value="">Aucune</option>
                        {orgFunctions.map((orgFunction) => (
                          <option key={orgFunction.id} value={orgFunction.id}>
                            {orgFunction.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="inline-flex items-center gap-2 text-sm font-medium text-ink/80">
                    <input
                      className="h-4 w-4 rounded border-line"
                      type="checkbox"
                      name="isActive"
                      defaultChecked={user.isActive}
                    />
                    Compte actif
                  </label>
                  <div className="flex justify-end">
                    <Button type="submit">Mettre à jour l'accès</Button>
                  </div>
                </form>

                <form action={deleteUser}>
                  <input type="hidden" name="userId" value={user.id} />
                  <button
                    className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100"
                    type="submit"
                  >
                    Supprimer le compte
                  </button>
                </form>
              </div>
            </Panel>
          ) : null}
    </Drawer>
  );
}

export function UsersPage({
  users,
  orgFunctions,
  permissions,
  currentUserEmail,
  canManageUsers,
  success,
  error,
}: {
  users: UserRow[];
  orgFunctions: OrgFunctionOption[];
  permissions: PermissionOption[];
  currentUserEmail: string;
  canManageUsers: boolean;
  success?: string;
  error?: string;
}) {
  const [activeFilter, setActiveFilter] = useState<UserFilter>("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  const visibleUsers = useMemo(
    () => users.filter((user) => matchesFilter(user, activeFilter)),
    [users, activeFilter],
  );
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? null;

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Utilisateurs"
        description="Gérer les accès et les rôles de l'équipe."
      />

      {success ? <Notice>{success}</Notice> : null}
      {error ? <Notice tone="error">{error}</Notice> : null}

      <Panel
        title="Liste des utilisateurs"
        subtitle={`Compte connecté : ${currentUserEmail}`}
        actions={
          canManageUsers ? (
            <details className="group">
              <summary className="inline-flex min-h-[2.5rem] cursor-pointer list-none items-center rounded-2xl bg-ink px-4 text-sm font-medium text-white transition hover:bg-ink/92">
                Ajouter utilisateur
              </summary>
              <div className="mt-3 w-[min(92vw,46rem)] rounded-[1.25rem] border border-line bg-panel p-4 shadow-panel">
                <form action={createUser} className="grid gap-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Email</span>
                      <input
                        className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 outline-none transition focus:border-accent"
                        name="email"
                        type="email"
                        required
                      />
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Nom complet</span>
                      <input
                        className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 outline-none transition focus:border-accent"
                        name="fullName"
                        type="text"
                        required
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Rôle</span>
                      <select
                        className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 outline-none transition focus:border-accent"
                        name="role"
                        defaultValue="lecture"
                      >
                        {roles.map((role) => (
                          <option key={role.value} value={role.value}>
                            {role.label}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="block">
                      <span className="mb-2 block text-sm font-medium text-ink">Fonction</span>
                      <select
                        className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 outline-none transition focus:border-accent"
                        name="orgFunctionId"
                        defaultValue=""
                      >
                        <option value="">Aucune</option>
                        {orgFunctions.map((orgFunction) => (
                          <option key={orgFunction.id} value={orgFunction.id}>
                            {orgFunction.label}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>
                  <label className="block">
                    <span className="mb-2 block text-sm font-medium text-ink">Mot de passe initial</span>
                    <input
                      className="w-full rounded-2xl border border-line bg-elevated px-4 py-3 outline-none transition focus:border-accent"
                      name="password"
                      type="password"
                      required
                    />
                  </label>
                  <div className="flex justify-end">
                    <Button type="submit">Enregistrer le compte</Button>
                  </div>
                </form>
              </div>
            </details>
          ) : undefined
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          {[
            { key: "all" as const, label: "Tous" },
            { key: "active" as const, label: "Actifs" },
            { key: "disabled" as const, label: "Désactivés" },
            { key: "admins" as const, label: "Admins" },
          ].map((item) => (
            <FilterChip
              key={item.key}
              onClick={() => setActiveFilter(item.key)}
              active={activeFilter === item.key}
            >
              {item.label}
            </FilterChip>
          ))}
        </div>

        {visibleUsers.length > 0 ? (
          <div className="space-y-3">
            {visibleUsers.map((user) => (
              <UserListRow
                key={user.id}
                canManageUsers={canManageUsers}
                user={user}
                onOpen={(item) => setSelectedUserId(item.id)}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-line bg-elevated p-6 text-sm text-muted">
            Aucun utilisateur ne correspond à ce filtre.
          </div>
        )}
      </Panel>

      {selectedUser ? (
        <UserDrawer
          canManageUsers={canManageUsers}
          orgFunctions={orgFunctions}
          permissions={permissions}
          user={selectedUser}
          onClose={() => setSelectedUserId(null)}
        />
      ) : null}
    </div>
  );
}
