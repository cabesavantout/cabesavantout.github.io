import { redirect } from "next/navigation";
import { CitizensPage } from "@/components/citizens-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getCitizensData, getPollingStationOptions } from "@/lib/postgres";

export const dynamic = "force-dynamic";

type CitizensPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
    q?: string;
    supportLevel?: string;
    pollingStationCode?: string;
  }>;
};

export default async function Page({ searchParams }: CitizensPageProps) {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "citizens.read")) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const [citizens, pollingStations] = await Promise.all([
    getCitizensData({
      q: params?.q,
      supportLevel: params?.supportLevel,
      pollingStationCode: params?.pollingStationCode,
    }),
    getPollingStationOptions(),
  ]);

  return (
    <CitizensPage
      canManageCitizens={hasPermission(permissions, "citizens.manage")}
      citizens={citizens}
      error={params?.error}
      filters={{
        q: params?.q ?? "",
        supportLevel: params?.supportLevel ?? "",
        pollingStationCode: params?.pollingStationCode ?? "",
      }}
      pollingStations={pollingStations}
      success={params?.success}
    />
  );
}
