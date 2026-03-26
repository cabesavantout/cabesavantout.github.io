import { redirect } from "next/navigation";
import { FieldReportsPage } from "@/components/field-reports-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import {
  getCitizenOptions,
  getFieldReportsData,
  getPollingStationOptions,
} from "@/lib/postgres";

export const dynamic = "force-dynamic";

type FieldReportsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
    q?: string;
    supportLevel?: string;
    status?: string;
    pollingStationCode?: string;
  }>;
};

export default async function Page({ searchParams }: FieldReportsPageProps) {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "field_reports.read")) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const [reports, pollingStations, citizens] = await Promise.all([
    getFieldReportsData({
      q: params?.q,
      supportLevel: params?.supportLevel,
      status: params?.status,
      pollingStationCode: params?.pollingStationCode,
    }),
    getPollingStationOptions(),
    getCitizenOptions(),
  ]);

  return (
    <FieldReportsPage
      canCreateReports={hasPermission(permissions, "field_reports.create")}
      canManageReports={hasPermission(permissions, "field_reports.manage")}
      canManageTasks={hasPermission(permissions, "tasks.manage")}
      citizens={citizens}
      error={params?.error}
      filters={{
        q: params?.q ?? "",
        supportLevel: params?.supportLevel ?? "",
        status: params?.status ?? "",
        pollingStationCode: params?.pollingStationCode ?? "",
      }}
      pollingStations={pollingStations}
      reports={reports}
      success={params?.success}
    />
  );
}
