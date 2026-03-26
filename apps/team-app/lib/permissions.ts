import { redirect } from "next/navigation";
import { getPool } from "@/lib/postgres";
import { getLocalAuthUserFromSession, isSuperadmin } from "@/lib/local-auth";

export async function getPermissionsForUser(userId: string) {
  const db = getPool();
  const { rows } = await db.query<{ code: string }>(
    `
      with role_based as (
        select p.code
        from users u
        join role_permissions rp
          on rp.role = u.role
        join permissions p
          on p.id = rp.permission_id
        where u.id = $1
      ),
      user_based as (
        select p.code
        from user_permissions up
        join permissions p
          on p.id = up.permission_id
        where up.user_id = $1
      )
      select distinct code
      from (
        select code from role_based
        union all
        select code from user_based
      ) permissions_union
      order by code asc
    `,
    [userId],
  );

  return rows.map((row) => row.code);
}

export async function getCurrentAccessContext() {
  const user = await getLocalAuthUserFromSession();

  if (!user) {
    return {
      user: null,
      permissions: [] as string[],
    };
  }

  if (isSuperadmin(user)) {
    return {
      user,
      permissions: ["*"],
    };
  }

  return {
    user,
    permissions: await getPermissionsForUser(user.id),
  };
}

export function hasPermission(permissions: string[], permissionCode: string) {
  return permissions.includes("*") || permissions.includes(permissionCode);
}

export async function requirePermission(permissionCode: string) {
  const context = await getCurrentAccessContext();

  if (!context.user || !hasPermission(context.permissions, permissionCode)) {
    redirect("/dashboard");
  }

  return context;
}
