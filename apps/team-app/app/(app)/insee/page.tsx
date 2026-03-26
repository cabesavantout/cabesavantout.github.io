import { redirect } from "next/navigation";
import { InseePage } from "@/components/insee-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getInseePageData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export default async function Page() {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "insee.read")) {
    redirect("/dashboard");
  }

  const data = await getInseePageData();
  return <InseePage data={data} />;
}
