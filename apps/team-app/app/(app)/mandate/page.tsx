import { redirect } from "next/navigation";
import { MandatePage } from "@/components/mandate-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getMandateTrackingData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || (!hasPermission(permissions, "mandate.read") && !hasPermission(permissions, "budget.read"))) {
    redirect("/dashboard");
  }

  const data = await getMandateTrackingData();
  return <MandatePage data={data} />;
}
