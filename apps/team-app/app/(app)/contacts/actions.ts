"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getPool, hasRelation } from "@/lib/postgres";
import { requirePermission } from "@/lib/permissions";

const CONTACT_KINDS = new Set([
  "member",
  "journalist",
  "partner",
  "institution",
  "supplier",
  "volunteer",
  "donor",
  "other",
]);

function parseTags(value: FormDataEntryValue | null) {
  return String(value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseContactKind(value: FormDataEntryValue | null) {
  const contactKind = String(value ?? "").trim() || "other";
  return CONTACT_KINDS.has(contactKind) ? contactKind : null;
}

export async function createContact(formData: FormData) {
  const { user } = await requirePermission("contacts.manage");
  const contactsReady = await hasRelation("public.contacts");

  if (!contactsReady) {
    redirect("/contacts?error=La%20table%20contacts%20est%20absente%20de%20la%20base%20active");
  }

  const fullName = String(formData.get("fullName") ?? "").trim();
  const contactKind = parseContactKind(formData.get("contactKind"));
  const organization = String(formData.get("organization") ?? "").trim();
  const roleLabel = String(formData.get("roleLabel") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const tags = parseTags(formData.get("tags"));

  if (!fullName || !contactKind) {
    redirect("/contacts?error=Contact%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      insert into contacts (
        full_name,
        contact_kind,
        organization,
        role_label,
        email,
        phone,
        location,
        is_active,
        tags,
        notes,
        created_by
      )
      values (
        $1,
        $2,
        nullif($3, ''),
        nullif($4, ''),
        nullif($5, ''),
        nullif($6, ''),
        nullif($7, ''),
        $8,
        $9,
        nullif($10, ''),
        $11
      )
    `,
    [fullName, contactKind, organization, roleLabel, email, phone, location, true, tags, notes, user.id],
  );

  revalidatePath("/contacts");
  redirect("/contacts?success=Contact%20cree");
}

export async function updateContact(formData: FormData) {
  await requirePermission("contacts.manage");
  const contactsReady = await hasRelation("public.contacts");

  if (!contactsReady) {
    redirect("/contacts?error=La%20table%20contacts%20est%20absente%20de%20la%20base%20active");
  }

  const contactId = String(formData.get("contactId") ?? "").trim();
  const fullName = String(formData.get("fullName") ?? "").trim();
  const contactKind = parseContactKind(formData.get("contactKind"));
  const organization = String(formData.get("organization") ?? "").trim();
  const roleLabel = String(formData.get("roleLabel") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const location = String(formData.get("location") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const tags = parseTags(formData.get("tags"));

  if (!contactId || !fullName || !contactKind) {
    redirect("/contacts?error=Mise%20a%20jour%20contact%20invalide");
  }

  const db = getPool();
  await db.query(
    `
      update contacts
      set
        full_name = $2,
        contact_kind = $3,
        organization = nullif($4, ''),
        role_label = nullif($5, ''),
        email = nullif($6, ''),
        phone = nullif($7, ''),
        location = nullif($8, ''),
        tags = $9,
        notes = nullif($10, ''),
        updated_at = now()
      where id = $1
    `,
    [contactId, fullName, contactKind, organization, roleLabel, email, phone, location, tags, notes],
  );

  revalidatePath("/contacts");
  redirect("/contacts?success=Contact%20mis%20a%20jour");
}

export async function deleteContact(formData: FormData) {
  await requirePermission("contacts.manage");
  const contactsReady = await hasRelation("public.contacts");

  if (!contactsReady) {
    redirect("/contacts?error=La%20table%20contacts%20est%20absente%20de%20la%20base%20active");
  }

  const contactId = String(formData.get("contactId") ?? "").trim();

  if (!contactId) {
    redirect("/contacts?error=Suppression%20contact%20invalide");
  }

  const db = getPool();
  await db.query(`delete from contacts where id = $1`, [contactId]);

  revalidatePath("/contacts");
  redirect("/contacts?success=Contact%20supprime");
}
