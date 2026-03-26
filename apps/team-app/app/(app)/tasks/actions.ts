"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/postgres";
import { requirePermission } from "@/lib/permissions";

const TASK_PRIORITIES = ["low", "medium", "high", "critical"] as const;
const TASK_STATUSES = ["todo", "in_progress", "blocked", "done", "cancelled"] as const;

function isAllowedPriority(value: string): value is (typeof TASK_PRIORITIES)[number] {
  return TASK_PRIORITIES.includes(value as (typeof TASK_PRIORITIES)[number]);
}

function isAllowedStatus(value: string): value is (typeof TASK_STATUSES)[number] {
  return TASK_STATUSES.includes(value as (typeof TASK_STATUSES)[number]);
}

export async function createTask(formData: FormData) {
  const { user } = await requirePermission("tasks.manage");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const priority = String(formData.get("priority") ?? "").trim();
  const dueAt = String(formData.get("dueAt") ?? "").trim();

  if (!title || !isAllowedPriority(priority)) {
    redirect("/tasks?error=Creation%20de%20tache%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      insert into tasks (title, description, priority, created_by, due_at)
      values ($1, nullif($2, ''), $3::task_priority, $4, nullif($5, '')::timestamptz)
    `,
    [title, description, priority, user.id, dueAt],
  );

  revalidatePath("/tasks");
  redirect("/tasks?success=Tache%20cree");
}

export async function updateTask(formData: FormData) {
  await requirePermission("tasks.manage");

  const taskId = String(formData.get("taskId") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();
  const assignedTo = String(formData.get("assignedTo") ?? "").trim();

  if (!taskId || !isAllowedStatus(status)) {
    redirect("/tasks?error=Mise%20a%20jour%20de%20tache%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      update tasks
      set
        status = $2::task_status,
        assigned_to = nullif($3, '')::uuid,
        completed_at = case
          when $2::task_status = 'done' then coalesce(completed_at, now())
          else null
        end,
        updated_at = now()
      where id = $1
    `,
    [taskId, status, assignedTo],
  );

  revalidatePath("/tasks");
  redirect("/tasks?success=Tache%20mise%20a%20jour");
}

export async function createTaskFromFieldReport(formData: FormData) {
  const { user } = await requirePermission("tasks.manage");

  const reportId = String(formData.get("reportId") ?? "").trim();

  if (!reportId) {
    redirect("/field-reports?error=Retour%20terrain%20invalide");
  }

  const db = getPool();
  const existingTaskResult = await db.query<{ id: string }>(
    `
      select id
      from tasks
      where source_field_report_id = $1
      limit 1
    `,
    [reportId],
  );

  if (existingTaskResult.rows[0]) {
    redirect("/field-reports?error=Une%20tache%20existe%20deja%20pour%20ce%20retour");
  }

  const reportResult = await db.query<{
    topic: string | null;
    summary: string;
    priority: string;
    pollingStationCode: string | null;
    citizenName: string | null;
  }>(
    `
      select
        fr.topic,
        fr.summary,
        fr.priority::text as priority,
        fr.polling_station_code as "pollingStationCode",
        citizen.full_name as "citizenName"
      from field_reports fr
      left join citizens citizen on citizen.id = fr.citizen_id
      where fr.id = $1
      limit 1
    `,
    [reportId],
  );

  const report = reportResult.rows[0];

  if (!report) {
    redirect("/field-reports?error=Retour%20terrain%20introuvable");
  }

  const title = report.topic
    ? `Traiter : ${report.topic}`
    : "Traiter un retour terrain";

  const details = [
    report.summary,
    report.citizenName ? `Citoyen : ${report.citizenName}` : null,
    report.pollingStationCode ? `Bureau : ${report.pollingStationCode}` : null,
  ].filter(Boolean).join("\n");

  await db.query(
    `
      insert into tasks (
        title,
        description,
        priority,
        created_by,
        source_field_report_id
      )
      values ($1, $2, $3::task_priority, $4, $5)
    `,
    [title, details, report.priority, user.id, reportId],
  );

  await db.query(
    `
      update field_reports
      set
        status = case
          when status = 'new' then 'in_progress'::field_report_status
          else status
        end
      where id = $1
    `,
    [reportId],
  );

  revalidatePath("/tasks");
  revalidatePath("/field-reports");
  revalidatePath("/field-analysis");
  redirect("/field-reports?success=Tache%20cree%20a%20partir%20du%20retour");
}
