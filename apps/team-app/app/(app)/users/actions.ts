"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/postgres";
import { hashPassword } from "@/lib/local-auth";
import { requirePermission } from "@/lib/permissions";

const USER_ROLES = [
  "superadmin",
  "admin",
  "direction",
  "coordinateur",
  "militant",
  "lecture",
] as const;

function isAllowedRole(value: string): value is (typeof USER_ROLES)[number] {
  return USER_ROLES.includes(value as (typeof USER_ROLES)[number]);
}

export async function createUser(formData: FormData) {
  await requirePermission("users.manage");

  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const orgFunctionId = String(formData.get("orgFunctionId") ?? "").trim();

  if (!email || !fullName || !password || !isAllowedRole(role)) {
    redirect("/users?error=Champs%20obligatoires%20ou%20role%20invalide");
  }

  const db = getPool();

  await db.query(
    `
      insert into users (
        email,
        full_name,
        role,
        org_function_id,
        is_active,
        password_hash,
        password_updated_at
      )
      values (
        $1,
        $2,
        $3::app_role,
        nullif($4, '')::uuid,
        true,
        $5,
        now()
      )
      on conflict (email)
      do update set
        full_name = excluded.full_name,
        role = excluded.role,
        org_function_id = excluded.org_function_id,
        is_active = true,
        password_hash = excluded.password_hash,
        password_updated_at = now(),
        updated_at = now()
    `,
    [email, fullName, role, orgFunctionId, hashPassword(password)],
  );

  revalidatePath("/users");
  redirect("/users?success=Utilisateur%20enregistre");
}

export async function updateUserAccess(formData: FormData) {
  await requirePermission("users.manage");

  const userId = String(formData.get("userId") ?? "").trim();
  const role = String(formData.get("role") ?? "").trim();
  const orgFunctionId = String(formData.get("orgFunctionId") ?? "").trim();
  const isActive = formData.get("isActive") === "on";

  if (!userId || !isAllowedRole(role)) {
    redirect("/users?error=Mise%20a%20jour%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      update users
      set
        role = $2::app_role,
        org_function_id = nullif($3, '')::uuid,
        is_active = $4,
        updated_at = now()
      where id = $1
    `,
    [userId, role, orgFunctionId, isActive],
  );

  revalidatePath("/users");
  redirect("/users?success=Acces%20mis%20a%20jour");
}

export async function resetUserPassword(formData: FormData) {
  await requirePermission("users.manage");

  const userId = String(formData.get("userId") ?? "").trim();
  const password = String(formData.get("password") ?? "").trim();

  if (!userId || !password) {
    redirect("/users?error=Mot%20de%20passe%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      update users
      set
        password_hash = $2,
        password_updated_at = now(),
        updated_at = now()
      where id = $1
    `,
    [userId, hashPassword(password)],
  );

  revalidatePath("/users");
  redirect("/users?success=Mot%20de%20passe%20reinitialise");
}

export async function deleteUser(formData: FormData) {
  const { user: currentUser } = await requirePermission("users.manage");
  const userId = String(formData.get("userId") ?? "").trim();

  if (!userId) {
    redirect("/users?error=Suppression%20invalide");
  }

  if (userId === currentUser.id) {
    redirect("/users?error=Impossible%20de%20supprimer%20votre%20propre%20compte");
  }

  const db = getPool();
  await db.query("delete from users where id = $1", [userId]);

  revalidatePath("/users");
  redirect("/users?success=Compte%20supprime");
}

export async function updateUserPermissions(formData: FormData) {
  await requirePermission("users.manage");

  const userId = String(formData.get("userId") ?? "").trim();

  if (!userId) {
    redirect("/users?error=Mise%20a%20jour%20des%20permissions%20invalide");
  }

  const permissionIds = formData
    .getAll("permissionIds")
    .map((value) => String(value).trim())
    .filter(Boolean);

  const db = getPool();

  await db.query("delete from user_permissions where user_id = $1", [userId]);

  if (permissionIds.length > 0) {
    await db.query(
      `
        insert into user_permissions (user_id, permission_id)
        select $1, permission_id::uuid
        from unnest($2::text[]) as permission_id
      `,
      [userId, permissionIds],
    );
  }

  revalidatePath("/users");
  redirect("/users?success=Permissions%20mises%20a%20jour");
}
