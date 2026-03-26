import { redirect } from "next/navigation";
import { TeamPage } from "@/components/team-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getActiveUsers, getTeamCoverageData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

type TeamPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function Page({ searchParams }: TeamPageProps) {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "team.read")) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const [data, activeUsers] = await Promise.all([
    getTeamCoverageData(),
    getActiveUsers(),
  ]);

  return (
    <TeamPage
      activeUsers={activeUsers}
      canManageTeam={hasPermission(permissions, "team.manage")}
      data={data}
      error={params?.error}
      success={params?.success}
    />
  );
}
