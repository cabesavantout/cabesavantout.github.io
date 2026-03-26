import { redirect } from "next/navigation";
import { MeetingsPage } from "@/components/meetings-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getActiveUsers, getMeetingsData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

type MeetingsPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function Page({ searchParams }: MeetingsPageProps) {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "meetings.read")) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const [meetings, activeUsers] = await Promise.all([
    getMeetingsData(),
    getActiveUsers(),
  ]);

  return (
    <MeetingsPage
      activeUsers={activeUsers}
      canManageMeetings={hasPermission(permissions, "meetings.manage")}
      error={params?.error}
      meetings={meetings}
      success={params?.success}
    />
  );
}
