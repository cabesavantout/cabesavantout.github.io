import { DashboardPage } from "@/components/dashboard-page";
import { getDashboardData, hasDatabaseUrl } from "@/lib/postgres";

export const dynamic = "force-dynamic";

export default async function Page() {
  const data = hasDatabaseUrl()
    ? await getDashboardData()
    : {
        stats: [
          { label: "Retours ouverts", value: "0" },
          { label: "Tâches ouvertes", value: "0", tone: "accent" as const },
          { label: "Réunions 7 jours", value: "0", tone: "pine" as const },
          { label: "Secteurs sans responsable", value: "0" },
          { label: "Comptes actifs", value: "0" },
        ],
        actionItems: [
          {
            label: "Base locale",
            summary: "Définir DATABASE_URL pour activer les raccourcis et compteurs du pilotage.",
            href: "/tasks",
            tone: "default" as const,
          },
        ],
        priorityHighlights: [
          {
            label: "Base locale",
            value: "Non disponible",
            summary: "Définir DATABASE_URL pour charger les indicateurs opérationnels.",
            tone: "default" as const,
          },
        ],
        sectorAlerts: [],
        upcomingMeetings: [],
        recentActivity: [],
        teamHighlights: [
          {
            label: "Base locale non configurée",
            value: "Non disponible",
            summary: "Définir DATABASE_URL pour charger les données PostgreSQL locales.",
          },
        ],
      };

  return <DashboardPage data={data} />;
}
