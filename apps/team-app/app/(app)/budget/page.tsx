import { redirect } from "next/navigation";
import { BudgetPage } from "@/components/budget-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getBudgetPageData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "budget.read")) {
    redirect("/dashboard");
  }

  const data = await getBudgetPageData();
  return <BudgetPage data={data} />;
}
