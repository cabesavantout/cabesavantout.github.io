"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/postgres";
import { requirePermission } from "@/lib/permissions";

export async function createFieldReport(formData: FormData) {
  const { user } = await requirePermission("field_reports.create");

  const citizenId = String(formData.get("citizenId") ?? "").trim();
  const neighborhood = String(formData.get("neighborhood") ?? "").trim();
  const pollingStationCode = String(formData.get("pollingStationCode") ?? "").trim();
  const topic = String(formData.get("topic") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const summary = String(formData.get("summary") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim() || "terrain";
  const supportLevel = String(formData.get("supportLevel") ?? "").trim() || "unknown";
  const priority = String(formData.get("priority") ?? "").trim() || "medium";
  const sentimentRaw = String(formData.get("sentiment") ?? "").trim();

  const tags = tagsRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!summary) {
    redirect("/field-reports?error=Retour%20terrain%20invalide");
  }

  const sentiment = sentimentRaw ? Number(sentimentRaw) : null;

  if (
    sentimentRaw &&
    (sentiment === null || Number.isNaN(sentiment) || sentiment < -2 || sentiment > 2)
  ) {
    redirect("/field-reports?error=Sentiment%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      insert into field_reports (
        author_id,
        citizen_id,
        source,
        neighborhood,
        polling_station_code,
        topic,
        tags,
        summary,
        support_level,
        priority,
        sentiment
      )
      values (
        $1,
        nullif($2, '')::uuid,
        $3,
        nullif($4, ''),
        nullif($5, ''),
        $6,
        $7,
        $8,
        $9::support_level,
        $10::task_priority,
        $11
      )
    `,
    [
      user.id,
      citizenId,
      source,
      neighborhood,
      pollingStationCode,
      topic,
      tags,
      summary,
      supportLevel,
      priority,
      sentiment,
    ],
  );

  revalidatePath("/field-reports");
  redirect("/field-reports?success=Retour%20terrain%20cree");
}

export async function updateFieldReport(formData: FormData) {
  await requirePermission("field_reports.manage");

  const reportId = String(formData.get("reportId") ?? "").trim();
  const citizenId = String(formData.get("citizenId") ?? "").trim();
  const source = String(formData.get("source") ?? "").trim();
  const pollingStationCode = String(formData.get("pollingStationCode") ?? "").trim();
  const supportLevel = String(formData.get("supportLevel") ?? "").trim();
  const priority = String(formData.get("priority") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const tagsRaw = String(formData.get("tags") ?? "").trim();
  const sentimentRaw = String(formData.get("sentiment") ?? "").trim();
  const tags = tagsRaw
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (!reportId || !source || !supportLevel || !priority || !status) {
    redirect("/field-reports?error=Qualification%20de%20retour%20invalide");
  }

  const sentiment = sentimentRaw ? Number(sentimentRaw) : null;

  if (
    sentimentRaw &&
    (sentiment === null || Number.isNaN(sentiment) || sentiment < -2 || sentiment > 2)
  ) {
    redirect("/field-reports?error=Sentiment%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      update field_reports
      set
        source = $2,
        sentiment = $3,
        citizen_id = nullif($4, '')::uuid,
        polling_station_code = nullif($5, ''),
        support_level = $6::support_level,
        priority = $7::task_priority,
        status = $8::field_report_status,
        tags = $9,
        created_at = created_at
      where id = $1
    `,
    [reportId, source, sentiment, citizenId, pollingStationCode, supportLevel, priority, status, tags],
  );

  revalidatePath("/field-reports");
  redirect("/field-reports?success=Retour%20qualifie");
}
