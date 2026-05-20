export type NavItem = {
  key: string;
  label: string;
  href?: string;
  status?: "live" | "soon";
};

export type NavGroup = {
  key: string;
  label: string;
  href: string;
  children: NavItem[];
};

type NavItemDefinition = NavItem & {
  requiredPermissions?: string[];
};

type NavGroupDefinition = Omit<NavGroup, "children"> & {
  children: NavItemDefinition[];
};

const APP_ROUTE_REGISTRY = [
  "/dashboard",
  "/search",
  "/mandate",
  "/tasks",
  "/meetings",
  "/campaign",
  "/social-media",
  "/press-releases",
  "/press",
  "/interviews",
  "/editorial-calendar",
  "/messaging",
  "/team",
  "/field-reports",
  "/field-analysis",
  "/citizens",
  "/contacts",
  "/elections",
  "/elections/history",
  "/electoral-analysis",
  "/electoral-history",
  "/insee",
  "/budget",
  "/documents",
  "/polling-stations",
  "/data-sources",
  "/settings",
  "/users",
] as const;

const HIDDEN_ROUTE_REGISTRY = ["/search", "/electoral-analysis", "/electoral-history"] as const;

const NAVIGATION_DEFINITION: readonly NavGroupDefinition[] = [
  {
    key: "home",
    label: "Vue d'ensemble",
    href: "/dashboard",
    children: [
      { key: "dashboard", label: "Vue d'ensemble", href: "/dashboard" },
    ],
  },
  {
    key: "promises",
    label: "Engagements",
    href: "/mandate",
    children: [
      {
        key: "mandate",
        label: "Engagements du mandat",
        href: "/mandate",
        requiredPermissions: ["mandate.read", "budget.read"],
      },
      { key: "budget", label: "Budget communal", href: "/budget", requiredPermissions: ["budget.read"] },
      {
        key: "municipal-documents",
        label: "Documents officiels",
        href: "/documents",
        requiredPermissions: ["budget.read", "mandate.read", "elections.read"],
      },
      { key: "tasks", label: "Plan d'action", href: "/tasks", requiredPermissions: ["tasks.read"] },
      {
        key: "meetings",
        label: "Reunions",
        href: "/meetings",
        requiredPermissions: ["meetings.read"],
      },
    ],
  },
  {
    key: "compare",
    label: "Elections",
    href: "/elections",
    children: [
      {
        key: "elections",
        label: "Synthese electorale",
        href: "/elections",
        requiredPermissions: ["elections.read"],
      },
      {
        key: "history",
        label: "Historique electoral",
        href: "/elections/history",
        requiredPermissions: ["elections.read"],
      },
      {
        key: "field-analysis",
        label: "Analyse comparative",
        href: "/field-analysis",
        requiredPermissions: ["field_reports.read"],
      },
      {
        key: "insee",
        label: "Contexte INSEE",
        href: "/insee",
        requiredPermissions: ["insee.read"],
      },
    ],
  },
  {
    key: "map",
    label: "Territoire",
    href: "/polling-stations",
    children: [
      { key: "map", label: "Carte des bureaux", href: "/polling-stations" },
      {
        key: "team",
        label: "Equipe terrain",
        href: "/team",
        requiredPermissions: ["team.read"],
      },
      {
        key: "field-reports",
        label: "Retours terrain",
        href: "/field-reports",
        requiredPermissions: ["field_reports.read"],
      },
      { key: "citizens", label: "Citoyens", href: "/citizens", requiredPermissions: ["citizens.read"] },
      { key: "contacts", label: "Contacts", href: "/contacts", requiredPermissions: ["contacts.read"] },
    ],
  },
  {
    key: "settings",
    label: "Administration",
    href: "/campaign",
    children: [
      { key: "campaign", label: "Campagne", href: "/campaign" },
      { key: "social-media", label: "Reseaux sociaux", href: "/social-media" },
      { key: "press-releases", label: "Communiques", href: "/press-releases" },
      { key: "press", label: "Presse et articles", href: "/press" },
      { key: "interviews", label: "Interviews", href: "/interviews" },
      { key: "editorial-calendar", label: "Calendrier editorial", href: "/editorial-calendar" },
      { key: "messaging", label: "Messages cles", href: "/messaging" },
      { key: "users", label: "Utilisateurs", href: "/users", requiredPermissions: ["users.read"] },
      { key: "sources", label: "Sources de donnees", href: "/data-sources" },
      { key: "settings", label: "Reglages", href: "/settings" },
    ],
  },
] as const;

function hasPermission(permissions: string[], permissionCode: string) {
  return permissions.includes("*") || permissions.includes(permissionCode);
}

function canAccess(permissions: string[], requiredPermissions?: string[]) {
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }

  return requiredPermissions.some((permissionCode) => hasPermission(permissions, permissionCode));
}

export function buildNavigation(permissions: string[] = []): NavGroup[] {
  return NAVIGATION_DEFINITION.map((group) => {
    const children = group.children.filter((item) =>
      item.status === "soon" ? true : canAccess(permissions, item.requiredPermissions),
    );
    const mappedChildren = children.map(({ key, label, href, status }) => ({
      key,
      label,
      href,
      status: status ?? "live" as const,
    }));
    const firstLiveChildHref = mappedChildren.find((item) => item.status === "live" && item.href)?.href;

    return {
      key: group.key,
      label: group.label,
      href: firstLiveChildHref ?? "/dashboard",
      children: mappedChildren,
    };
  }).filter((group) => group.children.length > 0);
}

export function isPathActive(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function getNavigationContext(pathname: string, permissions: string[] = []) {
  const groups = buildNavigation(permissions);
  const activeGroup =
    groups.find((group) => group.children.some((item) => item.href ? isPathActive(pathname, item.href) : false)) ??
    groups.find((group) => isPathActive(pathname, group.href)) ??
    groups[0] ??
    null;

  const activeItem =
    activeGroup?.children.find((item) => item.href ? isPathActive(pathname, item.href) : false) ??
    activeGroup?.children[0] ??
    null;

  return {
    groups,
    activeGroup,
    activeItem,
    subNavigation: activeGroup?.children ?? [],
  };
}

export function getNavigationCoverageIssues() {
  const registeredRoutes = new Set(APP_ROUTE_REGISTRY);
  HIDDEN_ROUTE_REGISTRY.forEach((href) => registeredRoutes.delete(href));
  const declaredRoutes = new Set(
    NAVIGATION_DEFINITION.flatMap((group) => group.children.map((item) => item.href).filter(Boolean)),
  );

  return [...registeredRoutes].filter((href) => !declaredRoutes.has(href));
}

const coverageIssues = getNavigationCoverageIssues();

if (coverageIssues.length > 0) {
  throw new Error(
    `Navigation coverage is incomplete. Missing routes: ${coverageIssues.join(", ")}`,
  );
}
