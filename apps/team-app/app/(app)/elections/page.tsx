import { redirect } from "next/navigation";
import { ElectoralAnalysisPage } from "@/components/electoral-analysis-page";
import { getCommuneElectoralAnalysisData } from "@/lib/commune-elections";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "elections.read")) {
    redirect("/dashboard");
  }

  const data = await getCommuneElectoralAnalysisData();
  return <ElectoralAnalysisPage data={data} />;
}
