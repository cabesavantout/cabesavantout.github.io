import { redirect } from "next/navigation";
import { DocumentsPage } from "@/components/documents-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getMunicipalDocumentsPageData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, permissions } = await getCurrentAccessContext();
  const canAccessDocuments =
    hasPermission(permissions, "budget.read") ||
    hasPermission(permissions, "mandate.read") ||
    hasPermission(permissions, "elections.read");

  if (!user || !canAccessDocuments) {
    redirect("/dashboard");
  }

  const data = await getMunicipalDocumentsPageData();
  return <DocumentsPage data={data} />;
}
