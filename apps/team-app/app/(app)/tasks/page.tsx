import { redirect } from "next/navigation";
import { TasksPage } from "@/components/tasks-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getActiveUsers, getTasksData } from "@/lib/postgres";

export const dynamic = "force-dynamic";

type TasksPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function Page({ searchParams }: TasksPageProps) {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user || !hasPermission(permissions, "tasks.read")) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const [tasks, activeUsers] = await Promise.all([getTasksData(), getActiveUsers()]);

  return (
    <TasksPage
      activeUsers={activeUsers}
      canManageTasks={hasPermission(permissions, "tasks.manage")}
      error={params?.error}
      success={params?.success}
      tasks={tasks}
    />
  );
}
