import { redirect } from "next/navigation";
import { ElectoralAnalysisPage } from "@/components/electoral-analysis-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getElectoralAnalysisData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "elections.read")) {
    redirect("/dashboard");
  }

  const data = await getElectoralAnalysisData();
  return <ElectoralAnalysisPage data={data} />;
}
