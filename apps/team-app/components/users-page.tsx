import { Badge, PageHeader, Panel, StatCard } from "@/components/ui";
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

const roles = [
  { value: "superadmin", label: "Superadmin" },
  { value: "admin", label: "Admin" },
  { value: "direction", label: "Direction" },
  { value: "coordinateur", label: "Coordinateur" },
  { value: "militant", label: "Militant" },
  { value: "lecture", label: "Lecture" },
];

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
  const activeCount = users.filter((user) => user.isActive).length;
  const superadminCount = users.filter((user) => user.role === "superadmin").length;
  const permissionsByModule = permissions.reduce<Record<string, PermissionOption[]>>(
    (accumulator, permission) => {
      accumulator[permission.module] ??= [];
      accumulator[permission.module].push(permission);
      return accumulator;
    },
    {},
  );

  return (
    <div>
      <PageHeader
        eyebrow="Administration"
        title="Utilisateurs"
        description="Gestion des comptes locaux PostgreSQL. Cette page est réservée au superadmin."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Comptes total" value={String(users.length)} />
        <StatCard label="Comptes actifs" value={String(activeCount)} tone="pine" />
        <StatCard label="Superadmins" value={String(superadminCount)} tone="accent" />
      </div>

      {success ? (
        <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          {success}
        </div>
      ) : null}

      {error ? (
        <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      ) : null}

      {canManageUsers ? (
        <details className="mt-6 group">
          <summary className="flex cursor-pointer list-none items-center justify-between rounded-[30px] border border-accent/20 bg-[linear-gradient(135deg,rgba(168,57,39,0.1),rgba(255,255,255,0.86))] px-5 py-5 shadow-panel transition hover:border-accent/35 sm:px-6">
            <div>
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.32em] text-accent">
                Action
              </p>
              <h3 className="mt-2 text-xl font-semibold text-ink sm:text-2xl">
                Ajouter un utilisateur
              </h3>
            </div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-accent text-3xl leading-none text-white shadow-sm transition group-open:rotate-45">
              +
            </span>
          </summary>
          <div className="mt-4">
            <Panel
              title="Nouveau compte"
              subtitle="Créer un compte avec rôle global et fonction organisationnelle."
            >
              <form action={createUser} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-sm font-medium">Email</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="email"
                  type="email"
                  placeholder="prenom.nom@exemple.fr"
                  required
                />
              </label>

              <label className="block">
                <span className="mb-2 block text-sm font-medium">Nom complet</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="fullName"
                  type="text"
                  placeholder="Prénom Nom"
                  required
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-medium">Rôle global</span>
                  <select
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
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
                  <span className="mb-2 block text-sm font-medium">
                    Fonction organisationnelle
                  </span>
                  <select
                    className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
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
                <span className="mb-2 block text-sm font-medium">Mot de passe initial</span>
                <input
                  className="w-full rounded-2xl border border-line bg-sand px-4 py-3 outline-none transition focus:border-accent"
                  name="password"
                  type="password"
                  placeholder="Mot de passe temporaire"
                  required
                />
              </label>

              <button
                className="w-full rounded-2xl bg-ink px-4 py-3 font-medium text-white transition hover:bg-ink/90 sm:w-auto"
                type="submit"
              >
                Enregistrer le compte
              </button>
              </form>
            </Panel>
          </div>
        </details>
      ) : null}

      <div className="mt-6">
        <Panel
          title="Utilisateurs"
          subtitle={`Compte connecté : ${currentUserEmail}`}
        >
          <div className="space-y-4">
            {users.map((user) => (
              <article
                key={user.id}
                className="rounded-3xl border border-line/80 bg-sand/70 p-5"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="text-lg font-semibold">{user.fullName}</h3>
                      <Badge tone={user.isActive ? "pine" : "warning"}>
                        {user.isActive ? "Actif" : "Désactivé"}
                      </Badge>
                      <Badge tone="accent">{user.role}</Badge>
                    </div>
                    <p className="mt-2 break-words text-sm text-ink/70">{user.email}</p>
                    <p className="mt-2 text-sm text-ink/55">
                      Fonction : {user.orgFunctionLabel ?? "Aucune"}
                    </p>
                    <p className="mt-1 text-sm text-ink/55">
                      Mot de passe mis à jour : {user.passwordUpdatedAt ?? "Jamais"}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {user.effectivePermissionCodes.length > 0 ? (
                        user.effectivePermissionCodes.map((permissionCode) => (
                          <Badge key={permissionCode} tone="neutral">
                            {permissionCode}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-sm text-ink/55">
                          Aucun droit effectif chargé.
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-4 grid gap-4">
                  {canManageUsers ? (
                    <>
                      <form action={updateUserAccess} className="grid gap-4 xl:grid-cols-[1fr_1fr_auto]">
                        <input type="hidden" name="userId" value={user.id} />

                        <label className="block">
                          <span className="mb-2 block text-sm font-medium">Rôle</span>
                          <select
                            className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
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
                          <span className="mb-2 block text-sm font-medium">Fonction</span>
                          <select
                            className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
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

                        <div className="flex flex-col justify-end gap-3">
                          <label className="inline-flex items-center gap-2 text-sm font-medium text-ink/80">
                            <input
                              className="h-4 w-4 rounded border-line"
                              type="checkbox"
                              name="isActive"
                              defaultChecked={user.isActive}
                            />
                            Actif
                          </label>
                          <button
                            className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
                            type="submit"
                          >
                            Mettre à jour
                          </button>
                        </div>
                      </form>

                      <div className="grid gap-4 xl:grid-cols-[1fr_auto]">
                        <form action={resetUserPassword} className="grid gap-3 sm:grid-cols-[1fr_auto]">
                          <input type="hidden" name="userId" value={user.id} />
                          <label className="block">
                            <span className="mb-2 block text-sm font-medium">
                              Nouveau mot de passe
                            </span>
                            <input
                              className="w-full rounded-2xl border border-line bg-white px-4 py-3 outline-none transition focus:border-accent"
                              name="password"
                              type="password"
                              placeholder="Nouveau mot de passe"
                              required
                            />
                          </label>
                          <div className="flex items-end">
                            <button
                              className="w-full rounded-2xl border border-line bg-white px-4 py-3 text-sm font-medium text-ink transition hover:bg-sand sm:w-auto"
                              type="submit"
                            >
                              Réinitialiser
                            </button>
                          </div>
                        </form>

                        <form action={deleteUser} className="flex justify-start sm:justify-end">
                          <input type="hidden" name="userId" value={user.id} />
                          <button
                            className="w-full rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 transition hover:bg-red-100 sm:w-auto"
                            type="submit"
                          >
                            Supprimer le compte
                          </button>
                        </form>
                      </div>

                      <form action={updateUserPermissions} className="grid gap-4">
                        <input type="hidden" name="userId" value={user.id} />
                        <div className="rounded-2xl border border-line/70 bg-white/70 p-4">
                          <div className="mb-4">
                            <p className="font-medium text-ink">Surcharges de permissions</p>
                            <p className="mt-1 text-sm text-ink/65">
                              Ces cases ajoutent des droits directs en plus du rôle global.
                            </p>
                          </div>

                          <div className="grid gap-4 lg:grid-cols-2">
                            {Object.entries(permissionsByModule).map(([module, modulePermissions]) => (
                              <div
                                key={module}
                                className="rounded-2xl border border-line/60 bg-sand/60 p-4"
                              >
                                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
                                  {module}
                                </p>
                                <div className="mt-3 space-y-2">
                                  {modulePermissions.map((permission) => (
                                    <label
                                      key={permission.id}
                                      className="flex items-start gap-3 text-sm text-ink/80"
                                    >
                                      <input
                                        className="mt-0.5 h-4 w-4 rounded border-line"
                                        type="checkbox"
                                        name="permissionIds"
                                        value={permission.id}
                                        defaultChecked={user.directPermissionIds.includes(
                                          permission.id,
                                        )}
                                      />
                                      <span>
                                        <span className="block font-medium text-ink">
                                          {permission.label}
                                        </span>
                                        <span className="block text-xs text-ink/55">
                                          {permission.code}
                                        </span>
                                      </span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex justify-end">
                            <button
                              className="rounded-2xl bg-ink px-4 py-3 text-sm font-medium text-white transition hover:bg-ink/90"
                              type="submit"
                            >
                              Enregistrer les permissions
                            </button>
                          </div>
                        </div>
                      </form>
                    </>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </Panel>
      </div>
    </div>
  );
}
