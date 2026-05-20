import { DashboardPage } from "@/components/dashboard-page";
import { getDashboardData, hasDatabaseUrl } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = hasDatabaseUrl()
    ? await getDashboardData()
    : {
        stats: [],
        actionItems: [],
        priorityHighlights: [],
        sectorAlerts: [],
        upcomingMeetings: [],
        recentActivity: [],
        teamHighlights: [],
      };

  return <DashboardPage data={data} />;
}
