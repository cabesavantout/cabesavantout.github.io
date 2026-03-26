"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/postgres";
import { requirePermission } from "@/lib/permissions";

export async function assignSectorOwner(formData: FormData) {
  await requirePermission("team.manage");

  const sectorId = String(formData.get("sectorId") ?? "").trim();
  const userId = String(formData.get("userId") ?? "").trim();

  if (!sectorId) {
    redirect("/team?error=Affectation%20de%20secteur%20invalide");
  }

  const db = getPool();

  await db.query(
    `
      update sector_assignments
      set is_primary = false
      where sector_id = $1
    `,
    [sectorId],
  );

  if (userId) {
    await db.query(
      `
        insert into sector_assignments (sector_id, user_id, role_label, is_primary)
        values ($1, $2, 'responsable', true)
        on conflict (sector_id, user_id)
        do update set
          role_label = excluded.role_label,
          is_primary = true
      `,
      [sectorId, userId],
    );
  }

  revalidatePath("/team");
  redirect("/team?success=Responsable%20de%20secteur%20mis%20a%20jour");
}
