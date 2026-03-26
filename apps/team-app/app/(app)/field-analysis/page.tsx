import { redirect } from "next/navigation";
import { FieldAnalysisPage } from "@/components/field-analysis-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getFieldAnalysisData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "field_reports.read")) {
    redirect("/dashboard");
  }

  const data = await getFieldAnalysisData();

  return <FieldAnalysisPage data={data} />;
}
