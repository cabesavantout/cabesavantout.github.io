import { redirect } from "next/navigation";
import { UsersPage } from "@/components/users-page";
import { getUserAdminData } from "@/lib/postgres";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";

export const dynamic = "force-dynamic";

type UsersPageProps = {
  searchParams?: Promise<{
    success?: string;
    error?: string;
  }>;
};

export default async function Page({ searchParams }: UsersPageProps) {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user) {
    redirect("/dashboard");
  }

  if (!hasPermission(permissions, "users.read")) {
    redirect("/dashboard");
  }

  const params = searchParams ? await searchParams : undefined;
  const data = await getUserAdminData();

  return (
    <UsersPage
      currentUserEmail={user.email}
      canManageUsers={hasPermission(permissions, "users.manage")}
      error={params?.error}
      orgFunctions={data.orgFunctions}
      permissions={data.permissions}
      success={params?.success}
      users={data.users}
    />
  );
}
