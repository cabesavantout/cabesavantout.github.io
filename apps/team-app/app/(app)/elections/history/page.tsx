import { redirect } from "next/navigation";
import { ElectoralHistoryPage } from "@/components/electoral-history-page";
import { getCommuneElectoralAnalysisData } from "@/lib/commune-elections";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "elections.read")) {
    redirect("/dashboard");
  }

  const data = await getCommuneElectoralAnalysisData();
  return <ElectoralHistoryPage data={data} />;
}
