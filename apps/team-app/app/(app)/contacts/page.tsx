import { redirect } from "next/navigation";
import { ContactsPage } from "@/components/contacts-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getContactsData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

type ContactsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
    q?: string;
    contactKind?: string;
  }>;
};

export default async function Page({ searchParams }: ContactsPageProps) {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "contacts.read")) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const contacts = await getContactsData({
    q: params?.q,
    contactKind: params?.contactKind,
  });

  return (
    <ContactsPage
      canManageContacts={hasPermission(permissions, "contacts.manage")}
      contacts={contacts}
      error={params?.error}
      filters={{
        q: params?.q ?? "",
        contactKind: params?.contactKind ?? "",
      }}
      success={params?.success}
    />
  );
}
