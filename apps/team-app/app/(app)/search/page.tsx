import { redirect } from "next/navigation";
import { SearchPage } from "@/components/search-page";
import { getCurrentAccessContext, hasPermission } from "@/lib/permissions";
import { getSearchResults } from "@/lib/postgres";

export const dynamic = "force-dynamic";

type SearchPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function Page({ searchParams }: SearchPageProps) {
  const { user, permissions } = await getCurrentAccessContext();

  if (!user) {
    redirect("/login");
  }

  const params = searchParams ? await searchParams : undefined;
  const data = await getSearchResults(params?.q ?? "", {
    canReadCitizens: hasPermission(permissions, "citizens.read"),
    canReadFieldReports: hasPermission(permissions, "field_reports.read"),
    canReadTasks: hasPermission(permissions, "tasks.read"),
  });

  return <SearchPage data={data} />;
}
