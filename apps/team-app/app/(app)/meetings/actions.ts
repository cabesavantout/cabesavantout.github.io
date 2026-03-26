"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool } from "@/lib/postgres";
import { requirePermission } from "@/lib/permissions";

export async function createMeeting(formData: FormData) {
  const { user } = await requirePermission("meetings.manage");

  const title = String(formData.get("title") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const startsAt = String(formData.get("startsAt") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();

  if (!title || !startsAt) {
    redirect("/meetings?error=Creation%20de%20reunion%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      insert into meetings (title, description, starts_at, location, created_by)
      values ($1, nullif($2, ''), $3::timestamptz, nullif($4, ''), $5)
    `,
    [title, description, startsAt, location, user.id],
  );

  revalidatePath("/meetings");
  redirect("/meetings?success=Reunion%20cree");
}

export async function createMeetingNote(formData: FormData) {
  const { user } = await requirePermission("meetings.manage");

  const meetingId = String(formData.get("meetingId") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();

  if (!meetingId || !body) {
    redirect("/meetings?error=Note%20de%20reunion%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      insert into meeting_notes (meeting_id, author_id, body)
      values ($1::uuid, $2, $3)
    `,
    [meetingId, user.id, body],
  );

  revalidatePath("/meetings");
  redirect("/meetings?success=Note%20ajoutee");
}

export async function createMeetingAction(formData: FormData) {
  await requirePermission("meetings.manage");

  const meetingId = String(formData.get("meetingId") ?? "").trim();
  const title = String(formData.get("title") ?? "").trim();
  const ownerId = String(formData.get("ownerId") ?? "").trim();
  const dueAt = String(formData.get("dueAt") ?? "").trim();

  if (!meetingId || !title) {
    redirect("/meetings?error=Action%20de%20reunion%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      insert into meeting_actions (meeting_id, title, owner_id, due_at)
      values ($1::uuid, $2, nullif($3, '')::uuid, nullif($4, '')::timestamptz)
    `,
    [meetingId, title, ownerId, dueAt],
  );

  revalidatePath("/meetings");
  redirect("/meetings?success=Action%20ajoutee");
}
