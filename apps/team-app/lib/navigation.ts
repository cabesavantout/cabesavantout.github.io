export type NavigationItem = {
  href: string;
  label: string;
};

export function buildNavigation(permissions: string[] = []): NavigationItem[] {
  const has = (permissionCode: string) =>
    permissions.includes("*") || permissions.includes(permissionCode);

  const canReadUsers = has("users.read");
  const canReadElections = has("elections.read");
  const canReadInsee = has("insee.read");
  const canReadTasks = has("tasks.read");
  const canReadTeam = has("team.read");
  const canReadMeetings = has("meetings.read");
  const canReadFieldReports = has("field_reports.read");
  const canReadCitizens = has("citizens.read");
  const canReadContacts = has("contacts.read");
  const canUseSearch = canReadTasks || canReadFieldReports || canReadCitizens;

  return [
    { href: "/dashboard", label: "Dashboard" },
    ...(canUseSearch ? [{ href: "/search", label: "Recherche" }] : []),
    { href: "/polling-stations", label: "Bureaux" },
    ...(canReadElections
      ? [{ href: "/electoral-analysis", label: "Analyse électorale" }]
      : []),
    ...(canReadInsee ? [{ href: "/insee", label: "INSEE" }] : []),
    ...(canReadTeam ? [{ href: "/team", label: "Couverture" }] : []),
    ...(canReadTasks ? [{ href: "/tasks", label: "Tâches" }] : []),
    ...(canReadMeetings ? [{ href: "/meetings", label: "Réunions" }] : []),
    ...(canReadFieldReports ? [{ href: "/field-reports", label: "Terrain" }] : []),
    ...(canReadFieldReports
      ? [{ href: "/field-analysis", label: "Analyse terrain" }]
      : []),
    ...(canReadCitizens ? [{ href: "/citizens", label: "Citoyens" }] : []),
    ...(canReadContacts ? [{ href: "/contacts", label: "Contacts" }] : []),
    ...(canReadUsers ? [{ href: "/users", label: "Utilisateurs" }] : []),
  ];
}
