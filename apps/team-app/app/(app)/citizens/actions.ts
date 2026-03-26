"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/postgres";
import { requirePermission } from "@/lib/permissions";

const SUPPORT_LEVELS = new Set([
  "unknown",
  "opposed",
  "skeptical",
  "neutral",
  "supportive",
  "volunteer",
]);

function parseTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseSupportLevel(value: FormDataEntryValue | null) {
  const supportLevel = String(value ?? "").trim() || "unknown";
  return SUPPORT_LEVELS.has(supportLevel) ? supportLevel : null;
}

export async function createCitizen(formData: FormData) {
  const { user } = await requirePermission("citizens.manage");

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const address = String(formData.get("address") ?? "").trim();
  const neighborhood = String(formData.get("neighborhood") ?? "").trim();
  const pollingStationCode = String(formData.get("pollingStationCode") ?? "").trim();
  const supportLevel = parseSupportLevel(formData.get("supportLevel"));
  const notes = String(formData.get("notes") ?? "").trim();
  const tags = parseTags(formData.get("tags"));

  if (!fullName || !supportLevel) {
    redirect("/citizens?error=Fiche%20citoyen%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      insert into citizens (
        full_name,
        phone,
        email,
        address,
        neighborhood,
        polling_station_code,
        support_level,
        tags,
        notes,
        created_by
      )
      values (
        $1,
        nullif($2, ''),
        nullif($3, ''),
        nullif($4, ''),
        nullif($5, ''),
        nullif($6, ''),
        $7::support_level,
        $8,
        nullif($9, ''),
        $10
      )
    `,
    [fullName, phone, email, address, neighborhood, pollingStationCode, supportLevel, tags, notes, user.id],
  );

  revalidatePath("/citizens");
  revalidatePath("/field-reports");
  redirect("/citizens?success=Fiche%20citoyen%20cree");
}

export async function updateCitizen(formData: FormData) {
  await requirePermission("citizens.manage");

  const citizenId = String(formData.get("citizenId") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const address = String(formData.get("address") ?? "").trim();
  const neighborhood = String(formData.get("neighborhood") ?? "").trim();
  const pollingStationCode = String(formData.get("pollingStationCode") ?? "").trim();
  const supportLevel = parseSupportLevel(formData.get("supportLevel"));
  const notes = String(formData.get("notes") ?? "").trim();
  const tags = parseTags(formData.get("tags"));

  if (!citizenId || !fullName || !supportLevel) {
    redirect("/citizens?error=Mise%20a%20jour%20citoyen%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      update citizens
      set
        full_name = $2,
        phone = nullif($3, ''),
        email = nullif($4, ''),
        address = nullif($5, ''),
        neighborhood = nullif($6, ''),
        polling_station_code = nullif($7, ''),
        support_level = $8::support_level,
        tags = $9,
        notes = nullif($10, ''),
        updated_at = now()
      where id = $1
    `,
    [citizenId, fullName, phone, email, address, neighborhood, pollingStationCode, supportLevel, tags, notes],
  );

  revalidatePath("/citizens");
  revalidatePath("/field-reports");
  redirect("/citizens?success=Fiche%20citoyen%20mise%20a%20jour");
}
